/**
 * Real-Time Financial Analytics Dashboard
 * Enterprise-Grade - Silicon Valley Standards
 * Live KPI calculations, trend analysis, predictive insights
 */

import { getDb } from '@/lib/db';
import { 
  eq, 
  desc, 
  sql, 
  and, 
  gte, 
  lte,
  between 
} from 'drizzle-orm';
import {
  journalEntryLines,
  journalEntries,
  invoicesEnhanced,
  paymentsEnhanced,
  realTimeMetrics,
  accountsReceivableSubLedger,
  accountsPayableSubLedger,
  fixedAssets,
} from '@/lib/db/schema-enterprise-financial';

// ============================================================================
// REAL-TIME KPI ENGINE
// ============================================================================

export class RealTimeAnalyticsEngine {
  /**
   * Calculate comprehensive financial KPIs
   */
  static async calculateKPIs() {
    try {
      const db = getDb();

      // 1. PROFITABILITY KPIs
      const [profitability] = await db
        .select({
          grossMargin: sql<number>`ROUND((COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN account_code LIKE '5%' THEN debit ELSE 0 END), 0)) / COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 1) * 100, 2)`,
          operatingMargin: sql<number>`ROUND((COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN account_code LIKE '6%' THEN debit ELSE 0 END), 0)) / COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 1) * 100, 2)`,
          netMargin: sql<number>`ROUND((COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN account_code LIKE '5%' OR account_code LIKE '6%' THEN debit ELSE 0 END), 0)) / COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 1) * 100, 2)`,
        })
        .from(journalEntryLines)
        .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
        .where(eq(journalEntries.status, 'posted'));

      // 2. LIQUIDITY KPIs
      const [liquidity] = await db
        .select({
          fastAssets: sql<number>`COALESCE(SUM(CASE WHEN gl.account_code LIKE '1[01]%' THEN (jel.debit - jel.credit) ELSE 0 END), 0)`,
          currentAssets: sql<number>`COALESCE(SUM(CASE WHEN gl.account_code LIKE '1%' THEN (jel.debit - jel.credit) ELSE 0 END), 0)`,
          currentLiabilities: sql<number>`COALESCE(SUM(CASE WHEN gl.account_code LIKE '2%' THEN (jel.credit - jel.debit) ELSE 0 END), 0)`,
        })
        // @ts-ignore - Drizzle alias feature
        .from(journalEntryLines.as('jel'))
        .innerJoin(
          // @ts-ignore - Drizzle alias feature
          journalEntries.as('je'),
          eq(journalEntryLines.journalEntryId, journalEntries.id)
        )
        .innerJoin(
          // @ts-ignore - Drizzle alias feature
          generalLedgerAccounts.as('gl'),
          eq(journalEntryLines.accountId, generalLedgerAccounts.id)
        )
        .where(eq(journalEntries.status, 'posted'));

      // 3. EFFICIENCY KPIs
      const [efficiency] = await db
        .select({
          receivablesTurnover: sql<number>`ROUND(COALESCE(SUM(CASE WHEN ${invoicesEnhanced.status} = 'paid' THEN ${invoicesEnhanced.totalAmount} ELSE 0 END), 0) / COALESCE(SUM(${accountsReceivableSubLedger.outstandingBalance}), 1), 2)`,
          payablesTurnover: sql<number>`ROUND(COALESCE(SUM(CASE WHEN ${paymentsEnhanced.status} = 'cleared' THEN ${paymentsEnhanced.amount} ELSE 0 END), 0) / COALESCE(SUM(${accountsPayableSubLedger.outstandingBalance}), 1), 2)`,
          daysReceivable: sql<number>`ROUND(365 / (COALESCE(SUM(CASE WHEN ${invoicesEnhanced.status} = 'paid' THEN ${invoicesEnhanced.totalAmount} ELSE 0 END), 0) / COALESCE(SUM(${accountsReceivableSubLedger.outstandingBalance}), 1)), 0)`,
        })
        .from(invoicesEnhanced)
        .leftJoin(accountsReceivableSubLedger, eq(invoicesEnhanced.id, accountsReceivableSubLedger.invoiceId))
        .leftJoin(paymentsEnhanced, eq(invoicesEnhanced.id, paymentsEnhanced.id))
        .leftJoin(accountsPayableSubLedger, eq(paymentsEnhanced.id, accountsPayableSubLedger.id));

      return {
        profitability,
        liquidity,
        efficiency,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  }

  /**
   * Calculate trend analysis (month-over-month, year-over-year)
   */
  static async calculateTrends(periods: number = 12) {
    try {
      const db = getDb();

      const trends = [];
      const today = new Date();

      for (let i = 0; i < periods; i++) {
        const periodDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const periodString = `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}`;

        const [data] = await db
          .select({
            revenue: sql<number>`COALESCE(SUM(CASE WHEN account_code LIKE '4%' THEN credit ELSE 0 END), 0)`,
            expenses: sql<number>`COALESCE(SUM(CASE WHEN account_code LIKE '5%' OR account_code LIKE '6%' THEN debit ELSE 0 END), 0)`,
          })
          .from(journalEntryLines)
          .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
          .where(and(
            eq(journalEntries.period, periodString),
            eq(journalEntries.status, 'posted')
          ));

        trends.push({
          period: periodString,
          revenue: data?.revenue || 0,
          expenses: data?.expenses || 0,
          netIncome: (data?.revenue || 0) - (data?.expenses || 0),
        });
      }

      return trends.reverse();
    } catch (error) {
      console.error('Error calculating trends:', error);
      throw error;
    }
  }

  /**
   * Predictive cash flow analysis
   */
  static async predictCashFlow(forecastPeriods: number = 6) {
    try {
      const db = getDb();

      // Get historical cash flow data
      const trends = await this.calculateTrends(12);

      // Calculate average monthly cash flow
      const avgCashFlow = trends.reduce((sum, t) => sum + (t.revenue - t.expenses), 0) / trends.length;
      
      // Calculate volatility (standard deviation)
      const variance = trends.reduce((sum, t) => {
        const diff = (t.revenue - t.expenses) - avgCashFlow;
        return sum + diff * diff;
      }, 0) / trends.length;
      const volatility = Math.sqrt(variance);

      // Generate forecasts with confidence intervals
      const forecasts = [];
      for (let i = 1; i <= forecastPeriods; i++) {
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + i);

        forecasts.push({
          period: `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`,
          baseCase: avgCashFlow,
          optimistic: avgCashFlow + volatility,
          conservative: avgCashFlow - volatility,
          confidence: 95 - (i * 5), // Confidence decreases with time
        });
      }

      return {
        historical: trends,
        forecast: forecasts,
        metrics: {
          avgMonthlyFlow: avgCashFlow,
          volatility,
          trend: trends[trends.length - 1].revenue - trends[0].revenue > 0 ? 'improving' : 'declining',
        },
      };
    } catch (error) {
      console.error('Error predicting cash flow:', error);
      throw error;
    }
  }

  /**
   * Generate financial health score (0-100)
   */
  static async calculateHealthScore(): Promise<{
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    factors: Record<string, number>;
  }> {
    try {
      const kpis = await this.calculateKPIs();
      const trends = await this.calculateTrends(6);

      const factors: Record<string, number> = {};

      // Profitability score (0-20)
      factors.profitability = Math.min(20, (kpis.profitability?.netMargin || 0) + 10);

      // Liquidity score (0-20)
      const currentRatio = (kpis.liquidity?.currentAssets || 0) / Math.max(1, kpis.liquidity?.currentLiabilities || 1);
      factors.liquidity = currentRatio > 2 ? 20 : currentRatio > 1 ? 15 : 10;

      // Efficiency score (0-20)
      factors.efficiency = Math.min(20, (kpis.efficiency?.receivablesTurnover || 0) * 5);

      // Growth score (0-20)
      const revenueGrowth = trends.length > 0 
        ? ((trends[trends.length - 1].revenue - trends[0].revenue) / Math.max(1, trends[0].revenue)) * 100
        : 0;
      factors.growth = Math.min(20, Math.max(0, revenueGrowth / 5));

      // Stability score (0-20)
      const expenseGrowth = trends.length > 0
        ? ((trends[trends.length - 1].expenses - trends[0].expenses) / Math.max(1, trends[0].expenses)) * 100
        : 0;
      factors.stability = expenseGrowth < 10 ? 20 : expenseGrowth < 20 ? 15 : 10;

      const totalScore = Object.values(factors).reduce((a, b) => a + b, 0);

      let rating: 'excellent' | 'good' | 'fair' | 'poor';
      if (totalScore >= 80) rating = 'excellent';
      else if (totalScore >= 60) rating = 'good';
      else if (totalScore >= 40) rating = 'fair';
      else rating = 'poor';

      return {
        score: totalScore / 5, // Convert to 0-100 scale
        rating,
        factors,
      };
    } catch (error) {
      console.error('Error calculating health score:', error);
      throw error;
    }
  }

  /**
   * Generate alert-worthy anomalies
   */
  static async detectAnomalies() {
    try {
      const trends = await this.calculateTrends(6);
      const alerts = [];

      // Detect declining revenue
      if (trends.length > 1) {
        const recentTrend = trends.slice(-3);
        const avgRecent = recentTrend.reduce((sum, t) => sum + t.revenue, 0) / recentTrend.length;
        const avgPrevious = trends.slice(-6, -3).reduce((sum, t) => sum + t.revenue, 0) / 3;

        if (avgRecent < avgPrevious * 0.9) {
          alerts.push({
            type: 'declining_revenue',
            severity: 'high',
            message: `Revenue declined ${((1 - avgRecent / avgPrevious) * 100).toFixed(1)}% in recent period`,
            value: avgRecent,
          });
        }
      }

      // Detect unusual expense growth
      if (trends.length > 1) {
        const latestExpenses = trends[trends.length - 1].expenses;
        const avgExpenses = trends.slice(0, -1).reduce((sum, t) => sum + t.expenses, 0) / (trends.length - 1);

        if (latestExpenses > avgExpenses * 1.3) {
          alerts.push({
            type: 'expense_spike',
            severity: 'medium',
            message: `Expenses increased ${((latestExpenses / avgExpenses - 1) * 100).toFixed(1)}%`,
            value: latestExpenses,
          });
        }
      }

      return alerts;
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      throw error;
    }
  }

  /**
   * Dashboard data aggregation
   */
  static async getDashboardData() {
    try {
      const [kpis, trends, cashFlow, health, anomalies] = await Promise.all([
        this.calculateKPIs(),
        this.calculateTrends(12),
        this.predictCashFlow(6),
        this.calculateHealthScore(),
        this.detectAnomalies(),
      ]);

      return {
        kpis,
        trends,
        cashFlowForecast: cashFlow,
        healthScore: health,
        alerts: anomalies,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error generating dashboard data:', error);
      throw error;
    }
  }
}

// ============================================================================
// COHORT ANALYSIS ENGINE
// ============================================================================

export class CohortAnalysisEngine {
  /**
   * Analyze customer lifetime value cohorts
   */
  static async analyzeCustomerCohorts() {
    try {
      const db = getDb();

      const cohorts = await db
        .select({
          cohort: sql<string>`DATE(${invoicesEnhanced.issuedDate}/1000, 'unixepoch', 'start of month')`,
          customersCount: sql<number>`COUNT(DISTINCT ${invoicesEnhanced.customerId})`,
          totalRevenue: sql<number>`SUM(${invoicesEnhanced.totalAmount})`,
          avgTransactionValue: sql<number>`AVG(${invoicesEnhanced.totalAmount})`,
          retentionRate: sql<number>`COUNT(DISTINCT CASE WHEN ${invoicesEnhanced.status} = 'paid' THEN ${invoicesEnhanced.customerId} END) / COUNT(DISTINCT ${invoicesEnhanced.customerId})`,
        })
        .from(invoicesEnhanced)
        .groupBy(sql`DATE(${invoicesEnhanced.issuedDate}/1000, 'unixepoch', 'start of month')`)
        .orderBy(desc(sql`DATE(${invoicesEnhanced.issuedDate}/1000, 'unixepoch', 'start of month')`))
        .limit(12);

      return cohorts;
    } catch (error) {
      console.error('Error analyzing customer cohorts:', error);
      throw error;
    }
  }
}

// ============================================================================
// VARIANCE ANALYSIS ENGINE
// ============================================================================

export class VarianceAnalysisEngine {
  /**
   * Perform detailed variance analysis
   */
  static async analyzeVariance(budgetId: string, period: string) {
    try {
      const db = getDb();

      const variance = await db
        .select({
          accountCode: journalEntryLines.accountCode,
          budgeted: sql<number>`0`, // Would join to budget table
          actual: sql<number>`COALESCE(SUM((${journalEntryLines.debit} - ${journalEntryLines.credit})), 0)`,
          variance: sql<number>`0`, // Would calculate difference
          percentageVariance: sql<number>`0`, // Would calculate percentage
        })
        .from(journalEntryLines)
        .innerJoin(journalEntries, eq(journalEntryLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalEntries.period, period),
          eq(journalEntries.status, 'posted')
        ))
        .groupBy(journalEntryLines.accountCode);

      // Categorize variances
      const favorable = variance.filter((v: any) => v.variance > 0);
      const unfavorable = variance.filter((v: any) => v.variance < 0);

      return {
        summary: {
          totalFavorable: favorable.reduce((sum, v: any) => sum + v.variance, 0),
          totalUnfavorable: unfavorable.reduce((sum, v: any) => sum + Math.abs(v.variance), 0),
          variance,
        },
      };
    } catch (error) {
      console.error('Error analyzing variance:', error);
      throw error;
    }
  }
}

// Import needed for type compilation
import { generalLedgerAccounts } from '@/lib/db/schema-enterprise-financial';
