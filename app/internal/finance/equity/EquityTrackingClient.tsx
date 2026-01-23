'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import s from '../../styles.module.css';

interface EquityHistoryEntry {
  id: string;
  previousPercentage: number;
  newPercentage: number;
  changeReason: string | null;
  effectiveDate: string;
  notes: string | null;
}

interface VestingSchedule {
  id: string;
  totalEquity: number;
  vestedEquity: number;
  vestingPeriodMonths: number;
  cliffMonths: number;
  startDate: string;
  nextVestingDate: string | null;
  status: string;
}

interface Draw {
  id: string;
  amount: number;
  date: string;
  repaymentDueDate: string | null;
  repaidAmount: number;
  status: string;
  notes: string | null;
}

interface FounderWithData {
  id: string;
  name: string;
  email: string | null;
  equityPercentage: number;
  investmentAmount: number;
  status: string;
  joinedDate: Date | null;
  contributions: number;
  distributions: number;
  equityHistory: EquityHistoryEntry[];
  vestingSchedules: VestingSchedule[];
  draws: Draw[];
}

const Icons = {
  equity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M6 12h12" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  history: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
};

const founderColors = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899', '#6366f1'];

function formatMoney(amountInSmallestUnit: number) {
  const amount = (amountInSmallestUnit || 0) / 100;
  return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function EquityTrackingClient({ founders }: { founders: FounderWithData[] }) {
  const [selectedFounder, setSelectedFounder] = useState<FounderWithData | null>(founders[0] || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vesting' | 'history' | 'draws'>('overview');

  // Total equity should be 100%
  const totalEquity = founders.reduce((sum, f) => sum + f.equityPercentage, 0);
  const totalInvestment = founders.reduce((sum, f) => sum + f.investmentAmount, 0);

  // Generate pie chart segments
  const generatePieChart = () => {
    const segments: React.ReactElement[] = [];
    let currentAngle = 0;

    founders.forEach((founder, index) => {
      const percentage = founder.equityPercentage;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // Convert to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      segments.push(
        <path
          key={founder.id}
          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
          fill={founderColors[index % founderColors.length]}
          stroke="var(--int-surface)"
          strokeWidth="2"
          style={{ 
            cursor: 'pointer',
            opacity: selectedFounder?.id === founder.id ? 1 : 0.7,
            transition: 'opacity 0.2s ease'
          }}
          onClick={() => setSelectedFounder(founder)}
        />
      );
      
      currentAngle = endAngle;
    });

    return segments;
  };

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* Header */}
        <div className={s.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
            <Link href="/internal/finance/founders" className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
              {Icons.back}
            </Link>
            <div>
              <h1 className={s.pageTitle}>{Icons.equity} Equity Tracking</h1>
              <p className={s.pageSubtitle}>
                Track ownership, vesting schedules, and equity changes
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={s.grid4} style={{ marginBottom: 'var(--int-space-6)' }}>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Founders
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {founders.filter(f => f.status === 'active').length}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Equity Allocated
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: totalEquity === 100 ? 'var(--int-success)' : 'var(--int-warning)' }}>
                {totalEquity.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Total Investment
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                {formatMoney(totalInvestment)}
              </div>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardBody} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-2)' }}>
                Unallocated Equity
              </div>
              <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700, color: totalEquity < 100 ? 'var(--int-warning)' : 'var(--int-text-muted)' }}>
                {(100 - totalEquity).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className={s.grid3}>
          {/* Pie Chart & Founder List */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2 className={s.cardTitle}>{Icons.chart} Ownership Distribution</h2>
            </div>
            <div className={s.cardBody}>
              {/* Pie Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--int-space-6)' }}>
                <svg viewBox="0 0 200 200" width="200" height="200">
                  {generatePieChart()}
                  <circle cx="100" cy="100" r="40" fill="var(--int-surface)" />
                  <text x="100" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--int-text)">
                    {selectedFounder?.equityPercentage.toFixed(1)}%
                  </text>
                  <text x="100" y="112" textAnchor="middle" fontSize="10" fill="var(--int-text-muted)">
                    {selectedFounder?.name.split(' ')[0]}
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-2)' }}>
                {founders.map((founder, index) => (
                  <div
                    key={founder.id}
                    onClick={() => setSelectedFounder(founder)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--int-space-3)',
                      padding: 'var(--int-space-2) var(--int-space-3)',
                      borderRadius: 'var(--int-radius)',
                      cursor: 'pointer',
                      background: selectedFounder?.id === founder.id ? 'var(--int-surface-elevated)' : 'transparent',
                    }}
                  >
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      background: founderColors[index % founderColors.length],
                    }} />
                    <span style={{ flex: 1, fontWeight: selectedFounder?.id === founder.id ? 600 : 400 }}>
                      {founder.name}
                    </span>
                    <span style={{ fontWeight: 600 }}>{founder.equityPercentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Details */}
          <div className={s.card} style={{ gridColumn: 'span 2' }}>
            {selectedFounder ? (
              <>
                <div className={s.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-3)' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%',
                      background: founderColors[founders.indexOf(selectedFounder) % founderColors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 'var(--int-text-lg)'
                    }}>
                      {selectedFounder.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className={s.cardTitle}>{selectedFounder.name}</h2>
                      <p style={{ margin: 0, fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                        {selectedFounder.status}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--int-text-2xl)', fontWeight: 700 }}>
                      {selectedFounder.equityPercentage}%
                    </div>
                    <div style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)' }}>
                      Equity Stake
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ 
                  borderBottom: '1px solid var(--int-border)',
                  display: 'flex',
                  gap: 'var(--int-space-4)',
                  padding: '0 var(--int-space-6)'
                }}>
                  {(['overview', 'vesting', 'history', 'draws'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: 'var(--int-space-3) var(--int-space-2)',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid var(--int-primary)' : '2px solid transparent',
                        color: activeTab === tab ? 'var(--int-primary)' : 'var(--int-text-muted)',
                        fontWeight: activeTab === tab ? 600 : 400,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className={s.cardBody}>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className={s.grid2} style={{ gap: 'var(--int-space-6)' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)' }}>Financial Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Initial Investment</span>
                            <span style={{ fontWeight: 600 }}>{formatMoney(selectedFounder.investmentAmount)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Total Contributions</span>
                            <span style={{ fontWeight: 600, color: 'var(--int-success)' }}>+{formatMoney(selectedFounder.contributions)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Total Distributions</span>
                            <span style={{ fontWeight: 600, color: 'var(--int-warning)' }}>-{formatMoney(selectedFounder.distributions)}</span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            paddingTop: 'var(--int-space-3)',
                            borderTop: '1px solid var(--int-border)'
                          }}>
                            <span style={{ fontWeight: 600 }}>Net Position</span>
                            <span style={{ fontWeight: 700 }}>
                              {formatMoney(selectedFounder.investmentAmount + selectedFounder.contributions - selectedFounder.distributions)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--int-space-3)' }}>Profile Info</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--int-space-3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Email</span>
                            <span>{selectedFounder.email || '-'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Joined</span>
                            <span>{selectedFounder.joinedDate ? new Date(selectedFounder.joinedDate).toLocaleDateString() : '-'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Vesting Schedules</span>
                            <span>{selectedFounder.vestingSchedules.length}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--int-text-muted)' }}>Active Draws</span>
                            <span>{selectedFounder.draws.filter(d => d.status === 'outstanding').length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vesting Tab */}
                  {activeTab === 'vesting' && (
                    <div>
                      {selectedFounder.vestingSchedules.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                          No vesting schedules for this founder
                        </div>
                      ) : (
                        selectedFounder.vestingSchedules.map(schedule => {
                          const progress = (schedule.vestedEquity / schedule.totalEquity) * 100;
                          return (
                            <div key={schedule.id} style={{
                              padding: 'var(--int-space-4)',
                              background: 'var(--int-surface-elevated)',
                              borderRadius: 'var(--int-radius)',
                              marginBottom: 'var(--int-space-4)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--int-space-3)' }}>
                                <div>
                                  <span style={{ fontWeight: 600 }}>{schedule.totalEquity}% Total Equity</span>
                                  <span 
                                    className={s.badge}
                                    style={{ 
                                      marginLeft: 'var(--int-space-2)',
                                      background: schedule.status === 'active' ? 'var(--int-success-light)' : 'var(--int-surface)',
                                      color: schedule.status === 'active' ? 'var(--int-success)' : 'var(--int-text-muted)',
                                    }}
                                  >
                                    {schedule.status}
                                  </span>
                                </div>
                                <span style={{ color: 'var(--int-success)', fontWeight: 600 }}>
                                  {schedule.vestedEquity}% vested
                                </span>
                              </div>
                              
                              {/* Progress bar */}
                              <div style={{ 
                                height: '8px', 
                                background: 'var(--int-surface)', 
                                borderRadius: 'var(--int-radius)',
                                overflow: 'hidden',
                                marginBottom: 'var(--int-space-3)'
                              }}>
                                <div style={{ 
                                  height: '100%',
                                  width: `${progress}%`,
                                  background: 'var(--int-success)',
                                  borderRadius: 'var(--int-radius)',
                                }} />
                              </div>

                              <div style={{ display: 'flex', gap: 'var(--int-space-4)', fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)' }}>
                                <span>{Icons.clock} {schedule.vestingPeriodMonths}mo vesting</span>
                                <span>{schedule.cliffMonths}mo cliff</span>
                                {schedule.nextVestingDate && (
                                  <span>Next: {new Date(schedule.nextVestingDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* History Tab */}
                  {activeTab === 'history' && (
                    <div>
                      {selectedFounder.equityHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                          No equity changes recorded
                        </div>
                      ) : (
                        <div style={{ position: 'relative', paddingLeft: 'var(--int-space-6)' }}>
                          {/* Timeline line */}
                          <div style={{
                            position: 'absolute',
                            left: '8px',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: 'var(--int-border)'
                          }} />
                          
                          {selectedFounder.equityHistory.map((entry, index) => (
                            <div key={entry.id} style={{ 
                              position: 'relative',
                              marginBottom: 'var(--int-space-6)',
                              paddingLeft: 'var(--int-space-4)'
                            }}>
                              {/* Timeline dot */}
                              <div style={{
                                position: 'absolute',
                                left: '-22px',
                                top: '4px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: entry.newPercentage > entry.previousPercentage ? 'var(--int-success)' : 'var(--int-warning)',
                                border: '2px solid var(--int-surface)'
                              }} />
                              
                              <div style={{ fontSize: 'var(--int-text-sm)', color: 'var(--int-text-muted)', marginBottom: 'var(--int-space-1)' }}>
                                {new Date(entry.effectiveDate).toLocaleDateString()}
                              </div>
                              <div style={{ fontWeight: 600 }}>
                                {entry.previousPercentage}% → {entry.newPercentage}%
                                <span style={{ 
                                  marginLeft: 'var(--int-space-2)',
                                  color: entry.newPercentage > entry.previousPercentage ? 'var(--int-success)' : 'var(--int-warning)',
                                  fontWeight: 500
                                }}>
                                  ({entry.newPercentage > entry.previousPercentage ? '+' : ''}{(entry.newPercentage - entry.previousPercentage).toFixed(2)}%)
                                </span>
                              </div>
                              {entry.changeReason && (
                                <div style={{ 
                                  marginTop: 'var(--int-space-2)',
                                  padding: 'var(--int-space-2) var(--int-space-3)',
                                  background: 'var(--int-surface-elevated)',
                                  borderRadius: 'var(--int-radius)',
                                  fontSize: 'var(--int-text-sm)'
                                }}>
                                  {entry.changeReason}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Draws Tab */}
                  {activeTab === 'draws' && (
                    <div>
                      {selectedFounder.draws.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--int-text-muted)', padding: 'var(--int-space-8)' }}>
                          No draws recorded
                        </div>
                      ) : (
                        <table className={s.table}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Repaid</th>
                              <th>Due Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedFounder.draws.map(draw => (
                              <tr key={draw.id}>
                                <td>{new Date(draw.date).toLocaleDateString()}</td>
                                <td style={{ fontWeight: 600 }}>{formatMoney(draw.amount)}</td>
                                <td style={{ color: 'var(--int-success)' }}>{formatMoney(draw.repaidAmount)}</td>
                                <td>{draw.repaymentDueDate ? new Date(draw.repaymentDueDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span 
                                    className={s.badge}
                                    style={{
                                      background: draw.status === 'repaid' ? 'var(--int-success-light)' : 
                                                draw.status === 'outstanding' ? 'var(--int-warning-light)' : 'var(--int-surface-elevated)',
                                      color: draw.status === 'repaid' ? 'var(--int-success)' : 
                                             draw.status === 'outstanding' ? 'var(--int-warning)' : 'var(--int-text-muted)',
                                    }}
                                  >
                                    {draw.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={s.cardBody} style={{ textAlign: 'center', padding: 'var(--int-space-12)' }}>
                <p style={{ color: 'var(--int-text-muted)' }}>Select a founder to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
