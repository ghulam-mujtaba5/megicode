"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import commonStyles from './LiveDashboardCommon.module.css';
import lightStyles from './LiveDashboardLight.module.css';
import darkStyles from './LiveDashboardDark.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  message: string;
  time: string;
  status: 'green' | 'amber' | 'red';
}

export default function LiveDashboard() {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;

  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', message: 'Deployment to Production successful', time: 'Just now', status: 'green' },
    { id: '2', message: 'New Lead: TechCorp Inc.', time: '2 mins ago', status: 'green' },
    { id: '3', message: 'High Latency detected on API-04', time: '5 mins ago', status: 'amber' },
  ]);

  const [stats, setStats] = useState({
    uptime: 99.99,
    activeProjects: 12,
    velocity: 45
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update stats
      setStats(prev => ({
        ...prev,
        velocity: prev.velocity + (Math.random() > 0.5 ? 1 : -1)
      }));

      // Randomly add activity
      if (Math.random() > 0.7) {
        const newActivity: Activity = {
          id: Date.now().toString(),
          message: `System Check: ${['All Systems Go', 'Latency Spike', 'Task Completed'][Math.floor(Math.random() * 3)]}`,
          time: 'Just now',
          status: Math.random() > 0.8 ? 'amber' : 'green'
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={commonStyles.dashboardGrid}>
        <StatCard 
          label="System Uptime" 
          value={`${stats.uptime}%`} 
          trend="+0.01%" 
          trendUp={true}
          themeStyles={themeStyles}
        />
        <StatCard 
          label="Active Projects" 
          value={stats.activeProjects.toString()} 
          trend="+2 this week" 
          trendUp={true}
          themeStyles={themeStyles}
        />
        <StatCard 
          label="Team Velocity" 
          value={`${stats.velocity} pts`} 
          trend="-2% vs last sprint" 
          trendUp={false}
          themeStyles={themeStyles}
        />
      </div>

      <div className={`${commonStyles.activityFeed} ${themeStyles.activityFeed}`}>
        <h3 className={`${commonStyles.feedTitle} ${themeStyles.feedTitle}`}>Live Activity Feed</h3>
        <ul className={commonStyles.feedList}>
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.li 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`${commonStyles.feedItem} ${themeStyles.feedItem}`}
              >
                <span className={`${commonStyles.statusBadge} ${
                  activity.status === 'green' ? commonStyles.statusGreen : 
                  activity.status === 'amber' ? commonStyles.statusAmber : 
                  commonStyles.statusRed
                }`} />
                <div style={{ flex: 1 }}>
                  <p className={themeStyles.feedText}>{activity.message}</p>
                  <span className={themeStyles.feedTime}>{activity.time}</span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, trendUp, themeStyles }: any) {
  return (
    <div className={`${commonStyles.statCard} ${themeStyles.statCard}`}>
      <span className={`${commonStyles.statLabel} ${themeStyles.statLabel}`}>{label}</span>
      <span className={`${commonStyles.statValue} ${themeStyles.statValue}`}>{value}</span>
      <span className={`${commonStyles.statTrend} ${trendUp ? commonStyles.trendUp : commonStyles.trendDown}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </span>
    </div>
  );
}
