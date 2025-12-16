/**
 * Theme Consistency Checker
 * Identifies hardcoded colors and theme issues in internal portal
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ThemeIssue {
  file: string;
  line: number;
  issue: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

const issues: ThemeIssue[] = [];

// Patterns that indicate potential theme issues
const HARDCODED_COLOR_PATTERNS = [
  // Hex colors
  /#(?:[0-9a-fA-F]{3}){1,2}\b/g,
  // rgb/rgba
  /rgba?\([^)]+\)/g,
];

const HARDCODED_BG_PATTERNS = [
  /background:\s*#/gi,
  /background:\s*rgb/gi,
  /backgroundColor:\s*['"]#/gi,
  /backgroundColor:\s*['"]rgb/gi,
  /bg-\[#/gi, // Tailwind arbitrary values
];

const HARDCODED_TEXT_PATTERNS = [
  /color:\s*#/gi,
  /color:\s*rgb/gi,
  /color:\s*['"]#/gi,
  /color:\s*['"]rgb/gi,
  /text-\[#/gi,
];

// Files to check
const INTERNAL_PATTERNS = [
  'app/internal/**/*.tsx',
  'app/internal/**/*.ts',
  'app/internal/**/*.css',
  'app/internal/**/*.module.css',
  'components/Internal*/**/*.tsx',
  'components/Internal*/**/*.css',
  'components/Internal*/**/*.module.css',
];

async function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const isCSSFile = filePath.endsWith('.css');
  const isTSXFile = filePath.endsWith('.tsx') || filePath.endsWith('.ts');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip comments
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      return;
    }

    // Skip import statements
    if (trimmedLine.startsWith('import ')) {
      return;
    }

    // Check for hardcoded backgrounds
    HARDCODED_BG_PATTERNS.forEach(pattern => {
      if (pattern.test(line)) {
        // Check if it's using CSS variables
        if (line.includes('var(--') || line.includes('inherit') || line.includes('transparent')) {
          return;
        }
        
        issues.push({
          file: filePath,
          line: lineNum,
          issue: 'Hardcoded background color - should use CSS variable',
          code: trimmedLine.substring(0, 100),
          severity: 'error',
        });
      }
    });

    // Check for hardcoded text colors
    HARDCODED_TEXT_PATTERNS.forEach(pattern => {
      if (pattern.test(line)) {
        // Check if it's using CSS variables
        if (line.includes('var(--') || line.includes('inherit') || line.includes('currentColor')) {
          return;
        }
        
        // Allow white color in specific contexts (badges, buttons with backgrounds)
        if (line.includes('white') || line.includes('#fff') || line.includes('#ffffff')) {
          if (line.includes('gradient') || line.includes('badge') || line.includes('btn')) {
            return;
          }
        }
        
        issues.push({
          file: filePath,
          line: lineNum,
          issue: 'Hardcoded text color - should use CSS variable',
          code: trimmedLine.substring(0, 100),
          severity: 'error',
        });
      }
    });

    // Check for missing theme-aware selectors in CSS files
    if (isCSSFile && (line.includes('background:') || line.includes('color:'))) {
      if (!line.includes('var(--')) {
        const hasThemeSelector = content.includes('[data-theme="dark"]') || content.includes('.dark');
        if (!hasThemeSelector && !line.includes('inherit') && !line.includes('transparent')) {
          issues.push({
            file: filePath,
            line: lineNum,
            issue: 'CSS file missing dark theme selectors',
            code: trimmedLine.substring(0, 100),
            severity: 'warning',
          });
        }
      }
    }

    // Check for inline styles in TSX without theme awareness
    if (isTSXFile && line.includes('style={{')) {
      if ((line.includes('background') || line.includes('color')) && !line.includes('var(--')) {
        // Allow specific cases
        if (line.includes('transparent') || line.includes('inherit') || line.includes('currentColor')) {
          return;
        }
        
        issues.push({
          file: filePath,
          line: lineNum,
          issue: 'Inline style without CSS variable - may not adapt to theme changes',
          code: trimmedLine.substring(0, 100),
          severity: 'warning',
        });
      }
    }
  });
}

async function run() {
  console.log('='.repeat(80));
  console.log('THEME CONSISTENCY CHECK');
  console.log('='.repeat(80));
  console.log('Checking internal portal files for theme issues...\n');

  const files: string[] = [];
  
  for (const pattern of INTERNAL_PATTERNS) {
    const matches = glob.sync(pattern, {
      cwd: process.cwd(),
      absolute: false,
      ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    });
    files.push(...matches);
  }

  console.log(`Found ${files.length} files to check\n`);

  for (const file of files) {
    checkFile(file);
  }

  // Group issues by file
  const issuesByFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {} as Record<string, ThemeIssue[]>);

  // Print results
  console.log('='.repeat(80));
  console.log('ISSUES FOUND');
  console.log('='.repeat(80));

  if (issues.length === 0) {
    console.log('\n✓ No theme issues found! All files are using CSS variables correctly.\n');
  } else {
    Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
      console.log(`\n📄 ${file}`);
      console.log('-'.repeat(80));
      
      fileIssues.forEach(issue => {
        const icon = issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : 'ℹ';
        const color = issue.severity === 'error' ? '\x1b[31m' : issue.severity === 'warning' ? '\x1b[33m' : '\x1b[36m';
        const reset = '\x1b[0m';
        
        console.log(`${color}${icon}${reset} Line ${issue.line}: ${issue.issue}`);
        console.log(`  ${issue.code}`);
      });
    });

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    
    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const infos = issues.filter(i => i.severity === 'info').length;
    
    console.log(`Total Issues: ${issues.length}`);
    console.log(`  ✗ Errors: ${errors}`);
    console.log(`  ⚠ Warnings: ${warnings}`);
    console.log(`  ℹ Info: ${infos}`);
    console.log(`\nFiles affected: ${Object.keys(issuesByFile).length}`);
  }

  console.log('\n' + '='.repeat(80));
}

run().catch(error => {
  console.error('Error running theme check:', error);
  process.exit(1);
});
