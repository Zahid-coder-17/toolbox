'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Percent, ArrowRight, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState<'of' | 'isWhat' | 'change' | 'discount'>('of');

  // Mode 1: What is X% of Y?
  const [p1X, setP1X] = useState<string>('20');
  const [p1Y, setP1Y] = useState<string>('150');

  // Mode 2: X is what % of Y?
  const [p2X, setP2X] = useState<string>('45');
  const [p2Y, setP2Y] = useState<string>('180');

  // Mode 3: Change from A to B
  const [p3A, setP3A] = useState<string>('50');
  const [p3B, setP3B] = useState<string>('75');

  // Mode 4: Add/Subtract X% to Y
  const [p4Base, setP4Base] = useState<string>('100');
  const [p4Pct, setP4Pct] = useState<string>('15');
  const [p4Action, setP4Action] = useState<'add' | 'subtract'>('subtract');

  // Mode 1 Calculation
  const result1 = React.useMemo(() => {
    const x = parseFloat(p1X);
    const y = parseFloat(p1Y);
    if (isNaN(x) || isNaN(y)) return null;
    return ((x / 100) * y).toFixed(2);
  }, [p1X, p1Y]);

  // Mode 2 Calculation
  const result2 = React.useMemo(() => {
    const x = parseFloat(p2X);
    const y = parseFloat(p2Y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return ((x / y) * 100).toFixed(2);
  }, [p2X, p2Y]);

  // Mode 3 Calculation
  const result3 = React.useMemo(() => {
    const a = parseFloat(p3A);
    const b = parseFloat(p3B);
    if (isNaN(a) || isNaN(b) || a === 0) return null;
    const diff = b - a;
    const pct = ((diff / Math.abs(a)) * 100).toFixed(2);
    return {
      diff: diff.toFixed(2),
      pct,
      isIncrease: diff >= 0,
    };
  }, [p3A, p3B]);

  // Mode 4 Calculation
  const result4 = React.useMemo(() => {
    const base = parseFloat(p4Base);
    const pct = parseFloat(p4Pct);
    if (isNaN(base) || isNaN(pct)) return null;
    const delta = (base * pct) / 100;
    const total = p4Action === 'add' ? base + delta : base - delta;
    return {
      delta: delta.toFixed(2),
      total: total.toFixed(2),
    };
  }, [p4Base, p4Pct, p4Action]);

  const tabs = [
    { id: 'of', label: 'What is X% of Y?' },
    { id: 'isWhat', label: 'X is what % of Y?' },
    { id: 'change', label: '% Increase / Decrease' },
    { id: 'discount', label: 'Tax & Discount' },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as typeof activeTab)} />

      {activeTab === 'of' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">What is X% of Y?</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">What is</span>
              <div className="w-28">
                <Input
                  type="number"
                  value={p1X}
                  onChange={(e) => setP1X(e.target.value)}
                  placeholder="X"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">% of</span>
              <div className="w-36">
                <Input
                  type="number"
                  value={p1Y}
                  onChange={(e) => setP1Y(e.target.value)}
                  placeholder="Y"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">?</span>
            </div>

            {result1 !== null && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Result</span>
                  <div className="text-3xl font-black text-blue-900 mt-1">{result1}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Formula: ({p1X} / 100) × {p1Y} = {result1}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'isWhat' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">X is what percent of Y?</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-28">
                <Input
                  type="number"
                  value={p2X}
                  onChange={(e) => setP2X(e.target.value)}
                  placeholder="X"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">is what percent of</span>
              <div className="w-36">
                <Input
                  type="number"
                  value={p2Y}
                  onChange={(e) => setP2Y(e.target.value)}
                  placeholder="Y"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">?</span>
            </div>

            {result2 !== null && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Result</span>
                  <div className="text-3xl font-black text-blue-900 mt-1">{result2}%</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Formula: ({p2X} / {p2Y}) × 100 = {result2}%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'change' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Percentage Change (Increase / Decrease)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">From</span>
              <div className="w-32">
                <Input
                  type="number"
                  value={p3A}
                  onChange={(e) => setP3A(e.target.value)}
                  placeholder="Old Value"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">to</span>
              <div className="w-32">
                <Input
                  type="number"
                  value={p3B}
                  onChange={(e) => setP3B(e.target.value)}
                  placeholder="New Value"
                />
              </div>
            </div>

            {result3 !== null && (
              <div
                className={`rounded-xl border p-6 flex items-center justify-between ${
                  result3.isIncrease
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-red-200 bg-red-50/60'
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                      result3.isIncrease ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {result3.isIncrease ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {result3.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
                  </span>
                  <div
                    className={`text-3xl font-black mt-1 ${
                      result3.isIncrease ? 'text-emerald-900' : 'text-red-900'
                    }`}
                  >
                    {result3.pct}%
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Difference: {result3.diff} (({p3B} - {p3A}) / {p3A} × 100)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'discount' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Price Discount / Sales Tax</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-36">
                <Input
                  type="number"
                  value={p4Base}
                  onChange={(e) => setP4Base(e.target.value)}
                  placeholder="Initial Price ($)"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  variant={p4Action === 'subtract' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setP4Action('subtract')}
                >
                  Discount (-%)
                </Button>
                <Button
                  variant={p4Action === 'add' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setP4Action('add')}
                >
                  Add Tax (+%)
                </Button>
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  value={p4Pct}
                  onChange={(e) => setP4Pct(e.target.value)}
                  placeholder="Rate %"
                />
              </div>
            </div>

            {result4 !== null && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Final Price
                  </span>
                  <div className="text-4xl font-black text-blue-900 mt-1">${result4.total}</div>
                </div>
                <div className="text-xs text-slate-600 bg-white/70 p-3 rounded-lg border border-blue-100">
                  <div>Initial Amount: ${p4Base}</div>
                  <div>
                    {p4Action === 'add' ? 'Tax Added' : 'Savings'}: ${result4.delta}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
