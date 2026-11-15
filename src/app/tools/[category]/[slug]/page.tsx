import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TOOLS, getToolBySlug } from '@/config/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { ToolResolver } from '@/components/tools/ToolResolver';
import { getCanonicalUrl } from '@/lib/seo';

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: getCanonicalUrl(tool.href),
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: getCanonicalUrl(tool.href),
      type: 'website',
      siteName: 'ToolBox',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free Online Tool`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <ToolResolver slug={tool.slug} />
    </ToolLayout>
  );
}
