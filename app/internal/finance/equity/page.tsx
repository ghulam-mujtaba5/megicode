import { getDb } from '@/lib/db';
import { founders, founderEquityHistory, founderVestingSchedules, founderDraws, founderContributions, founderDistributionItems } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import EquityTrackingClient from './EquityTrackingClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Equity Tracking | Internal Portal',
  description: 'Track founder equity, vesting schedules, and ownership history',
};

export default async function EquityTrackingPage() {
  const db = getDb();
  
  // Fetch all founders
  const foundersList = await db.select().from(founders)
    .orderBy(desc(founders.profitSharePercentage));

  // Fetch equity history for all founders
  const equityHistory = await db.select().from(founderEquityHistory)
    .orderBy(desc(founderEquityHistory.effectiveDate));

  // Fetch vesting schedules
  const vestingSchedules = await db.select().from(founderVestingSchedules)
    .orderBy(founderVestingSchedules.vestingStartDate);

  // Fetch founder draws
  const draws = await db.select().from(founderDraws)
    .orderBy(desc(founderDraws.requestedAt));

  // Fetch contributions and distributions for financial summary
  const contributions = await db.select({
    founderId: founderContributions.founderId,
    total: sql<number>`SUM(${founderContributions.amount})`,
  })
    .from(founderContributions)
    .groupBy(founderContributions.founderId);

  const distributions = await db.select({
    founderId: founderDistributionItems.founderId,
    total: sql<number>`SUM(${founderDistributionItems.netAmount})`,
  })
    .from(founderDistributionItems)
    .where(eq(founderDistributionItems.status, 'transferred'))
    .groupBy(founderDistributionItems.founderId);

  // Build contribution/distribution maps
  const contributionMap = Object.fromEntries(contributions.map(c => [c.founderId, c.total || 0]));
  const distributionMap = Object.fromEntries(distributions.map(d => [d.founderId, d.total || 0]));

  // Combine data for client
  const foundersWithData = foundersList.map(founder => ({
    id: founder.id,
    name: founder.name,
    email: founder.email,
    equityPercentage: founder.profitSharePercentage,
    investmentAmount: 0, // This field doesn't exist in the schema
    status: founder.status,
    joinedDate: founder.joinedAt,
    contributions: contributionMap[founder.id] || 0,
    distributions: distributionMap[founder.id] || 0,
    equityHistory: equityHistory
      .filter(h => h.founderId === founder.id)
      .map(h => ({
        id: h.id,
        previousPercentage: h.previousPercentage,
        newPercentage: h.newPercentage,
        changeReason: h.reason,
        effectiveDate: h.effectiveDate ? new Date(h.effectiveDate).toISOString() : '',
        notes: h.notes,
      })),
    vestingSchedules: vestingSchedules
      .filter(v => v.founderId === founder.id)
      .map(v => ({
        id: v.id,
        totalEquity: v.totalEquity,
        vestedEquity: v.vestedEquity,
        vestingPeriodMonths: v.vestingPeriodMonths,
        cliffMonths: v.cliffMonths,
        startDate: v.vestingStartDate ? new Date(v.vestingStartDate).toISOString() : '',
        nextVestingDate: v.vestingEndDate ? new Date(v.vestingEndDate).toISOString() : null,
        status: v.status,
      })),
    draws: draws
      .filter(d => d.founderId === founder.id)
      .map(d => ({
        id: d.id,
        amount: d.amount,
        date: d.requestedAt ? new Date(d.requestedAt).toISOString() : '',
        repaymentDueDate: d.paidAt ? new Date(d.paidAt).toISOString() : null,
        repaidAmount: d.repaidAmount,
        status: d.status,
        notes: d.notes,
      })),
  }));

  return (
    <EquityTrackingClient founders={foundersWithData} />
  );
}
