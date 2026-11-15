import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, ToolCategory, getToolsByCategory } from '@/config/tools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard, ICON_MAP } from '@/components/ui/tool-card';
import { AdUnit } from '@/components/ads/AdSense';
import { getCanonicalUrl } from '@/lib/seo';
import { ShieldCheck, Sparkles, FileText } from 'lucide-react';

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({
    category: cat,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: catParam } = await params;
  const category = CATEGORIES[catParam as ToolCategory];

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const title = `Free ${category.name} — Online Productivity Tools`;
  const description = `${category.description} 100% free, private browser utilities with zero server uploads.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(category.href),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(category.href),
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: catParam } = await params;
  const category = CATEGORIES[catParam as ToolCategory];

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.id);
  const IconComponent = ICON_MAP[category.iconName] || FileText;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: category.name, url: category.href }]} />

      {/* Category Hero */}
      <div className="mb-10 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <IconComponent className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Utility Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {category.name}
            </h1>
          </div>
        </div>

        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          {category.description} Every tool runs locally in your web browser for speed, responsiveness, and uncompromising privacy.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
            {tools.length} Tools Available
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            100% Client-Side Processing
          </span>
        </div>
      </div>

      {/* Ad slot */}
      <AdUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER} className="mb-8" />

      {/* Tools Grid */}
      <div className="mb-16">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          All {category.name} ({tools.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Footer Ad */}
      <AdUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER} className="mt-8" />
    </div>
  );
}
