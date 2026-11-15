'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Copy, RefreshCw, Download, Check, ShieldCheck, Hash } from 'lucide-react';

export function UuidGenerator() {
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [addBraces, setAddBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate cryptographically secure v4 UUID
  const generateV4 = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback using crypto.getRandomValues
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Variant RFC 4122
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const formatUuid = (raw: string) => {
    let res = raw;
    if (uppercase) res = res.toUpperCase();
    if (removeHyphens) res = res.replace(/-/g, '');
    if (addBraces) res = `{${res}}`;
    return res;
  };

  const generateBatch = () => {
    const list: string[] = [];
    const count = Math.min(1000, Math.max(1, quantity));
    for (let i = 0; i < count; i++) {
      list.push(formatUuid(generateV4()));
    }
    setUuids(list);
  };

  useEffect(() => {
    generateBatch();
  }, [quantity, uppercase, removeHyphens, addBraces]);

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    const ok = await copyToClipboard(uuids.join('\n'));
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (uuid: string, idx: number) => {
    const ok = await copyToClipboard(uuid);
    if (ok) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Configuration Bar */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="uuid-qty" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quantity:
              </label>
              <div className="flex items-center gap-1">
                {[1, 5, 10, 50, 100].map((num) => (
                  <Button
                    key={num}
                    variant={quantity === num ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setQuantity(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={generateBatch}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedAll ? 'Copied All' : 'Copy All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(uuids.join('\n'), 'uuids.txt')}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>

          {/* Format Options */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>UPPERCASE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Remove Hyphens</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={addBraces}
                onChange={(e) => setAddBraces(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Add Braces &#123;...&#125;</span>
            </label>

            <div className="ml-auto flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Web Crypto API (CSPRNG)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UUIDs Display List */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
            <span>Generated UUIDs ({uuids.length})</span>
            <span>Click any UUID to copy</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto space-y-1.5 pt-2">
            {uuids.map((uuid, idx) => (
              <div
                key={idx}
                onClick={() => handleCopySingle(uuid, idx)}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 font-mono text-sm text-slate-800 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border border-slate-100 transition-colors group select-all"
              >
                <span>{uuid}</span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600 shrink-0 ml-2">
                  {copiedIndex === idx ? (
                    <span className="text-emerald-600 font-sans font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Copied
                    </span>
                  ) : (
                    <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
