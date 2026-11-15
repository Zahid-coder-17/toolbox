import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, ToolCategory, getToolsByCategory } from '@/config/tools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard, ICON_MAP } from '@/components/ui/tool-card';
import { AdUnit } from '@/components/ads/AdSense';
import {
  getCanonicalUrl,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateFAQSchema,
} from '@/lib/seo';
import { ShieldCheck, Sparkles, FileText, HelpCircle, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';

interface CategoryFaq {
  question: string;
  answer: string;
}

const CATEGORY_EDITORIAL: Record<
  ToolCategory,
  {
    heading: string;
    overview: string;
    benefits: { title: string; desc: string }[];
    faqs: CategoryFaq[];
  }
> = {
  text: {
    heading: 'Professional In-Browser Text & Code Utilities',
    overview:
      'The ToolBox Text Utilities suite provides software developers, technical writers, editors, and SEO professionals with instant, client-side text processing. Whether calculating exact reading durations, formatting minified JSON payloads, comparing document revisions, or generating cryptographically secure UUIDs, all transformations execute immediately in your browser memory without network latency or external data retention.',
    benefits: [
      {
        title: 'Zero Server Exposure',
        desc: 'Sensitive code snippets, confidential drafts, and proprietary JSON payloads remain strictly inside your browser runtime.',
      },
      {
        title: 'Full Unicode & UTF-8 Integrity',
        desc: 'Advanced multi-byte character support prevents diacritic mangling across emojis, accented characters, and non-Latin scripts.',
      },
      {
        title: 'Zero Latency Execution',
        desc: 'Instant processing with client-side JavaScript means no round-trip network delays or server timeouts on massive inputs.',
      },
      {
        title: 'Clean Developer Ergonomics',
        desc: 'One-click copy, formatted downloads, and standard syntax validators streamline your everyday coding workflows.',
      },
    ],
    faqs: [
      {
        question: 'Are my text inputs, code, or JSON strings saved on your servers?',
        answer: 'No. All text manipulation tools run 100% locally in your browser. No strings, tokens, or documents are ever uploaded to a remote database.',
      },
      {
        question: 'How are reading times and speaking speeds computed?',
        answer: 'Reading time is computed using the global average adult silent reading rate of 200 words per minute. Speaking speed is computed at 130 words per minute.',
      },
      {
        question: 'What version of UUID is generated?',
        answer: 'Our UUID generator produces RFC 4122 Version 4 random UUIDs generated with cryptographically strong values via the browser Web Crypto API.',
      },
    ],
  },
  image: {
    heading: 'High-Performance Client-Side Image Processing & Conversion',
    overview:
      'ToolBox Image Utilities harness modern browser HTML5 Canvas and WebAssembly APIs to optimize, resize, and convert visual media without third-party server uploads. Easily compress heavy photos for web performance, convert iPhone HEIC pictures to universal JPGs, generate complete favicon packages, and customize scannable QR codes with zero bandwidth usage.',
    benefits: [
      {
        title: 'Strict Visual Quality Retention',
        desc: 'Bicubic downsampling and configurable quality sliders ensure crisp imagery while slashing payload byte weight.',
      },
      {
        title: 'Alpha Transparency Preservation',
        desc: 'Convert PNG graphics to next-gen WebP without losing transparency or introducing ugly halo artifacts.',
      },
      {
        title: 'Complete Device Privacy',
        desc: 'Personal family photos, screenshots, and company logos never leave your computer or phone.',
      },
      {
        title: 'No Cloud Wait Times',
        desc: 'Hardware-accelerated rendering executes directly on your local GPU/CPU for immediate downloads.',
      },
    ],
    faqs: [
      {
        question: 'Does converting PNG to WebP reduce file size?',
        answer: 'Yes! Google WebP typically slashes image file sizes by 30% to 70% compared to PNG while preserving full alpha transparency, boosting Core Web Vitals.',
      },
      {
        question: 'Are image dimensions or resolutions reduced during compression?',
        answer: 'No, unless you explicitly choose to resize dimensions in the Image Resizer, the Image Compressor preserves original pixel dimensions.',
      },
      {
        question: 'Can I generate static QR codes for commercial use?',
        answer: 'Yes! QR codes generated on ToolBox encode data directly into the matrix, never expire, and have no scanning limits.',
      },
    ],
  },
  pdf: {
    heading: 'Secure, Cloud-Free PDF Document Processing',
    overview:
      'Managing PDF documents often involves sensitive financial agreements, medical records, invoices, and legal contracts. Traditional online PDF tools upload these confidential documents to remote cloud servers. ToolBox uses pdf-lib and PDF.js to merge, split, compress, and convert PDF pages locally in client memory with 100% data confidentiality.',
    benefits: [
      {
        title: 'Guaranteed Data Confidentiality',
        desc: 'Documents are processed in local memory and are never uploaded or retained on third-party servers.',
      },
      {
        title: 'Precision Page Management',
        desc: 'Custom range extractions (e.g., 1-4, 7, 9-12) or split-all ZIP bundling with strict boundary validation.',
      },
      {
        title: 'Lossless Vector Preservation',
        desc: 'Fonts, text selections, and vector shapes remain crisp and intact across merges and stream compressions.',
      },
      {
        title: 'Print-Ready Image Conversion',
        desc: 'Extract and render PDF pages into 150 DPI web previews or 300 DPI high-resolution JPG images.',
      },
    ],
    faqs: [
      {
        question: 'Why is client-side PDF processing safer than other online PDF sites?',
        answer: 'Because your documents are never transmitted across the internet to an external server. The PDF bytes stay strictly inside your browser sandbox.',
      },
      {
        question: 'Can I merge multiple large PDF documents?',
        answer: 'Yes! Since operations run in your device browser, merging is bounded only by your local device RAM rather than arbitrary cloud file limits.',
      },
      {
        question: 'How does the PDF Compressor optimize file size?',
        answer: 'It optimizes stream objects, strips duplicate font subsets, and consolidates internal cross-reference tables via pdf-lib object stream packing.',
      },
    ],
  },
  calculators: {
    heading: 'Interactive Mathematical, Financial & Date Calculators',
    overview:
      'Make informed personal finance and planning decisions with precision calculations. ToolBox Calculators implement verified reducing-balance EMI formulas, multi-frequency compound interest projections, leap-year-aware chronological age calculations, and multi-scenario percentage solvers with complete interactive schedules and CSV exports.',
    benefits: [
      {
        title: 'Mathematically Verified Formulas',
        desc: 'Every calculation uses standard financial and mathematical formulas with zero-division safeguards.',
      },
      {
        title: 'Zero Interest & Edge Case Support',
        desc: 'Handles 0% financing rates, leap year birthdays (Feb 29), and negative percentage changes seamlessly.',
      },
      {
        title: 'Interactive Repayment Schedules',
        desc: 'Inspect year-by-year and month-by-month principal and interest amortizations in visual tables.',
      },
      {
        title: 'Data Portability',
        desc: 'Download your customized amortization or accumulation schedules directly as CSV files for spreadsheet modeling.',
      },
    ],
    faqs: [
      {
        question: 'What is the reducing balance formula used in the EMI Calculator?',
        answer: 'We use the standard formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is periodic interest, and N is the total monthly installments.',
      },
      {
        question: 'How does compounding frequency impact future investment growth?',
        answer: 'More frequent compounding periods (such as monthly or daily versus annual) generate higher total wealth due to interest earning interest sooner.',
      },
      {
        question: 'How does the Age Calculator handle leap year birthdays on February 29?',
        answer: 'In common (non-leap) years, the calculator recognizes celebration on March 1st and accurately measures elapsed chronological milestones.',
      },
    ],
  },
};

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
  const canonical = getCanonicalUrl(category.href);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'ToolBox',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${category.name} on ToolBox`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
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
  const editorial = CATEGORY_EDITORIAL[category.id];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category.name, url: category.href },
  ]);

  const collectionSchema = generateCollectionPageSchema(category, tools);
  const categoryFaqSchema = generateFAQSchema(editorial.faqs);

  const otherCategories = Object.values(CATEGORIES).filter(
    (c) => c.id !== category.id
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {categoryFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryFaqSchema) }}
        />
      )}

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

          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {category.description} Every tool runs locally in your web browser for instant responsiveness and uncompromising privacy.
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
        <section aria-labelledby="category-tools-heading" className="mb-16">
          <h2
            id="category-tools-heading"
            className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-blue-600" />
            All {category.name} ({tools.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* In-Content Ad */}
        <AdUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT} className="my-10" />

        {/* Editorial Guide / Deep-Dive */}
        <section
          aria-labelledby="category-guide-heading"
          className="mb-16 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <BookOpen className="h-4 w-4" />
              Comprehensive Category Guide
            </div>
            <h2
              id="category-guide-heading"
              className="text-2xl font-extrabold text-slate-900"
            >
              {editorial.heading}
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-4xl">
              {editorial.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {editorial.benefits.map((benefit, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Category FAQs */}
        <section
          aria-labelledby="category-faq-heading"
          className="mb-16 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs"
        >
          <h2
            id="category-faq-heading"
            className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"
          >
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Frequently Asked Questions about {category.name}
          </h2>

          <div className="space-y-6 divide-y divide-slate-100">
            {editorial.faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                <h3 className="text-base font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Categories Internal Linking */}
        <section aria-labelledby="other-categories-heading" className="mb-12">
          <h2
            id="other-categories-heading"
            className="text-lg font-bold text-slate-900 mb-4"
          >
            Explore Other Tool Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCategories.map((other) => {
              const OtherIcon = ICON_MAP[other.iconName] || FileText;
              return (
                <Link
                  key={other.id}
                  href={other.href}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <OtherIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {other.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {other.toolCount} free tools
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer Ad */}
        <AdUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER} className="mt-8" />
      </div>
    </>
  );
}
