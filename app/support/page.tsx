"use client";

import { useState } from "react";
import Navigation from "../../components/Navigation";
// You can create a Footer component if you have one, or use a placeholder

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:haithamelmekaoui@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation currentPage="support" />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Support & Contact</h1>
          <section className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us for Help</h2>
            <p className="text-gray-700 text-base">
              <span className="font-medium">Email:</span> <a href="mailto:haithamelmekaoui@gmail.com" className="text-green-600 hover:underline">haithamelmekaoui@gmail.com</a>
            </p>
            <p className="text-gray-700 text-base mt-1">
              <span className="font-medium">Phone:</span> <a href="tel:+1234567890" className="text-green-600 hover:underline">+1 234 567 890</a>
            </p>
          </section>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      {/* Footer placeholder, replace with your Footer component if available */}
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ChatTooAI. All rights reserved.
      </footer>
    </div>
  );
}
