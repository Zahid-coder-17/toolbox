import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/seo';
import { AlertTriangle, ShieldCheck, Scale, DollarSign, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer — ToolBox',
  description:
    'Legal, financial, technical, and third-party advertising disclaimers for ToolBox free online utilities.',
  alternates: {
    canonical: getCanonicalUrl('/disclaimer'),
  },
  openGraph: {
    title: 'Disclaimer — ToolBox',
    description:
      'Legal, financial, technical, and third-party advertising disclaimers for ToolBox free online utilities.',
    url: getCanonicalUrl('/disclaimer'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer — ToolBox',
    description:
      'Legal, financial, technical, and third-party advertising disclaimers for ToolBox free online utilities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Disclaimer', url: '/disclaimer' }]} />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          Important Disclaimers &amp; Disclosures
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-8 leading-relaxed">
        {/* 1. General Informational Use */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            1. General Informational Use
          </h2>
          <p>
            The information and interactive utilities provided on <strong>ToolBox</strong> (accessible via our website) are provided for general educational, personal, and administrative productivity purposes only. While our engineering team strives for algorithmic precision, continuous uptime, and browser compatibility, all tools are offered strictly on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis without warranties of any kind.
          </p>
        </section>

        {/* 2. Financial & Calculation Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            2. Financial, Mathematical &amp; Calculation Disclaimer
          </h2>
          <p>
            Our financial calculators (including the <strong>EMI Calculator</strong>, <strong>Compound Interest Calculator</strong>, and <strong>Percentage Calculator</strong>) are designed to provide illustrative estimates based on user-supplied numbers and standard mathematical compounding formulas.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              Not Certified Financial or Legal Advice
            </div>
            <p>
              Calculated figures do not account for bank-specific loan origination fees, closing costs, tiered taxes, inflation variations, or regulatory lending adjustments. You should consult a licensed financial advisor, certified accountant, or banking professional before entering into binding loan commitments or making investment allocations. ToolBox disclaims all liability for decisions made using these estimates.
            </p>
          </div>
        </section>

        {/* 3. Technical Accuracy & File Processing */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            3. Technical Accuracy &amp; File Processing Disclaimer
          </h2>
          <p>
            ToolBox utilizes client-side WebAssembly, PDF.js, pdf-lib, and HTML5 Canvas engines. While these open standards preserve vector integrity and visual resolution, file conversion (such as PDF compression, HEIC conversion, and image resizing) can result in compression artifacts, color profile shifts, or layout variances depending on source document complexity.
          </p>
          <p>
            Users are advised to keep independent backups of original files prior to compression or page splitting. ToolBox shall not be held responsible for accidental data loss, corrupted source files, or incompatible format exports.
          </p>
        </section>

        {/* 4. Advertising & Monetization Disclosure */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-violet-600" />
            4. Third-Party Advertising &amp; Monetization Disclosure
          </h2>
          <p>
            To maintain all 24 tools free of charge without paywalls or subscription fees, ToolBox displays third-party advertising served through <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              <strong>Non-Endorsement:</strong> The inclusion of an advertisement on ToolBox does not constitute an endorsement, guarantee, or recommendation of the advertised product, merchant, or service.
            </li>
            <li>
              <strong>Ad Separation:</strong> All advertising spaces are strictly separated from tool workspaces and clearly marked with an &quot;ADVERTISEMENT&quot; label. ToolBox never presents advertisements as functional tool buttons, download triggers, or required action controls.
            </li>
            <li>
              <strong>Google Consent Mode:</strong> We support Google Consent Mode v2. When you deny personalized advertising cookies, non-personalized contextual ads are served.
            </li>
          </ul>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In no event shall ToolBox, its developers, or its affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to use this platform, including but not limited to loss of profits, data corruption, or business interruption.
          </p>
        </section>
      </div>
    </div>
  );
}
