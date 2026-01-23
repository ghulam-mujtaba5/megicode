import { getDb } from '@/lib/db';
import { expenseTags, expenseTagMappings, expenses } from '@/lib/db/schema';
import { desc, sql, inArray } from 'drizzle-orm';
import ExpenseTagsClient from './ExpenseTagsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Expense Tags | Internal Portal',
  description: 'Manage and organize expense tags for better categorization',
};

export default async function ExpenseTagsPage() {
  const db = getDb();
  
  // Fetch all expense tags with usage counts
  const tags = await db.select({
    id: expenseTags.id,
    name: expenseTags.name,
    color: expenseTags.color,
    description: expenseTags.description,
    createdAt: expenseTags.createdAt,
  }).from(expenseTags)
    .orderBy(expenseTags.name);

  // Get usage count for each tag
  const tagUsage = await db.select({
    tagId: expenseTagMappings.tagId,
    count: sql<number>`COUNT(*)`,
  })
    .from(expenseTagMappings)
    .groupBy(expenseTagMappings.tagId);

  const usageMap = Object.fromEntries(tagUsage.map(t => [t.tagId, t.count || 0]));

  // Fetch recent expenses that have tags
  const recentTaggedExpenses = await db.select({
    expenseId: expenseTagMappings.expenseId,
    tagId: expenseTagMappings.tagId,
  })
    .from(expenseTagMappings)
    .limit(100);

  const expenseIds = [...new Set(recentTaggedExpenses.map(e => e.expenseId))];
  
  let expenseDetails: { id: string; description: string | null; amount: number; expenseDate: Date | null }[] = [];
  if (expenseIds.length > 0) {
    expenseDetails = await db.select({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      expenseDate: expenses.expenseDate,
    })
      .from(expenses)
      .where(inArray(expenses.id, expenseIds))
      .orderBy(desc(expenses.expenseDate))
      .limit(20);
  }

  // Build tag-expense relationship for preview
  const tagExpenseMap = new Map<string, string[]>();
  recentTaggedExpenses.forEach(({ tagId, expenseId }) => {
    if (!tagExpenseMap.has(tagId)) {
      tagExpenseMap.set(tagId, []);
    }
    tagExpenseMap.get(tagId)?.push(expenseId);
  });

  return (
    <ExpenseTagsClient 
      tags={tags.map(tag => ({
        ...tag,
        usageCount: usageMap[tag.id] || 0,
        createdAt: tag.createdAt ? new Date(tag.createdAt).toISOString() : null,
      }))}
      recentTaggedExpenses={expenseDetails.map(e => ({
        id: e.id,
        description: e.description,
        amount: e.amount,
        date: e.expenseDate ? new Date(e.expenseDate).toISOString().split('T')[0] : '',
      }))}
      tagExpenseMap={Object.fromEntries(tagExpenseMap)}
    />
  );
}
