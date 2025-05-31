import React from 'react';

export default function ProjectPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">Our Portfolio & Projects</h1>
      <section className="max-w-4xl mx-auto">
        <p className="mb-8 text-lg text-center text-gray-700">
          Explore a selection of Megicode’s recent projects, showcasing our expertise in web, mobile, and AI-driven solutions.
        </p>
        {/* Example projects - replace with real data as available */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">AI Analytics Dashboard</h2>
            <p className="mb-2 text-gray-600">A scalable analytics platform for real-time business intelligence, built with Next.js and Python.</p>
            <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs">Web App</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">Mobile E-Commerce Suite</h2>
            <p className="mb-2 text-gray-600">A cross-platform mobile app for seamless shopping experiences, featuring AI-powered recommendations.</p>
            <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs">Mobile App</span>
          </div>
        </div>
      </section>
    </main>
  );
}
