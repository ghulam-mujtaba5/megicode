import ExcelJS from 'exceljs';
import { writeFile } from 'node:fs/promises';

type Row = Record<string, unknown>;
type Sheet = Row[];

export interface CompatWorkbook {
  Sheets: Record<string, Sheet>;
  SheetNames: string[];
}

export const utils = {
  book_new(): CompatWorkbook {
    return { Sheets: {}, SheetNames: [] };
  },

  json_to_sheet(rows: Row[]): Sheet {
    return rows;
  },

  book_append_sheet(workbook: CompatWorkbook, sheet: Sheet, name: string) {
    workbook.Sheets[name] = sheet;
    if (!workbook.SheetNames.includes(name)) {
      workbook.SheetNames.push(name);
    }
  },
};

function collectColumns(rows: Sheet) {
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)));
  return Array.from(keys).map((key) => ({ header: key, key, width: Math.min(Math.max(key.length + 4, 12), 40) }));
}

async function toExcelWorkbook(workbook: CompatWorkbook) {
  const excelWorkbook = new ExcelJS.Workbook();
  excelWorkbook.creator = 'Megicode';
  excelWorkbook.created = new Date();

  workbook.SheetNames.forEach((sheetName) => {
    const rows = workbook.Sheets[sheetName] || [];
    const worksheet = excelWorkbook.addWorksheet(sheetName.slice(0, 31));
    worksheet.columns = collectColumns(rows);
    worksheet.addRows(rows);
    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  });

  return excelWorkbook;
}

export async function writeWorkbookBuffer(workbook: CompatWorkbook) {
  const excelWorkbook = await toExcelWorkbook(workbook);
  const buffer = await excelWorkbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function writeWorkbookFile(workbook: CompatWorkbook, outputPath: string) {
  const buffer = await writeWorkbookBuffer(workbook);
  await writeFile(outputPath, buffer);
}
