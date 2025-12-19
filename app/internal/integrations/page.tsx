"use client";

import React from 'react';
import IntegrationsPanel from '@/components/IntegrationsPanel/IntegrationsPanel';

export default function IntegrationsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Integrations & Connections</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Manage your connections to external tools. These integrations power the automated workflow engine.
      </p>
      
      <IntegrationsPanel />

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
          ℹ️ How it works
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          When you connect <strong>ClickUp</strong>, new projects in the portal will automatically create a corresponding List in your ClickUp workspace. 
          Tasks assigned here will sync bi-directionally.
        </p>
      </div>
    </div>
  );
}
