import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/seo';
import { Wrench, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ToolBox — Fast, Private Web Utilities',
  description:
    'ToolBox is an open suite of 24 client-side web utilities built with Next.js, Web Workers, and browser Canvas APIs.',
  alternates: {
    canonical: getCanonicalUrl('/about'),
  },
  openGraph: {
    title: 'About ToolBox — Fast, Private Web Utilities',
    description:
      'ToolBox is an open suite of 24 client-side web utilities built with Next.js, Web Workers, and browser Canvas APIs.',
    url: getCanonicalUrl('/about'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ToolBox — Fast, Private Web Utilities',
    description:
      'ToolBox is an open suite of 24 client-side web utilities built with Next.js, Web Workers, and browser Canvas APIs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs items={[{ name: 'About', url: '/about' }]} />

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          About ToolBox
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          ToolBox was engineered to solve a common frustration: everyday web utilities cluttered with invasive tracking, deceptive download buttons, and unnecessary server uploads of private documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Modern Architecture</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built using Next.js App Router, TypeScript strict mode, Tailwind CSS, PDF.js, and browser Canvas APIs for instantaneous performance.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Privacy by Design</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No text or file ever leaves your machine. Your photos, contracts, and code stay completely within your browser runtime.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Wrench className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">24 Real Tools</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every utility is fully functional. No placeholder buttons, no artificial limits, and no required accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
