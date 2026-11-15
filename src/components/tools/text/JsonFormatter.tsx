'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Copy, Trash2, Download, Check, AlertCircle, CheckCircle, Code2, Minimize, Sparkles, FolderTree } from 'lucide-react';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'tree'>('editor');

  const sampleJson = `{
  "platform": "ToolBox",
  "version": 2.0,
  "status": "production-ready",
  "features": [
    "100% Client-Side Privacy",
    "24 Free Utility Tools",
    "Zero Server Uploads"
  ],
  "stats": {
    "speed": "instant",
    "security": "bank-grade",
    "cost": 0
  }
}`;

  const formatJson = (spaces: number | '\t') => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInput(formatted);
      setError(null);
    } catch (err: unknown) {
      extractErrorDetails(err);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setError(null);
    } catch (err: unknown) {
      extractErrorDetails(err);
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError({ message: 'Input is empty.' });
      return;
    }
    try {
      JSON.parse(input);
      setError(null);
    } catch (err: unknown) {
      extractErrorDetails(err);
    }
  };

  const extractErrorDetails = (err: unknown) => {
    if (err instanceof Error) {
      const msg = err.message;
      // Try to extract line and column from standard V8 error string e.g. "at position 45" or "line 2 column 5"
      const posMatch = msg.match(/position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const upToPos = input.substring(0, pos);
        const lines = upToPos.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        setError({ message: msg, line, column });
        return;
      }
      setError({ message: msg });
    } else {
      setError({ message: 'Invalid JSON syntax' });
    }
  };

  const handleCopy = async () => {
    if (!input) return;
    const ok = await copyToClipboard(input);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render tree recursively
  const renderTreeNode = (data: unknown, keyName?: string): React.ReactNode => {
    if (data === null) {
      return (
        <div className="pl-4 font-mono text-xs">
          {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
          <span className="text-slate-400 italic">null</span>
        </div>
      );
    }

    if (typeof data === 'boolean') {
      return (
        <div className="pl-4 font-mono text-xs">
          {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
          <span className="text-amber-600 font-semibold">{data ? 'true' : 'false'}</span>
        </div>
      );
    }

    if (typeof data === 'number') {
      return (
        <div className="pl-4 font-mono text-xs">
          {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
          <span className="text-blue-600 font-semibold">{data}</span>
        </div>
      );
    }

    if (typeof data === 'string') {
      return (
        <div className="pl-4 font-mono text-xs truncate">
          {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
          <span className="text-emerald-700">&quot;{data}&quot;</span>
        </div>
      );
    }

    if (Array.isArray(data)) {
      return (
        <details open className="pl-4 font-mono text-xs my-1">
          <summary className="cursor-pointer text-slate-700 hover:text-blue-600 select-none">
            {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
            <span className="text-slate-500 font-sans">Array[{data.length}]</span>
          </summary>
          <div className="border-l border-slate-200 pl-2 mt-1 space-y-1">
            {data.map((item, index) => (
              <div key={index}>{renderTreeNode(item, `[${index}]`)}</div>
            ))}
          </div>
        </details>
      );
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data as object);
      return (
        <details open className="pl-4 font-mono text-xs my-1">
          <summary className="cursor-pointer text-slate-700 hover:text-blue-600 select-none">
            {keyName && <span className="text-violet-600 font-semibold">{keyName}: </span>}
            <span className="text-slate-500 font-sans">Object&#123;{keys.length}&#125;</span>
          </summary>
          <div className="border-l border-slate-200 pl-2 mt-1 space-y-1">
            {keys.map((k) => (
              <div key={k}>{renderTreeNode((data as Record<string, unknown>)[k], k)}</div>
            ))}
          </div>
        </details>
      );
    }

    return null;
  };

  let parsedTreeData: unknown = null;
  let parseSucceeded = false;
  if (input.trim()) {
    try {
      parsedTreeData = JSON.parse(input);
      parseSucceeded = true;
    } catch {
      parseSucceeded = false;
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => formatJson(2)}>
            <Code2 className="h-3.5 w-3.5" />
            Prettify (2 Spaces)
          </Button>
          <Button variant="secondary" size="sm" onClick={() => formatJson(4)}>
            4 Spaces
          </Button>
          <Button variant="secondary" size="sm" onClick={() => formatJson('\t')}>
            Tabs
          </Button>
          <Button variant="secondary" size="sm" onClick={minifyJson}>
            <Minimize className="h-3.5 w-3.5" />
            Minify
          </Button>
          <Button variant="outline" size="sm" onClick={validateJson}>
            <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
            Validate
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput(sampleJson);
              setError(null);
            }}
            className="text-xs text-blue-600"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Load Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!input}
            aria-label="Copy JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadText(input, 'formatted.json', 'application/json')}
            disabled={!input}
            aria-label="Download JSON file"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput('');
              setError(null);
            }}
            disabled={!input}
            className="text-red-600 hover:bg-red-50"
            aria-label="Clear JSON"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* View Switcher: Editor vs Tree */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Code Editor
        </button>
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'tree'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="h-3.5 w-3.5" />
          Tree View
        </button>
      </div>

      {/* Error / Success Status Banner */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold">Invalid JSON Syntax</div>
            <p className="text-xs text-red-600 mt-0.5">{error.message}</p>
            {error.line !== undefined && (
              <p className="text-xs font-mono font-medium mt-1">
                Line {error.line}, Column {error.column}
              </p>
            )}
          </div>
        </div>
      )}

      {input && !error && parseSucceeded && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 border border-emerald-200 text-xs font-medium text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Valid JSON format</span>
        </div>
      )}

      {/* Editor or Tree View */}
      {activeTab === 'editor' ? (
        <Card>
          <CardContent className="p-2 sm:p-4">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste raw or unformatted JSON here..."
              spellCheck={false}
              className="w-full min-h-[380px] p-3 font-mono text-sm text-slate-900 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none leading-relaxed"
              aria-label="JSON input editor"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 min-h-[380px] overflow-auto">
            {parseSucceeded && parsedTreeData !== null ? (
              renderTreeNode(parsedTreeData)
            ) : (
              <div className="py-12 text-center text-sm text-slate-400">
                Enter valid JSON to view interactive tree structure.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
