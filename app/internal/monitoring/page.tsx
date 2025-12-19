"use client";

import React from 'react';
import LiveDashboard from '@/components/Monitoring/LiveDashboard';
import { useTheme } from '@/context/ThemeContext';

export default function MonitoringPage() {
  const { theme } = useTheme();
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: theme === 'dark' ? '#fff' : '#111',
          marginBottom: '0.5rem'
        }}>
          Mission Control
        </h1>
        <p style={{ color: theme === 'dark' ? '#aaa' : '#666' }}>
          Real-time operational intelligence for Megicode.
        </p>
      </header>
      
      <LiveDashboard />
    </div>
  );
}
