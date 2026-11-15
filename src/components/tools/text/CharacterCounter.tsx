'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Copy, Trash2, Download, Check, Sparkles, Hash } from 'lucide-react';

export function CharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const words = (text.trim().match(/\b[^\s]+\b/g) || []).length;
    const lines = text.split(/\n/).length;

    const platforms = [
      { name: 'X / Twitter Post', max: 280, current: total },
      { name: 'SMS (GSM single message)', max: 160, current: total },
      { name: 'Google SEO Title', max: 60, current: total },
      { name: 'Meta Description', max: 160, current: total },
      { name: 'Instagram Bio', max: 150, current: total },
      { name: 'LinkedIn Post', max: 3000, current: total },
    ];

    return {
      total,
      noSpaces,
      letters,
      digits,
      spaces,
      symbols,
      words,
      lines,
      platforms,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    downloadText(text, 'character-counter-export.txt');
  };

  return (
    <div className="space-y-6">
      {/* Metric summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-blue-700">{metrics.total}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mt-1">Characters</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-slate-800">{metrics.noSpaces}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">No Spaces</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-slate-800">{metrics.letters}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Letters</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-slate-800">{metrics.digits}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Digits</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-slate-800">{metrics.spaces}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Spaces</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-3xl font-extrabold text-slate-800">{metrics.symbols}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Symbols</div>
        </div>
      </div>

      {/* Editor Card */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-medium text-slate-500">
              {metrics.words} words • {metrics.lines} lines
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!text}
                aria-label="Copy text"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!text}
                aria-label="Download text"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText('')}
                disabled={!text}
                className="text-red-600 hover:bg-red-50"
                aria-label="Clear text"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text to analyze characters and check social media limits..."
            className="w-full min-h-[260px] p-3 text-slate-900 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none text-base leading-relaxed"
            aria-label="Character counter input"
          />
        </CardContent>
      </Card>

      {/* Platform Limit Progress Meters */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Social Media & SEO Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.platforms.map((p) => {
              const remaining = p.max - p.current;
              const percent = Math.min(100, Math.round((p.current / p.max) * 100));
              const isOver = remaining < 0;

              return (
                <div key={p.name} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className={`font-mono font-medium ${isOver ? 'text-red-600' : 'text-slate-500'}`}>
                      {p.current} / {p.max}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOver
                          ? 'bg-red-500'
                          : percent > 85
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-right">
                    {isOver ? (
                      <span className="text-red-600 font-medium">{Math.abs(remaining)} chars over limit</span>
                    ) : (
                      <span className="text-slate-500">{remaining} characters left</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
