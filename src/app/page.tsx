'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  TOOLS,
  ToolCategory,
  searchTools,
} from '@/config/tools';
import { ToolCard, ICON_MAP } from '@/components/ui/tool-card';
import { AdUnit } from '@/components/ads/AdSense';
import { generateWebsiteSchema } from '@/lib/seo';
import {
  Search,
  Zap,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    let list = TOOLS;
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.keywords.some((kw) => kw.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-10 sm:py-16 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>24 Production Utilities • 100% Client-Side Privacy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Smart, Fast &amp; Private{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Online Utilities
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Free developer, text, image, PDF, and financial calculator tools. Process files locally in your web browser with zero server uploads and instant speed.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-xl mx-auto relative pt-4">
            <div className="relative flex items-center shadow-md rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-5 w-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. compress image, word counter, merge pdf, emi)..."
                className="w-full px-3 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Category Pill Tabs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tools (24)
              </button>
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name} ({cat.toolCount})
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredTools.length}</span> tools
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              No tools matching &quot;{searchQuery}&quot;. Try searching for words like &quot;pdf&quot;, &quot;image&quot;, or &quot;calculator&quot;.
            </div>
          )}
        </section>

        {/* Ad Unit */}
        <AdUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT} />

        {/* Trust & Features Section */}
        <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-8 sm:p-12 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Professionals &amp; Developers Choose ToolBox
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We rebuilt essential online utilities from the ground up to eliminate privacy risks, slow server queues, and intrusive popups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All image compression, PDF operations, and text calculations run inside your browser. No files or private data are ever sent to remote servers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No upload wait times or server-side queues. Harnesses modern browser Canvas APIs and optimized WebAssembly for lightning speed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Always Free &amp; Unrestricted</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No mandatory sign-ups, no hidden paywalls, and no artificial watermarks. Just fast, dependable utilities whenever you need them.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
