import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service — ToolBox',
  description: 'Terms of Service and acceptable use policies for ToolBox free online utilities.',
  alternates: {
    canonical: getCanonicalUrl('/terms'),
  },
  openGraph: {
    title: 'Terms of Service — ToolBox',
    description: 'Terms of Service and acceptable use policies for ToolBox free online utilities.',
    url: getCanonicalUrl('/terms'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — ToolBox',
    description: 'Terms of Service and acceptable use policies for ToolBox free online utilities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Terms of Service', url: '/terms' }]} />

      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>

        <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
          <p>
            By accessing or utilizing ToolBox, you acknowledge and agree to abide by these Terms of Service. ToolBox provides all 24 utilities free of charge on an &quot;as-is&quot; basis.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">Permitted Use</h2>
          <p>
            You are granted a non-exclusive license to utilize all tools for personal, academic, and commercial purposes. You agree not to abuse, overburden, or launch denial-of-service attacks against our static infrastructure.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">Disclaimer of Warranties</h2>
          <p>
            While every effort has been made to ensure numerical, mathematical, and algorithmic precision across our financial calculators and file processors, calculations and conversions are provided without warranty of any kind. Please refer to our full{' '}
            <Link href="/disclaimer" className="text-blue-600 underline">
              Disclaimer
            </Link>{' '}
            for detailed financial and technical accuracy notices.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">Privacy &amp; Data Rights</h2>
          <p>
            We process your files locally in your web browser. For full details on our client-side architecture, cookies, and Google Consent Mode v2, please review our{' '}
            <Link href="/privacy" className="text-blue-600 underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
