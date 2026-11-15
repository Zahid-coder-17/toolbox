import React from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  ToolDefinition,
  getToolsByCategory,
} from '@/config/tools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ICON_MAP } from '@/components/ui/tool-card';
import { AdSlot } from '@/components/ads/AdSense';
import { ToolAnalyticsTracker, RelatedToolLink } from '@/components/analytics/ToolAnalyticsTracker';
import {
  generateWebApplicationSchema,
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';
import {
  HelpCircle,
  ListOrdered,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export function ToolLayout({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: React.ReactNode;
}) {
  const category = CATEGORIES[tool.category];
  const IconComponent = ICON_MAP[tool.iconName] || FileText;
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, 3);

  const webAppSchema = generateWebApplicationSchema(tool);
  const howToSchema = generateHowToSchema(tool);
  const faqSchema = generateFAQSchema(tool.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category.name, url: category.href },
    { name: tool.name, url: tool.href },
  ]);

  return (
    <>
      <ToolAnalyticsTracker
        toolId={tool.id}
        toolName={tool.name}
        category={tool.category}
      />
      {/* Structured data schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: category.name, url: category.href },
            { name: tool.name, url: tool.href },
          ]}
        />

        {/* Tool Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={category.href}
                  className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:underline"
                >
                  {category.name}
                </Link>
                {tool.badge && (
                  <Badge variant="accent" className="text-[11px] py-0">
                    {tool.badge}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {tool.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Runs in browser</span>
            </div>
          </div>
        </div>

        {/* Header Ad Slot (Configurable) */}
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER}
          layout="banner"
          className="mb-8"
        />

        {/* Tool Workspace (The Interactive Application) */}
        <section aria-label="Tool Workspace" className="mb-12">
          {children}
        </section>

        {/* In-Content / Middle Ad Slot */}
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT}
          layout="in-article"
          className="my-10"
        />

        {/* Informational & SEO Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-10 border-t border-slate-200">
          {/* Left Column: How-To Steps & Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Key Features of {tool.name}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How-To Instructions */}
            {tool.howToSteps && tool.howToSteps.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-blue-600" />
                  How to Use {tool.name}
                </h2>
                <div className="space-y-4">
                  {tool.howToSteps.map((step, idx) => (
                    <div
                      key={idx}
                      id={`step-${idx + 1}`}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {step.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Accordion */}
            {tool.faqs && tool.faqs.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 divide-y divide-slate-100">
                  {tool.faqs.map((faq, idx) => (
                    <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Related Tools & Trust Callout */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                More in {category.name}
              </h3>
              <div className="space-y-3">
                {relatedTools.map((relTool) => (
                  <RelatedToolLink
                    key={relTool.id}
                    currentToolId={tool.id}
                    relatedTool={relTool}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={category.href}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-between"
                >
                  <span>Explore all {category.name}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
              <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm mb-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Browser-First Privacy Guarantee
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ToolBox processes your data locally in your browser session. No text, uploaded images, or sensitive PDF documents are transmitted to external servers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Ad Slot (Configurable) */}
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER}
          layout="footer"
          className="mt-12"
        />
      </div>
    </>
  );
}
