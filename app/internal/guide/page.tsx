"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function UserGuidePage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose dark:prose-invert max-w-none"
      >
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Megicode Internal Portal - User Guide
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-0">📘 Introduction</h2>
          <p className="text-blue-700 dark:text-blue-200">
            Welcome to the Megicode Internal Portal (MIP), a Silicon Valley-standard Operating System for our software delivery lifecycle. 
            This platform orchestrates the entire journey from client inception to final product delivery, integrating best-in-class tools 
            like ClickUp, GitHub, and Vercel into a unified "Single Pane of Glass."
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">🧭</span> Ethical & Professional Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardCard 
              title="Data Privacy (GDPR/CCPA)" 
              desc="Client data is strictly segregated. Access is role-based (RBAC) to ensure only authorized personnel view sensitive info."
            />
            <StandardCard 
              title="Transparency" 
              desc="Clients have real-time visibility into project status, reducing 'black box' anxiety and building trust."
            />
            <StandardCard 
              title="Accountability" 
              desc="Every action (deployment, approval, transaction) is logged in an immutable audit trail."
            />
            <StandardCard 
              title="Inclusive Design" 
              desc="The portal is designed to be accessible (WCAG 2.1) and culturally neutral."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">👥</span> Role-Based Workflows
          </h2>
          
          <div className="space-y-8">
            <RoleSection 
              role="👑 Administrator / Agency Owner"
              goal="High-level oversight and system health."
              items={[
                "Dashboard: View 'God Mode' stats—MRR, Global System Health (Uptime), and Team Utilization.",
                "User Management: Onboard new staff and assign roles.",
                "Integrations: Configure API keys for ClickUp, GitHub, and Stripe.",
                "Audit: Review system logs for security compliance."
              ]}
            />
            
            <RoleSection 
              role="📋 Project Manager (PM)"
              goal="On-time, on-budget delivery."
              items={[
                "Lead Intake: Review incoming leads in the Leads pipeline.",
                "Project Initialization: Click 'Convert to Project' to auto-provision ClickUp Lists and GitHub Repos.",
                "Planning: Use the Gantt chart to visualize timelines. Assign tasks that sync to ClickUp.",
                "Monitoring: Watch the 'Live Delivery' dashboard for blocker alerts."
              ]}
            />

            <RoleSection 
              role="💻 Developer / QA Engineer"
              goal="Focus on code and quality."
              items={[
                "Task Pickup: Log in to see 'My Focus' – top 3 priority tasks.",
                "Development: Work on the assigned branch and push code to GitHub.",
                "Automation: Pushing code automatically updates the Portal task status to 'In Review'.",
                "Bug Tracking: View and resolve Sentry errors directly from the portal."
              ]}
            />

            <RoleSection 
              role="🤝 Client (External View)"
              goal="Visibility and approvals."
              items={[
                "Login: Secure access via magic link.",
                "Dashboard: View simplified progress bars (e.g., 'Phase 2: 80% Complete').",
                "Approvals: Review designs or UAT builds and click 'Approve' or 'Request Changes'.",
                "Invoicing: View and pay invoices securely."
              ]}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">🚀</span> Feature Showcase (For Evaluators)
          </h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">⚡ Instant Monitoring</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              The portal uses real-time webhooks. When a developer pushes code or a server goes down:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Latency:</strong> &lt; 500ms updates.</li>
              <li><strong>Visuals:</strong> Status badges change color instantly (Green → Red).</li>
              <li><strong>Alerts:</strong> Notifications are dispatched to the relevant stakeholders immediately.</li>
            </ul>
          </div>
        </section>

      </motion.div>
    </div>
  );
}

function StandardCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}

function RoleSection({ role, goal, items }: { role: string, goal: string, items: string[] }) {
  return (
    <div className="border-l-4 border-blue-500 pl-6 py-2">
      <h3 className="text-xl font-bold mb-1">{role}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">Goal: {goal}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
