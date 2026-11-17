import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/config/articles';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/seo';
import { BookOpen, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Guides & Tutorials — ToolBox Educational Hub',
  description:
    'Free educational guides, technical tutorials, and best practices for image compression, PDF security, financial calculations, and text analysis.',
  alternates: {
    canonical: getCanonicalUrl('/blog'),
  },
  openGraph: {
    title: 'Guides & Tutorials — ToolBox Educational Hub',
    description:
      'Explore actionable tutorials on image optimization, confidential PDF workflows, loan amortization, and text analytics.',
    url: getCanonicalUrl('/blog'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides & Tutorials — ToolBox Educational Hub',
    description:
      'Free educational guides and tutorials for browser-based productivity and privacy.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumbs items={[{ name: 'Guides & Tutorials', url: '/blog' }]} />

      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
          <span>Knowledge Base &amp; Tutorials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Practical Guides, Web Performance &amp; Privacy Tutorials
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Deep dives into browser-first utilities, mathematical formulas, document security, and client-side processing. Learn how to optimize your digital workflows with 100% privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {ARTICLES.map((article) => (
          <Card key={article.slug} className="group hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs uppercase font-semibold text-blue-700 bg-blue-50/50 border-blue-200">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{article.readTimeMinutes} min read</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(article.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Read Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust & Methodology Callout */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Verified Scientific &amp; Algorithmic Accuracy
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every tutorial and guide published on ToolBox is authored with real formulas, psycholinguistic reading studies, and verified browser standards. Zero AI hallucinations, zero unverified assumptions.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Browse 24 Free Tools
        </Link>
      </div>
    </div>
  );
}
