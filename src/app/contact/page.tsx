'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Contact & Feedback', url: '/contact' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Contact &amp; Feedback
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have an idea for a new utility? Spotted a bug? We would love to hear from you.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Message Received!</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for your feedback. We appreciate your suggestions as we continue improving ToolBox.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 block mb-1">
                  Message / Feedback
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us what you think or suggest a new tool..."
                  className="w-full p-3 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
