'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Lock, Cookie } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/config/tools';
import { openConsentPreferences } from '@/components/consent/ConsentManager';

export function Footer() {
  const popularTools = TOOLS.filter((t) => t.badge === 'Popular' || t.badge === 'Essential').slice(0, 6);

  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-slate-900">
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg shadow-xs object-contain"
              />
              <span className="text-lg font-bold tracking-tight">
                Tool<span className="text-blue-600">Box</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fast, privacy-first online utilities for developers, writers, designers, and professionals. All 24 tools execute locally in your web browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Zero server uploads. Your data never leaves your device.</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {Object.values(CATEGORIES).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {cat.name} ({cat.toolCount})
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/blog"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Guides &amp; Tutorials →
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-sm">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & privacy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About ToolBox
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openConsentPreferences()}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Cookie className="h-3.5 w-3.5" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolBox. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              100% Client-Side Engine
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              Privacy Focused
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
