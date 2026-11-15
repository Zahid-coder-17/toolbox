'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { diffLines, diffWords, Change } from 'diff';
import { ArrowLeftRight, Trash2, SplitSquareVertical, Rows, Sparkles } from 'lucide-react';

export function TextDiffChecker() {
  const sampleOriginal = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  const sampleModified = `function calculateTotal(items, discount = 0) {
  // Use modern reduce with discount support
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = subtotal * (1 - discount);
  return finalTotal;
}`;

  const [original, setOriginal] = useState(sampleOriginal);
  const [modified, setModified] = useState(sampleModified);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [granularity, setGranularity] = useState<'lines' | 'words'>('lines');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diffResult = useMemo(() => {
    const orig = ignoreWhitespace ? original.replace(/[ \t]+/g, ' ') : original;
    const mod = ignoreWhitespace ? modified.replace(/[ \t]+/g, ' ') : modified;

    if (granularity === 'words') {
      return diffWords(orig, mod);
    }
    return diffLines(orig, mod);
  }, [original, modified, granularity, ignoreWhitespace]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const part of diffResult) {
      if (part.added) added += part.count || 1;
      if (part.removed) removed += part.count || 1;
    }
    return { added, removed };
  }, [diffResult]);

  const handleSwap = () => {
    setOriginal(modified);
    setModified(original);
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={viewMode === 'split' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <SplitSquareVertical className="h-3.5 w-3.5" />
            Side by Side
          </Button>
          <Button
            variant={viewMode === 'unified' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('unified')}
          >
            <Rows className="h-3.5 w-3.5" />
            Unified View
          </Button>
          <div className="h-4 w-px bg-slate-300 mx-1" />
          <Button
            variant={granularity === 'lines' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setGranularity('lines')}
          >
            Lines
          </Button>
          <Button
            variant={granularity === 'words' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setGranularity('words')}
          >
            Words
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Ignore Whitespace</span>
          </label>
          <Button variant="outline" size="sm" onClick={handleSwap} title="Swap texts">
            <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
            Swap
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOriginal('');
              setModified('');
            }}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Difference Summary Badges */}
      <div className="flex items-center gap-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          +{stats.added} Additions
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800">
          -{stats.removed} Deletions
        </span>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Original Text (Before)
            </div>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full min-h-[220px] p-2 font-mono text-xs text-slate-800 bg-slate-50/50 rounded-lg focus:outline-none resize-y"
              aria-label="Original text input"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Modified Text (After)
            </div>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full min-h-[220px] p-2 font-mono text-xs text-slate-800 bg-slate-50/50 rounded-lg focus:outline-none resize-y"
              aria-label="Modified text input"
            />
          </CardContent>
        </Card>
      </div>

      {/* Diff Result Rendering */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Difference Visualizer ({viewMode === 'split' ? 'Side-by-Side Comparison' : 'Unified Comparison'})</span>
          </div>

          {diffResult.length === 0 || (!original && !modified) ? (
            <div className="text-slate-500 py-8 text-center font-sans font-mono text-xs bg-slate-900 rounded-lg">
              Enter text in both boxes above to see the comparison.
            </div>
          ) : viewMode === 'split' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs leading-relaxed overflow-x-auto rounded-lg bg-slate-900 p-4 text-slate-100 min-h-[200px]">
              {/* Left: Original with Deletions */}
              <div className="border-r border-slate-800 pr-2 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 border-b border-slate-800 pb-1">Original View</div>
                {diffResult
                  .filter((part) => !part.added)
                  .map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.removed
                          ? 'bg-red-950/80 text-red-300 border-l-2 border-red-500 px-1 inline-block w-full line-through opacity-85'
                          : 'text-slate-300 px-1 inline-block w-full'
                      }
                    >
                      {part.value}
                    </span>
                  ))}
              </div>
              {/* Right: Modified with Additions */}
              <div className="pl-2 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-2 border-b border-slate-800 pb-1">Modified View</div>
                {diffResult
                  .filter((part) => !part.removed)
                  .map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? 'bg-emerald-950/80 text-emerald-300 border-l-2 border-emerald-500 px-1 inline-block w-full'
                          : 'text-slate-300 px-1 inline-block w-full'
                      }
                    >
                      {part.value}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs leading-relaxed overflow-x-auto rounded-lg bg-slate-900 p-4 text-slate-100 min-h-[200px]">
              {diffResult.map((part: Change, index: number) => {
                const color = part.added
                  ? 'bg-emerald-950 text-emerald-300 border-l-2 border-emerald-500 px-1 inline-block w-full'
                  : part.removed
                  ? 'bg-red-950 text-red-300 border-l-2 border-red-500 px-1 inline-block w-full line-through opacity-80'
                  : 'text-slate-300 px-1 inline-block w-full';

                return (
                  <span key={index} className={color}>
                    {part.value}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
