"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function IntegrationsPanel() {
  const [clickUpConnected, setClickUpConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(true);
  const [vercelConnected, setVercelConnected] = useState(true);

  const handleConnect = (service: string) => {
    // Simulate connection delay
    setTimeout(() => {
      if (service === 'clickup') setClickUpConnected(true);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Active Integrations</h2>
      <div className="space-y-4">
        
        {/* ClickUp */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">CU</div>
            <div>
              <h3 className="font-semibold">ClickUp</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Task sync & List automation</p>
            </div>
          </div>
          <button 
            onClick={() => handleConnect('clickup')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              clickUpConnected 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {clickUpConnected ? 'Connected ✅' : 'Connect Account'}
          </button>
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 dark:bg-black rounded-lg flex items-center justify-center text-white font-bold">GH</div>
            <div>
              <h3 className="font-semibold">GitHub</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Repo provisioning & CI/CD</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Connected ✅
          </div>
        </div>

        {/* Vercel */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">▲</div>
            <div>
              <h3 className="font-semibold">Vercel</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deployment webhooks</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Connected ✅
          </div>
        </div>

      </div>

      {/* CRM Field Mapping */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">CRM Field Mapping</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Map fields from your CRM (e.g. Salesforce, HubSpot) to Portal fields.
        </p>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="font-medium text-sm">CRM Field</div>
            <div className="text-center text-gray-400">→</div>
            <div className="font-medium text-sm">Portal Field</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <select className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 text-sm">
              <option>Deal Value</option>
              <option>Amount</option>
            </select>
            <div className="text-center text-gray-400">→</div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">Estimated Budget</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <select className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 text-sm">
              <option>Close Date</option>
              <option>Target Date</option>
            </select>
            <div className="text-center text-gray-400">→</div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">Target Date</div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <select className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 text-sm">
              <option>Priority</option>
              <option>Urgency</option>
            </select>
            <div className="text-center text-gray-400">→</div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">Priority</div>
          </div>
        </div>
        
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Save Mappings
        </button>
      </div>
    </div>
  );
}
