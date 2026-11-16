import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdSenseScript } from '@/components/ads/AdSense';
import { GoogleAnalyticsScript } from '@/components/analytics/GoogleAnalytics';
import { ConsentManager } from '@/components/consent/ConsentManager';
import { getSiteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'ToolBox — 24 Free Online Utilities & Productivity Tools',
    template: '%s | ToolBox',
  },
  description:
    'Free, fast, and secure online utilities for developers, designers, and professionals. Process text, compress images, merge PDFs, and calculate finances locally in your browser.',
  keywords: [
    'online tools',
    'free utility tools',
    'word counter',
    'image compressor',
    'pdf merger',
    'pdf splitter',
    'json formatter',
    'emi calculator',
    'qr code generator',
    'developer tools',
  ],
  authors: [{ name: 'ToolBox Team' }],
  creator: 'ToolBox',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ToolBox',
    title: 'ToolBox — 24 Free Online Utilities & Productivity Tools',
    description:
      'Fast, free, and secure browser-first online utilities. Process text, compress images, manage PDFs, and calculate finances locally without server uploads.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolBox — Free Online Utilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolBox — Free Online Utilities & Productivity Tools',
    description:
      'Fast, free, and secure browser-first utilities for text, images, PDFs, and financial calculations.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6319866397206659"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <GoogleAnalyticsScript />
        <AdSenseScript />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
}
