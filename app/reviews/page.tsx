import React from 'react';

export default function ReviewsPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">Client Reviews & Testimonials</h1>
      <section className="max-w-2xl mx-auto">
        <p className="mb-8 text-lg text-center text-gray-700">
          Discover what our clients say about Megicode. We pride ourselves on delivering exceptional results and building lasting partnerships.
        </p>
        {/* Example testimonials - replace with real data as available */}
        <div className="space-y-8">
          <blockquote className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="italic text-lg">“Megicode transformed our digital presence. Their team is creative, responsive, and truly understands our business needs.”</p>
            <footer className="mt-4 text-right font-semibold">— Sarah L., CEO, TechNova</footer>
          </blockquote>
          <blockquote className="bg-gray-50 p-6 rounded-lg shadow">
            <p className="italic text-lg">“Professional, reliable, and innovative. Highly recommended for any business looking to scale with technology.”</p>
            <footer className="mt-4 text-right font-semibold">— David M., Founder, MarketLeap</footer>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
