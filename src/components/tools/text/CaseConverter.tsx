'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Copy, Trash2, Download, Check, Sparkles } from 'lucide-react';

export function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCase = (type: string) => {
    if (!text) return;

    let result = '';
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;

      case 'lower':
        result = text.toLowerCase();
        break;

      case 'title':
        const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']);
        result = text.replace(/\w\S*/g, (txt, offset) => {
          const lower = txt.toLowerCase();
          if (offset !== 0 && minorWords.has(lower)) {
            return lower;
          }
          return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
        break;

      case 'sentence':
        result = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;

      case 'capitalized':
        result = text.replace(/\b\w/g, (c) => c.toUpperCase());
        break;

      case 'camel':
        result = text
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^([A-Z])/, (m) => m.toLowerCase());
        break;

      case 'pascal':
        result = text
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^([a-z])/, (m) => m.toUpperCase());
        break;

      case 'snake':
        result = text
          .trim()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '_')
          .replace(/__+/g, '_')
          .toLowerCase();
        break;

      case 'constant':
        result = text
          .trim()
          .replace(/\s+/g, '_')
          .replace(/[^\w]/g, '_')
          .replace(/__+/g, '_')
          .toUpperCase();
        break;

      case 'kebab':
        result = text
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '-')
          .replace(/--+/g, '-')
          .toLowerCase();
        break;

      case 'alternating':
        result = text
          .split('')
          .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join('');
        break;

      default:
        result = text;
    }

    setText(result);
  };

  const handleCopy = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttons = [
    { id: 'sentence', label: 'Sentence case' },
    { id: 'lower', label: 'lower case' },
    { id: 'upper', label: 'UPPER CASE' },
    { id: 'capitalized', label: 'Capitalized Case' },
    { id: 'title', label: 'Title Case' },
    { id: 'camel', label: 'camelCase' },
    { id: 'pascal', label: 'PascalCase' },
    { id: 'snake', label: 'snake_case' },
    { id: 'constant', label: 'CONSTANT_CASE' },
    { id: 'kebab', label: 'kebab-case' },
    { id: 'alternating', label: 'aLtErNaTiNg' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Input & Output Text
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!text}
                aria-label="Copy converted text"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(text, 'case-converted.txt')}
                disabled={!text}
                aria-label="Download converted text"
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
            placeholder="Type or paste your text here, then choose a case format below..."
            className="w-full min-h-[260px] p-3 text-slate-900 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none text-base leading-relaxed"
            aria-label="Case converter text area"
          />
        </CardContent>
      </Card>

      {/* Conversion Actions Grid */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Click to Convert Case
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {buttons.map((b) => (
              <Button
                key={b.id}
                variant="secondary"
                size="md"
                onClick={() => convertCase(b.id)}
                disabled={!text}
                className="justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200"
              >
                {b.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
