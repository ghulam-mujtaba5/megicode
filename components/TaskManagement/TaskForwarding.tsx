"use client";

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import commonStyles from './TaskForwardingCommon.module.css';
import lightStyles from './TaskForwardingLight.module.css';
import darkStyles from './TaskForwardingDark.module.css';

interface User {
  id: string;
  name: string;
  role: string;
}

interface TaskForwardingProps {
  taskId: string;
  currentAssigneeId?: string;
  users: User[];
  onAssign?: (userId: string) => void;
}

export default function TaskForwarding({ taskId, currentAssigneeId, users, onAssign }: TaskForwardingProps) {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? darkStyles : lightStyles;
  
  const [selectedUserId, setSelectedUserId] = useState(currentAssigneeId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onAssign) {
      onAssign(selectedUserId);
    }
    
    setMessage('Task forwarded successfully!');
    setIsSubmitting(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className={`${commonStyles.container} ${themeStyles.container}`}>
      <label className={`${commonStyles.label} ${themeStyles.label}`}>
        Forward Task To:
      </label>
      
      <select 
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className={`${commonStyles.select} ${themeStyles.select}`}
        disabled={isSubmitting}
      >
        <option value="">Select a team member...</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleAssign}
        disabled={isSubmitting || !selectedUserId}
        className={`${commonStyles.button} ${themeStyles.button}`}
        style={{ opacity: isSubmitting || !selectedUserId ? 0.7 : 1 }}
      >
        {isSubmitting ? 'Forwarding...' : 'Forward Task'}
      </button>
      
      {message && (
        <p className={`${commonStyles.message} ${themeStyles.message}`}>
          {message}
        </p>
      )}
    </div>
  );
}
