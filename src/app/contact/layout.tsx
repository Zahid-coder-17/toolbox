import React from 'react';
import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact & Feedback — ToolBox',
  description: 'Get in touch with the ToolBox team. Share feedback, report issues, or suggest new client-side utilities.',
  alternates: {
    canonical: getCanonicalUrl('/contact'),
  },
  openGraph: {
    title: 'Contact & Feedback — ToolBox',
    description: 'Get in touch with the ToolBox team. Share feedback, report issues, or suggest new client-side utilities.',
    url: getCanonicalUrl('/contact'),
    type: 'website',
    siteName: 'ToolBox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Feedback — ToolBox',
    description: 'Get in touch with the ToolBox team. Share feedback, report issues, or suggest new client-side utilities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
