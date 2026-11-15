'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, Sparkles, Globe } from 'lucide-react';

export function SlugGenerator() {
  const [text, setText] = useState('Top 10 Best Productivity Tools for Developers in 2026!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [stripNumbers, setStripNumbers] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    if (!text.trim()) return '';

    // Normalize accents / diacritics
    let str = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (lowercase) {
      str = str.toLowerCase();
    }

    if (stripNumbers) {
      str = str.replace(/[0-9]/g, '');
    }

    if (removeStopWords) {
      const stopWords = new Set([
        'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
        'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
        'did', 'do', 'does', 'doing', 'down', 'during',
        'each', 'few', 'for', 'from', 'further',
        'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
        'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
        'me', 'more', 'most', 'my', 'myself',
        'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
        'same', 'she', 'should', 'so', 'some', 'such',
        'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
        'under', 'until', 'up', 'very',
        'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
        'you', 'your', 'yours', 'yourself', 'yourselves'
      ]);
      const words = str.split(/\s+/).filter((w) => !stopWords.has(w.toLowerCase()));
      str = words.join(' ');
    }

    // Replace non-alphanumeric with separator
    str = str.replace(/[^a-zA-Z0-9]+/g, separator);

    // Remove repeated separators
    const sepRegex = new RegExp(`\\${separator}+`, 'g');
    str = str.replace(sepRegex, separator);

    // Trim separators from start and end
    const trimRegex = new RegExp(`^\\${separator}+|\\${separator}+$`, 'g');
    str = str.replace(trimRegex, '');

    return str;
  }, [text, separator, lowercase, removeStopWords, stripNumbers]);

  const handleCopy = async () => {
    if (!slug) return;
    const ok = await copyToClipboard(slug);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generated Result Header Banner */}
      <Card className="border-blue-200 bg-blue-50/40">
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Generated Slug
            </span>
            <Button variant="primary" size="sm" onClick={handleCopy} disabled={!slug}>
              {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Slug'}
            </Button>
          </div>

          <div className="rounded-lg bg-white p-3 font-mono text-base font-semibold text-blue-900 border border-blue-200 break-all select-all">
            {slug || <span className="text-slate-400 font-normal">Slug preview will appear here...</span>}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono truncate">
            <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>https://example.com/posts/{slug || 'your-slug'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Input Text Area */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Source Text or Title
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Type or paste any sentence, product title, or heading..."
            className="w-full p-3 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            aria-label="Input text for slug generation"
          />

          {/* Options */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block mb-1.5">Separator</span>
              <div className="flex gap-2">
                <Button
                  variant={separator === '-' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSeparator('-')}
                >
                  Hyphen (-)
                </Button>
                <Button
                  variant={separator === '_' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSeparator('_')}
                >
                  Underscore (_)
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => setLowercase(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Force Lowercase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={removeStopWords}
                  onChange={(e) => setRemoveStopWords(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Remove Stop Words (SEO)</span>
              </label>
            </div>

            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={stripNumbers}
                  onChange={(e) => setStripNumbers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Remove Numbers</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
