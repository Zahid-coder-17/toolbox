import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/seo';
import { ShieldCheck, CheckCircle, Cookie } from 'lucide-react';
import { ManageConsentButton } from '@/components/consent/ManageConsentButton';

export const metadata: Metadata = {
  title: 'Privacy Policy — 100% Client-Side Data Protection',
  description:
    'Learn how ToolBox protects your privacy. All text, images, and PDF operations run locally in your web browser without server storage.',
  alternates: {
    canonical: getCanonicalUrl('/privacy'),
  },
  openGraph: {
    title: 'Privacy Policy — 100% Client-Side Data Protection',
    description:
      'Learn how ToolBox protects your privacy. All text, images, and PDF operations run locally in your web browser without server storage.',
    url: getCanonicalUrl('/privacy'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — 100% Client-Side Data Protection',
    description:
      'Learn how ToolBox protects your privacy. All text, images, and PDF operations run locally in your web browser without server storage.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy' }]} />

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <ShieldCheck className="h-4 w-4" />
            Zero-Upload Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: November 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Client-Side Processing Guarantee</h2>
            <p>
              At ToolBox, user privacy is our foundational architectural principle. Unlike conventional online conversion sites that upload your private documents, photographs, and code to third-party cloud servers, ToolBox executes its operations directly inside your device&apos;s web browser.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
                What this means for you:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  Your text inputs, JSON payloads, and source code are never sent across the network.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  Images compressed or converted in Canvas never leave your local session.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  PDF documents merged, split, or compressed are processed in memory using client-side JavaScript.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Do Not Collect</h2>
            <p>
              We do not require user accounts, email addresses, phone numbers, or passwords. We do not maintain any backend database storing user files or text. Once you close your browser tab, all temporary object URLs and in-memory byte buffers are immediately garbage collected by your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-blue-600" />
              3. Cookies, Monetization &amp; Google Consent Mode v2
            </h2>
            <p>
              To keep our 24 utilities completely free, ToolBox displays non-intrusive advertisements served through <strong>Google AdSense</strong>. Google and third-party vendors use cookies to serve ads based on prior visits to our site or other websites.
            </p>
            <p>
              We implement <strong>Google Consent Mode v2</strong>. By default, advertising and personalization storage is set to <code>&apos;denied&apos;</code> until you provide consent. When personalized advertising is declined, Google AdSense serves only non-personalized, contextual advertisements without profiling cookies.
            </p>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
              <div className="text-xs font-semibold text-blue-900">
                Control your cookie preferences at any time:
              </div>
              <ManageConsentButton />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Analytics Disclosure</h2>
            <p>
              We use Google Analytics 4 (GA4) with IP anonymization enabled to collect aggregated, non-personally identifiable metrics (such as tool visit counts and broad browser types). We strictly enforce automated filters ensuring that file contents, user inputs, or confidential text are never transmitted to analytics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Contact &amp; Questions</h2>
            <p>
              If you have any questions or security inquiries regarding our privacy standards, please reach out through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
