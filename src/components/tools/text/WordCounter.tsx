'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Copy, Trash2, Download, Check, Clock, Mic, FileText, AlignLeft } from 'lucide-react';

export function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        keywords: [] as { word: string; count: number; percentage: string }[],
      };
    }

    // Unicode-aware word matching supporting letters, numbers, hyphens and apostrophes
    const wordsArray = trimmed.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
    const words = wordsArray.length;

    // Fast Unicode code point counting without allocating massive arrays
    let characters = 0;
    let charactersNoSpaces = 0;
    for (const ch of text) {
      characters++;
      if (!/\s/u.test(ch)) {
        charactersNoSpaces++;
      }
    }

    // Safe sentence boundary counting without catastrophic backtracking
    const sentenceMatches = text.match(/[.!?]+(?:\s+|$)/g);
    const sentences = (sentenceMatches ? sentenceMatches.length : 0) + (trimmed.length > 0 && !/[.!?]\s*$/.test(trimmed) ? 1 : 0);

    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (trimmed.length > 0 ? 1 : 0);
    const lines = text.split(/\n/).length;

    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

    // Keyword density with Unicode letter support
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
    ]);

    const frequencyMap: Record<string, number> = {};
    for (const w of wordsArray) {
      const clean = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    }

    const sortedKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / (words || 1)) * 100).toFixed(1),
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes: words > 0 ? readingTimeMinutes : 0,
      speakingTimeMinutes: words > 0 ? speakingTimeMinutes : 0,
      keywords: sortedKeywords,
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
    downloadText(text, 'word-counter-export.txt');
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">{stats.words}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mt-1">Words</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.characters}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Characters</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.charactersNoSpaces}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">No Spaces</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.sentences}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Sentences</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.paragraphs}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Paragraphs</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.lines}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Lines</div>
        </div>
      </div>

      {/* Large Input Performance Notification */}
      {text.length > 50000 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-center justify-between">
          <span>Large text detected ({stats.characters.toLocaleString()} characters). Processing is running client-side with zero data leaving your device.</span>
        </div>
      )}

      {/* Main Text Area */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600" />
                Reading: ~{stats.readingTimeMinutes} min
              </span>
              <span className="flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-violet-600" />
                Speaking: ~{stats.speakingTimeMinutes} min
              </span>
            </div>

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
                aria-label="Download text as file"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
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
            placeholder="Type or paste your text here to count words, characters, sentences, reading time, and keyword density..."
            className="w-full min-h-[300px] sm:min-h-[380px] p-3 text-slate-900 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none text-base leading-relaxed"
            aria-label="Text editor for word counting"
          />
        </CardContent>
      </Card>

      {/* Keyword Density Table */}
      {stats.keywords.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-blue-600" />
              Top Keyword Density
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {stats.keywords.map((kw, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                  <span className="font-medium text-slate-700 truncate mr-2">{kw.word}</span>
                  <span className="text-slate-400 shrink-0 font-mono">
                    {kw.count} ({kw.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
