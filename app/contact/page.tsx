import React from 'react';

export default function ContactPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">Contact Megicode</h1>
      <section className="max-w-xl mx-auto">
        <p className="mb-8 text-lg text-center text-gray-700">
          Ready to start your next project or have a question? Reach out to our team and we’ll get back to you promptly.
        </p>
        <form className="space-y-6" action="mailto:megicode@gmail.com" method="POST" encType="text/plain">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
            <input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">Email</label>
            <input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 font-medium">Message</label>
            <textarea id="message" name="message" rows={5} required className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition">Send Message</button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          <p>Email: <a href="mailto:megicode@gmail.com" className="text-primary underline">megicode@gmail.com</a></p>
          <p>Location: Remote / Global</p>
        </div>
      </section>
    </main>
  );
}
