/**
 * Profit Distribution Calculator
 * Interactive tool to calculate and preview profit distributions
 * before executing them. Perfect for megicode's 20/80 split model.
 */
'use client';

import { useState, useMemo } from 'react';
import s from '../styles.module.css';

interface Founder {
  id: string;
  name: string;
  profitSharePercentage: number;
  status: 'active' | 'inactive';
}

interface ProjectForDistribution {
  id: string;
  name: string;
  clientName: string;
  totalContractValue: number;
  amountReceived: number;
  directCosts: number;
  netProfit: number;
  status: string;
}

interface ProfitDistributionCalcProps {
  founders: Founder[];
  completedProjects?: ProjectForDistribution[];
  companyRetentionPercent?: number;
  currency?: string;
  onCreateDistribution?: (distribution: DistributionPreview) => void;
}

interface DistributionPreview {
  projectIds: string[];
  totalProfit: number;
  companyRetention: number;
  founderDistributions: {
    founderId: string;
    founderName: string;
    sharePercent: number;
    grossAmount: number;
    netAmount: number;
  }[];
  period: string;
  notes: string;
}

function formatMoney(amount: number, currency: string = 'PKR') {
  const value = amount || 0;
  if (currency === 'PKR') {
    return `Rs. ${value.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function ProfitDistributionCalculator({
  founders,
  completedProjects = [],
  companyRetentionPercent = 20,
  currency = 'PKR',
  onCreateDistribution,
}: ProfitDistributionCalcProps) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [distributionPeriod, setDistributionPeriod] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [notes, setNotes] = useState('');

  const activeFounders = founders.filter(f => f.status === 'active');
  
  // Calculate total profit from selected projects or use custom amount
  const totalProfitToDistribute = useMemo(() => {
    if (useCustomAmount && customAmount !== null) {
      return customAmount * 100; // Convert to smallest unit
    }
    return Array.from(selectedProjectIds).reduce((sum, id) => {
      const project = completedProjects.find(p => p.id === id);
      return sum + (project?.netProfit || 0);
    }, 0);
  }, [selectedProjectIds, completedProjects, useCustomAmount, customAmount]);

  // Calculate distribution preview
  const distributionPreview = useMemo((): DistributionPreview | null => {
    if (totalProfitToDistribute <= 0 || activeFounders.length === 0) return null;

    const companyRetention = Math.floor(totalProfitToDistribute * (companyRetentionPercent / 100));
    const distributableToFounders = totalProfitToDistribute - companyRetention;

    const founderDistributions = activeFounders.map(founder => {
      const grossAmount = Math.floor(distributableToFounders * (founder.profitSharePercentage / 100));
      return {
        founderId: founder.id,
        founderName: founder.name,
        sharePercent: founder.profitSharePercentage,
        grossAmount,
        netAmount: grossAmount, // Can add tax deductions here if needed
      };
    });

    return {
      projectIds: Array.from(selectedProjectIds),
      totalProfit: totalProfitToDistribute,
      companyRetention,
      founderDistributions,
      period: distributionPeriod,
      notes,
    };
  }, [totalProfitToDistribute, activeFounders, companyRetentionPercent, selectedProjectIds, distributionPeriod, notes]);

  const toggleProject = (projectId: string) => {
    const newSelected = new Set(selectedProjectIds);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjectIds(newSelected);
  };

  const selectAllProjects = () => {
    if (selectedProjectIds.size === completedProjects.length) {
      setSelectedProjectIds(new Set());
    } else {
      setSelectedProjectIds(new Set(completedProjects.map(p => p.id)));
    }
  };

  const handleCreateDistribution = () => {
    if (distributionPreview && onCreateDistribution) {
      onCreateDistribution(distributionPreview);
    }
  };

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h3 className={s.cardTitle}>💰 Profit Distribution Calculator</h3>
        <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
          Company: {companyRetentionPercent}% | Founders: {100 - companyRetentionPercent}%
        </div>
      </div>
      <div className={s.cardBody}>
        {/* Input Method Toggle */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--int-space-2)', 
          marginBottom: 'var(--int-space-6)',
          padding: 'var(--int-space-1)',
          background: 'var(--int-bg-secondary)',
          borderRadius: 'var(--int-radius)',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setUseCustomAmount(false)}
            style={{
              padding: 'var(--int-space-2) var(--int-space-4)',
              background: !useCustomAmount ? 'var(--int-primary)' : 'transparent',
              color: !useCustomAmount ? 'white' : 'var(--int-text-secondary)',
              border: 'none',
              borderRadius: 'var(--int-radius-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--int-text-sm)'
            }}
          >
            From Projects
          </button>
          <button
            onClick={() => setUseCustomAmount(true)}
            style={{
              padding: 'var(--int-space-2) var(--int-space-4)',
              background: useCustomAmount ? 'var(--int-primary)' : 'transparent',
              color: useCustomAmount ? 'white' : 'var(--int-text-secondary)',
              border: 'none',
              borderRadius: 'var(--int-radius-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--int-text-sm)'
            }}
          >
            Custom Amount
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--int-space-6)' }}>
          {/* Left: Input Section */}
          <div>
            {useCustomAmount ? (
              <div style={{ marginBottom: 'var(--int-space-4)' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--int-space-2)' }}>
                  Amount to Distribute ({currency})
                </label>
                <input
                  type="number"
                  value={customAmount || ''}
                  onChange={(e) => setCustomAmount(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Enter amount..."
                  style={{
                    width: '100%',
                    padding: 'var(--int-space-3)',
                    border: '1px solid var(--int-border)',
                    borderRadius: 'var(--int-radius)',
                    fontSize: 'var(--int-text-lg)',
                    fontWeight: 600
                  }}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--int-space-3)' }}>
                  <label style={{ fontWeight: 600 }}>Select Completed Projects</label>
                  {completedProjects.length > 0 && (
                    <button
                      onClick={selectAllProjects}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--int-primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 'var(--int-text-sm)'
                      }}
                    >
                      {selectedProjectIds.size === completedProjects.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                
                {completedProjects.length === 0 ? (
                  <div style={{ 
                    padding: 'var(--int-space-6)', 
                    textAlign: 'center', 
                    color: 'var(--int-text-muted)',
                    background: 'var(--int-bg-secondary)',
                    borderRadius: 'var(--int-radius)'
                  }}>
                    <p>No completed projects with undistributed profits.</p>
                    <p style={{ fontSize: 'var(--int-text-sm)', marginTop: 'var(--int-space-2)' }}>
                      Use "Custom Amount" to distribute manually.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 'var(--int-space-2)', maxHeight: '300px', overflowY: 'auto' }}>
                    {completedProjects.map(project => (
                      <label
                        key={project.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--int-space-3)',
                          padding: 'var(--int-space-3)',
                          background: selectedProjectIds.has(project.id) ? 'var(--int-primary-light)' : 'var(--int-bg-secondary)',
                          border: `1px solid ${selectedProjectIds.has(project.id) ? 'var(--int-primary)' : 'var(--int-border)'}`,
                          borderRadius: 'var(--int-radius)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.has(project.id)}
                          onChange={() => toggleProject(project.id)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{project.name}</div>
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                            {project.clientName}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: 'var(--int-success)' }}>
                            {formatMoney(project.netProfit, currency)}
                          </div>
                          <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                            net profit
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Period and Notes */}
            <div style={{ marginTop: 'var(--int-space-4)' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--int-space-2)' }}>
                Distribution Period
              </label>
              <input
                type="month"
                value={distributionPeriod}
                onChange={(e) => setDistributionPeriod(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--int-space-2)',
                  border: '1px solid var(--int-border)',
                  borderRadius: 'var(--int-radius)'
                }}
              />
            </div>
            
            <div style={{ marginTop: 'var(--int-space-4)' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--int-space-2)' }}>
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this distribution..."
                rows={2}
                style={{
                  width: '100%',
                  padding: 'var(--int-space-2)',
                  border: '1px solid var(--int-border)',
                  borderRadius: 'var(--int-radius)',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Right: Preview Section */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-4)' }}>Distribution Preview</h4>
            
            {!distributionPreview ? (
              <div style={{ 
                padding: 'var(--int-space-8)', 
                textAlign: 'center', 
                color: 'var(--int-text-muted)',
                background: 'var(--int-bg-secondary)',
                borderRadius: 'var(--int-radius)'
              }}>
                <p>Select projects or enter an amount to see the distribution preview.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--int-space-4)' }}>
                {/* Totals */}
                <div style={{ 
                  padding: 'var(--int-space-4)', 
                  background: 'var(--int-bg-secondary)', 
                  borderRadius: 'var(--int-radius)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-2)' }}>
                    <span>Total Profit</span>
                    <span style={{ fontWeight: 700 }}>{formatMoney(distributionPreview.totalProfit, currency)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-2)' }}>
                    <span>Company Retention ({companyRetentionPercent}%)</span>
                    <span style={{ fontWeight: 600, color: 'var(--int-primary)' }}>
                      -{formatMoney(distributionPreview.companyRetention, currency)}
                    </span>
                  </div>
                  <div style={{ 
                    borderTop: '1px solid var(--int-border)', 
                    paddingTop: 'var(--int-space-2)', 
                    marginTop: 'var(--int-space-2)',
                    display: 'flex', 
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontWeight: 600 }}>To Distribute</span>
                    <span style={{ fontWeight: 700, color: 'var(--int-success)' }}>
                      {formatMoney(distributionPreview.totalProfit - distributionPreview.companyRetention, currency)}
                    </span>
                  </div>
                </div>

                {/* Founder Breakdown */}
                <div style={{ display: 'grid', gap: 'var(--int-space-2)' }}>
                  {distributionPreview.founderDistributions.map(fd => (
                    <div 
                      key={fd.founderId}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--int-space-3)',
                        background: 'var(--int-success-light)',
                        borderRadius: 'var(--int-radius)',
                        border: '1px solid var(--int-success)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{fd.founderName}</div>
                        <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-success)' }}>
                          {fd.sharePercent}% share
                        </div>
                      </div>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: 'var(--int-text-lg)', 
                        color: 'var(--int-success)' 
                      }}>
                        {formatMoney(fd.netAmount, currency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create Distribution Button */}
                {onCreateDistribution && (
                  <button
                    onClick={handleCreateDistribution}
                    style={{
                      padding: 'var(--int-space-3) var(--int-space-4)',
                      background: 'var(--int-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--int-radius)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 'var(--int-text-base)',
                      marginTop: 'var(--int-space-2)'
                    }}
                  >
                    Create Distribution
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Distribution Calculator - Simplified version
 */
export function QuickDistributionCalc({
  amount,
  founders,
  companyRetentionPercent = 20,
  currency = 'PKR',
}: {
  amount: number;
  founders: Founder[];
  companyRetentionPercent?: number;
  currency?: string;
}) {
  const activeFounders = founders.filter(f => f.status === 'active');
  const companyRetention = Math.floor(amount * (companyRetentionPercent / 100));
  const distributable = amount - companyRetention;

  return (
    <div style={{ 
      padding: 'var(--int-space-4)', 
      background: 'var(--int-bg-secondary)', 
      borderRadius: 'var(--int-radius)' 
    }}>
      <div style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)' }}>
        Distribution of {formatMoney(amount, currency)}
      </div>
      
      <div style={{ display: 'grid', gap: 'var(--int-space-2)', fontSize: 'var(--int-text-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Company ({companyRetentionPercent}%)</span>
          <span style={{ fontWeight: 600 }}>{formatMoney(companyRetention, currency)}</span>
        </div>
        
        {activeFounders.map(f => {
          const share = Math.floor(distributable * (f.profitSharePercentage / 100));
          return (
            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{f.name} ({f.profitSharePercentage}%)</span>
              <span style={{ fontWeight: 600, color: 'var(--int-success)' }}>{formatMoney(share, currency)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
