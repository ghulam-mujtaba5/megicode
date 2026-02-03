/**
 * Founder Balance Widget
 * Shows each founder's current financial status including:
 * - Total contributions
 * - Total distributions received
 * - Withdrawable balance (their share of company profits)
 * - Contribution vs Distribution history
 */
'use client';

import { useMemo } from 'react';
import s from '../styles.module.css';

interface Founder {
  id: string;
  name: string;
  email: string | null;
  profitSharePercentage: number;
  status: 'active' | 'inactive';
  totalContributions?: number;
  totalDistributions?: number;
}

interface FounderBalanceWidgetProps {
  founders: Founder[];
  companyProfit: number;
  companyRetentionPercent?: number; // Default 20%
  currency?: string;
  onDistribute?: (founderId: string, amount: number) => void;
}

function formatMoney(amount: number, currency: string = 'PKR') {
  const value = amount || 0;
  if (currency === 'PKR') {
    return `Rs. ${value.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function FounderBalanceWidget({
  founders,
  companyProfit,
  companyRetentionPercent = 20,
  currency = 'PKR',
  onDistribute,
}: FounderBalanceWidgetProps) {
  const activeFounders = founders.filter(f => f.status === 'active');
  
  const calculations = useMemo(() => {
    // Company keeps retention percentage
    const companyRetention = Math.floor(companyProfit * (companyRetentionPercent / 100));
    const distributableAmount = companyProfit - companyRetention;
    
    // Calculate each founder's share
    const founderShares = activeFounders.map(founder => {
      const sharePercent = founder.profitSharePercentage;
      const grossShare = Math.floor(distributableAmount * (sharePercent / 100));
      const alreadyDistributed = founder.totalDistributions || 0;
      const withdrawable = Math.max(0, grossShare - alreadyDistributed);
      const contributed = founder.totalContributions || 0;
      
      // Net position = contributions + distributions received - (their share ownership value)
      // Simpler: contributions made + distributions received
      const netPosition = contributed + alreadyDistributed;
      
      return {
        founder,
        sharePercent,
        grossShare,
        alreadyDistributed,
        withdrawable,
        contributed,
        netPosition,
      };
    });
    
    const totalDistributable = founderShares.reduce((sum, f) => sum + f.withdrawable, 0);
    
    return {
      companyRetention,
      distributableAmount,
      founderShares,
      totalDistributable,
    };
  }, [activeFounders, companyProfit, companyRetentionPercent]);

  if (activeFounders.length === 0) {
    return (
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>👥 Founder Balances</h3>
        </div>
        <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-8)' }}>
          <p style={{ color: 'var(--int-text-muted)' }}>No active founders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>👥 Founder Balances & Profit Shares</h3>
        <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
          {companyRetentionPercent}% Company Retention | {100 - companyRetentionPercent}% Founder Distribution
        </div>
      </div>
      <div className={s.cardBody}>
        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--int-space-4)',
          marginBottom: 'var(--int-space-6)'
        }}>
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-info-light)', 
            borderRadius: 'var(--int-radius)',
            borderLeft: '4px solid var(--int-info)'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-info)', fontWeight: 600 }}>
              TOTAL COMPANY PROFIT
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-text-primary)' }}>
              {formatMoney(companyProfit, currency)}
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-primary-light)', 
            borderRadius: 'var(--int-radius)',
            borderLeft: '4px solid var(--int-primary)'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-primary)', fontWeight: 600 }}>
              COMPANY RETENTION ({companyRetentionPercent}%)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-text-primary)' }}>
              {formatMoney(calculations.companyRetention, currency)}
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--int-space-4)', 
            background: 'var(--int-success-light)', 
            borderRadius: 'var(--int-radius)',
            borderLeft: '4px solid var(--int-success)'
          }}>
            <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-success)', fontWeight: 600 }}>
              DISTRIBUTABLE TO FOUNDERS
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--int-text-primary)' }}>
              {formatMoney(calculations.distributableAmount, currency)}
            </div>
          </div>
        </div>

        {/* Founder Cards */}
        <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
          {calculations.founderShares.map(({ founder, sharePercent, grossShare, alreadyDistributed, withdrawable, contributed }) => (
            <div 
              key={founder.id}
              style={{ 
                padding: 'var(--int-space-4)', 
                background: 'var(--int-bg-secondary)', 
                borderRadius: 'var(--int-radius)',
                border: '1px solid var(--int-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--int-space-4)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--int-text-lg)' }}>{founder.name}</div>
                  <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                    {founder.email || 'No email'}
                  </div>
                </div>
                <div style={{ 
                  padding: 'var(--int-space-2) var(--int-space-3)', 
                  background: 'var(--int-primary)', 
                  color: 'white',
                  borderRadius: 'var(--int-radius)',
                  fontWeight: 700
                }}>
                  {sharePercent}% Share
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--int-space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
                    Contributed
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--int-success)' }}>
                    {formatMoney(contributed, currency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
                    Gross Share
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {formatMoney(grossShare, currency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
                    Already Received
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--int-info)' }}>
                    {formatMoney(alreadyDistributed, currency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
                    Withdrawable
                  </div>
                  <div style={{ fontWeight: 700, color: withdrawable > 0 ? 'var(--int-success)' : 'var(--int-text-muted)' }}>
                    {formatMoney(withdrawable, currency)}
                  </div>
                </div>
              </div>
              
              {/* Progress bar showing distribution status */}
              <div style={{ marginTop: 'var(--int-space-3)' }}>
                <div style={{ 
                  height: '8px', 
                  background: 'var(--int-border)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${grossShare > 0 ? Math.min(100, (alreadyDistributed / grossShare) * 100) : 0}%`,
                    background: 'linear-gradient(90deg, var(--int-success) 0%, var(--int-primary) 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
                  {grossShare > 0 ? Math.round((alreadyDistributed / grossShare) * 100) : 0}% distributed
                </div>
              </div>
              
              {onDistribute && withdrawable > 0 && (
                <button
                  onClick={() => onDistribute(founder.id, withdrawable)}
                  style={{
                    marginTop: 'var(--int-space-3)',
                    padding: 'var(--int-space-2) var(--int-space-4)',
                    background: 'var(--int-success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--int-radius)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 'var(--int-text-sm)'
                  }}
                >
                  Distribute {formatMoney(withdrawable, currency)}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for dashboard overview
 */
export function FounderBalanceSummary({
  founders,
  companyProfit,
  companyRetentionPercent = 20,
  currency = 'PKR',
}: Omit<FounderBalanceWidgetProps, 'onDistribute'>) {
  const activeFounders = founders.filter(f => f.status === 'active');
  
  const distributableAmount = Math.floor(companyProfit * ((100 - companyRetentionPercent) / 100));
  
  return (
    <div style={{ display: 'grid', gap: 'var(--int-space-3)' }}>
      {activeFounders.map(founder => {
        const grossShare = Math.floor(distributableAmount * (founder.profitSharePercentage / 100));
        const received = founder.totalDistributions || 0;
        const withdrawable = Math.max(0, grossShare - received);
        
        return (
          <div 
            key={founder.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: 'var(--int-space-3)',
              background: 'var(--int-bg-secondary)',
              borderRadius: 'var(--int-radius)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-3)' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'var(--int-primary-light)',
                color: 'var(--int-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {founder.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{founder.name}</div>
                <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                  {founder.profitSharePercentage}% profit share
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: withdrawable > 0 ? 'var(--int-success)' : 'var(--int-text-muted)' }}>
                {formatMoney(withdrawable, currency)}
              </div>
              <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                withdrawable
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
