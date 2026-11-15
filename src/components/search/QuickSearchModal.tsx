'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, CornerDownLeft, FileText } from 'lucide-react';
import { searchTools } from '@/config/tools';
import { ICON_MAP } from '@/components/ui/tool-card';

export function QuickSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchTools(query), [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick Search Tools"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 24 tools (e.g. compress, word count, pdf, emi)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-1"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-50">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No matching tools found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((tool) => {
              const Icon = ICON_MAP[tool.iconName] || FileText;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => {
                    setQuery('');
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">
                        {tool.shortDescription}
                      </div>
                    </div>
                  </div>
                  <CornerDownLeft className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between bg-slate-50 px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span>{results.length} tools available</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
