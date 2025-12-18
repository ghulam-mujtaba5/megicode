"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Megicode Internal Portal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
            A Silicon Valley-Standard Operating System for Software Delivery
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            title="🤖 Automated Workflow"
            description="From Lead to Delivery, our BPMN-driven engine orchestrates every step. AI analysis, auto-provisioning, and smart handoffs."
            icon="⚡"
            link="/internal/process"
          />
          <FeatureCard 
            title="🔗 Best-in-Class Integrations"
            description="Seamlessly connected with ClickUp, GitHub, Vercel, and Stripe. A true 'Single Pane of Glass' experience."
            icon="🔄"
            link="/internal/projects"
          />
          <FeatureCard 
            title="👥 Role-Based Experience"
            description="Customized dashboards for Admins, PMs, Developers, and Clients. Everyone sees exactly what they need."
            icon="🛡️"
            link="/internal/login"
          />
          <FeatureCard 
            title="📊 Real-Time Intelligence"
            description="Live metrics, financial health (MRR), and team utilization tracking backed by Turso DB."
            icon="📈"
            link="/internal/reports"
          />
          <FeatureCard 
            title="🌍 Ethical & Standardized"
            description="Built with GDPR compliance, inclusive design, and international software delivery standards in mind."
            icon="⚖️"
            link="/internal/resources"
          />
          <FeatureCard 
            title="🚀 Instant Monitoring"
            description="Webhooks provide <500ms updates on deployments, errors (Sentry), and task completions."
            icon="⏱️"
            link="/internal/instances"
          />
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-3xl font-bold mb-6">Architecture Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-500">Frontend</h3>
              <ul className="space-y-2">
                <li className="flex items-center">✅ Next.js 15 (App Router)</li>
                <li className="flex items-center">✅ React 19 (Server Components)</li>
                <li className="flex items-center">✅ Tailwind CSS + Framer Motion</li>
                <li className="flex items-center">✅ TypeScript Strict Mode</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-500">Backend & Data</h3>
              <ul className="space-y-2">
                <li className="flex items-center">✅ Turso (LibSQL) Edge Database</li>
                <li className="flex items-center">✅ Drizzle ORM</li>
                <li className="flex items-center">✅ Next.js API Routes (Webhooks)</li>
                <li className="flex items-center">✅ Role-Based Access Control (RBAC)</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link 
            href="/internal/login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start the Tour 🚀
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Recommended: Log in as <strong>Admin</strong> to see all features.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, link }: { title: string, description: string, icon: string, link: string }) {
  return (
    <Link href={link} className="block group">
      <motion.div 
        whileHover={{ y: -5 }}
        className="h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </motion.div>
    </Link>
  );
}
