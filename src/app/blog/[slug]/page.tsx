import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES, getArticleBySlug } from '@/config/articles';
import { getToolById, CATEGORIES } from '@/config/tools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCanonicalUrl, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Wrench, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Guide Not Found' };
  }

  const title = `${article.title} — ToolBox Guides`;
  const canonical = getCanonicalUrl(`/blog/${article.slug}`);

  return {
    title,
    description: article.description,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: article.description,
      url: canonical,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [article.author.name],
      siteName: 'ToolBox',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedTools = article.relatedToolIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Guides & Tutorials', url: '/blog' },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { name: 'Guides & Tutorials', url: '/blog' },
            { name: article.title, url: `/blog/${article.slug}` },
          ]}
        />

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs uppercase font-semibold text-blue-700 bg-blue-50/50 border-blue-200">
              {article.category}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{article.author.name}</div>
                <div className="text-[11px] text-slate-500">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Updated: {new Date(article.dateModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Interactive Tool Banner Callout */}
        {relatedTools.length > 0 && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                <Wrench className="h-4 w-4 text-blue-600" />
                Featured Free Interactive Utility
              </div>
              <p className="text-xs text-slate-600">
                You can try the concepts described in this guide immediately using our free, browser-first tools.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {relatedTools.map((tool) => tool && (
                <Link key={tool.id} href={tool.href}>
                  <Button variant="primary" size="sm" className="text-xs">
                    Open {tool.name} →
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="space-y-10 text-slate-800 leading-relaxed">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2">
                {section.heading}
              </h2>

              {section.subheading && (
                <h3 className="text-lg font-semibold text-slate-800">
                  {section.subheading}
                </h3>
              )}

              <div className="space-y-3 text-base text-slate-700 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {section.keyTakeaway && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Key Takeaway:</strong> {section.keyTakeaway}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer Navigation & Related Tools */}
        <footer className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Guides
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Explore 24 Free Tools <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
