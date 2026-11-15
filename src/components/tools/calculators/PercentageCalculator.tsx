'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { AlertCircle, HelpCircle } from 'lucide-react';

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

  // Mode 2 Calculation with zero division protection
  const result2 = React.useMemo(() => {
    const x = parseFloat(p2X);
    const y = parseFloat(p2Y);
    if (isNaN(x) || isNaN(y)) return null;
    if (y === 0) {
      return { error: 'Cannot divide by zero. Denominator (Y) must be a non-zero number.', value: null };
    }
    return { error: null, value: ((x / y) * 100).toFixed(2) };
  }, [p2X, p2Y]);

  // Mode 3 Calculation with zero division protection
  const result3 = React.useMemo(() => {
    const a = parseFloat(p3A);
    const b = parseFloat(p3B);
    if (isNaN(a) || isNaN(b)) return null;
    if (a === 0) {
      return { error: 'Initial value (A) cannot be zero for percentage change calculation.', data: null };
    }
    const diff = b - a;
    const pct = ((diff / Math.abs(a)) * 100).toFixed(2);
    return {
      error: null,
      data: {
        diff: diff.toFixed(2),
        pct,
        isIncrease: diff >= 0,
      },
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
                  aria-label="Percentage X"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">% of</span>
              <div className="w-36">
                <Input
                  type="number"
                  value={p1Y}
                  onChange={(e) => setP1Y(e.target.value)}
                  placeholder="Y"
                  aria-label="Base value Y"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">?</span>
            </div>

            {result1 !== null && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Result</span>
                  <div className="text-3xl font-black text-blue-900 mt-1">{result1}</div>
                </div>
                <div className="text-xs text-blue-800 bg-white/70 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Worked Formula:</strong> ({p1X} ÷ 100) × {p1Y} = {(parseFloat(p1X) / 100).toFixed(4)} × {p1Y} = <strong>{result1}</strong>
                  </span>
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
                  aria-label="Numerator X"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">is what percent of</span>
              <div className="w-36">
                <Input
                  type="number"
                  value={p2Y}
                  onChange={(e) => setP2Y(e.target.value)}
                  placeholder="Y"
                  aria-label="Denominator Y"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">?</span>
            </div>

            {result2?.error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{result2.error}</span>
              </div>
            )}

            {result2?.value !== null && result2?.value !== undefined && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Result</span>
                  <div className="text-3xl font-black text-blue-900 mt-1">{result2.value}%</div>
                </div>
                <div className="text-xs text-blue-800 bg-white/70 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Worked Formula:</strong> ({p2X} ÷ {p2Y}) × 100 = <strong>{result2.value}%</strong>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'change' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Percentage Increase / Decrease</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">What is the % change from</span>
              <div className="w-32">
                <Input
                  type="number"
                  value={p3A}
                  onChange={(e) => setP3A(e.target.value)}
                  placeholder="Initial (A)"
                  aria-label="Initial value A"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">to</span>
              <div className="w-32">
                <Input
                  type="number"
                  value={p3B}
                  onChange={(e) => setP3B(e.target.value)}
                  placeholder="Final (B)"
                  aria-label="Final value B"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">?</span>
            </div>

            {result3?.error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{result3.error}</span>
              </div>
            )}

            {result3?.data && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    {result3.data.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-3xl font-black ${
                        result3.data.isIncrease ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {result3.data.isIncrease ? '+' : ''}{result3.data.pct}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      (Absolute difference: {result3.data.isIncrease ? '+' : ''}{result3.data.diff})
                    </span>
                  </div>
                </div>
                <div className="text-xs text-blue-800 bg-white/70 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Worked Formula:</strong> (({p3B} - {p3A}) ÷ |{p3A}|) × 100 = ({result3.data.diff} ÷ {Math.abs(parseFloat(p3A))}) × 100 = <strong>{result3.data.pct}%</strong>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'discount' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Add / Subtract Percentage (Tax & Discount)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Amount:</span>
              <div className="w-32">
                <Input
                  type="number"
                  value={p4Base}
                  onChange={(e) => setP4Base(e.target.value)}
                  placeholder="Base Amount"
                  aria-label="Base amount"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={p4Action === 'add' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setP4Action('add')}
                >
                  + Add (Tax)
                </Button>
                <Button
                  variant={p4Action === 'subtract' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setP4Action('subtract')}
                >
                  - Subtract (Discount)
                </Button>
              </div>

              <div className="w-24">
                <Input
                  type="number"
                  value={p4Pct}
                  onChange={(e) => setP4Pct(e.target.value)}
                  placeholder="%"
                  aria-label="Tax or discount percentage"
                />
              </div>
              <span className="text-sm font-medium text-slate-700">%</span>
            </div>

            {result4 !== null && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col justify-between space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {p4Action === 'add' ? 'Tax Amount' : 'Discount Savings'}
                    </span>
                    <div className="text-2xl font-bold text-slate-800 mt-1">${result4.delta}</div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Final Total</span>
                    <div className="text-3xl font-black text-blue-900 mt-1">${result4.total}</div>
                  </div>
                </div>
                <div className="text-xs text-blue-800 bg-white/70 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Worked Formula:</strong> {p4Base} {p4Action === 'add' ? '+' : '-'} ({p4Base} × {p4Pct}%) = {p4Base} {p4Action === 'add' ? '+' : '-'} {result4.delta} = <strong>${result4.total}</strong>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
