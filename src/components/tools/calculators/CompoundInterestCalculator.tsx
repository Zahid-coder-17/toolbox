'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { downloadText } from '@/lib/utils';
import { Download, TrendingUp, Sparkles, Table, DollarSign } from 'lucide-react';

interface YearlyGrowth {
  year: number;
  deposits: number;
  interestEarned: number;
  totalInterest: number;
  balance: number;
}

export function CompoundInterestCalculator() {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(8.0);
  const [years, setYears] = useState<number>(20);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 12 = monthly, 1 = annually, 4 = quarterly, 365 = daily

  const calculations = useMemo(() => {
    const P0 = initialPrincipal;
    const PMT = monthlyContribution;
    const r = annualRate / 100;
    const n = compoundFrequency;
    const t = years;

    const yearlyData: YearlyGrowth[] = [];
    let currentBalance = P0;
    let totalDeposited = P0;

    for (let yr = 1; yr <= t; yr++) {
      let yearInterest = 0;
      // Simulate year month-by-month
      for (let m = 1; m <= 12; m++) {
        currentBalance += PMT;
        totalDeposited += PMT;
        // Monthly interest compounding approximation
        const interestThisMonth = currentBalance * (r / 12);
        currentBalance += interestThisMonth;
        yearInterest += interestThisMonth;
      }

      yearlyData.push({
        year: yr,
        deposits: totalDeposited,
        interestEarned: yearInterest,
        totalInterest: currentBalance - totalDeposited,
        balance: currentBalance,
      });
    }

    const finalBalance = currentBalance;
    const totalInterestEarned = finalBalance - totalDeposited;

    return {
      finalBalance,
      totalDeposited,
      totalInterestEarned,
      yearlyData,
    };
  }, [initialPrincipal, monthlyContribution, annualRate, years, compoundFrequency]);

  const handleExportCsv = () => {
    let csv = 'Year,Total Deposits,Annual Interest Earned,Total Interest to Date,Ending Balance\n';
    calculations.yearlyData.forEach((row) => {
      csv += `${row.year},${row.deposits.toFixed(2)},${row.interestEarned.toFixed(2)},${row.totalInterest.toFixed(2)},${row.balance.toFixed(2)}\n`;
    });
    downloadText(csv, 'compound-interest-schedule.csv', 'text/csv');
  };

  const depositPercent =
    calculations.finalBalance > 0
      ? (calculations.totalDeposited / calculations.finalBalance) * 100
      : 50;
  const interestPercent = 100 - depositPercent;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Column */}
        <div className="lg:col-span-7 space-y-5">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Initial Investment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor="init-principal">Initial Principal ($)</label>
                  <span className="font-mono text-sm text-blue-600 font-bold">
                    ${initialPrincipal.toLocaleString()}
                  </span>
                </div>
                <Input
                  id="init-principal"
                  type="number"
                  value={initialPrincipal || ''}
                  onChange={(e) => setInitialPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={0}
                  step={1000}
                />
                <Slider
                  min={0}
                  max={250000}
                  step={1000}
                  value={initialPrincipal}
                  onChange={(e) => setInitialPrincipal(Number(e.target.value))}
                />
              </div>

              {/* Monthly Contribution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor="monthly-dep">Monthly Contribution ($)</label>
                  <span className="font-mono text-sm text-blue-600 font-bold">
                    ${monthlyContribution.toLocaleString()}
                  </span>
                </div>
                <Input
                  id="monthly-dep"
                  type="number"
                  value={monthlyContribution || ''}
                  onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={0}
                  step={50}
                />
                <Slider
                  min={0}
                  max={10000}
                  step={50}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>

              {/* Annual Interest Rate & Years */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                    <label htmlFor="ann-rate">Estimated Return (%)</label>
                    <span className="font-mono text-xs text-blue-600 font-bold">{annualRate}%</span>
                  </div>
                  <Input
                    id="ann-rate"
                    type="number"
                    value={annualRate || ''}
                    onChange={(e) => setAnnualRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    min={0.1}
                    max={30}
                    step={0.5}
                  />
                  <Slider
                    min={1}
                    max={20}
                    step={0.5}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                    <label htmlFor="inv-years">Duration (Years)</label>
                    <span className="font-mono text-xs text-blue-600 font-bold">{years} yrs</span>
                  </div>
                  <Input
                    id="inv-years"
                    type="number"
                    value={years || ''}
                    onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={50}
                  />
                  <Slider
                    min={1}
                    max={40}
                    step={1}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Compounding frequency */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block">Compounding Frequency</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 1, label: 'Annually' },
                    { id: 4, label: 'Quarterly' },
                    { id: 12, label: 'Monthly' },
                    { id: 365, label: 'Daily' },
                  ].map((freq) => (
                    <Button
                      key={freq.id}
                      variant={compoundFrequency === freq.id ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCompoundFrequency(freq.id)}
                      className="text-xs"
                    >
                      {freq.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Value Highlight */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Future Portfolio Value
                </span>
                <div className="text-4xl sm:text-5xl font-black text-blue-900 mt-1">
                  ${calculations.finalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  After {years} years at {annualRate}% annual rate
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200/60">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Deposits</span>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    ${calculations.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Compound Interest</span>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">
                    +${calculations.totalInterestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Visual Contribution vs Growth Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Deposits: {depositPercent.toFixed(1)}%</span>
                  <span className="text-emerald-700 font-semibold">Interest: {interestPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: `${depositPercent}%` }} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${interestPercent}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Year by Year Growth Schedule */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Table className="h-4 w-4 text-blue-600" />
              Annual Balance Accumulation Schedule
            </h3>

            <Button variant="outline" size="sm" onClick={handleExportCsv} className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export CSV
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">Year</th>
                  <th className="p-3">Total Deposited</th>
                  <th className="p-3">Interest This Year</th>
                  <th className="p-3">Total Interest</th>
                  <th className="p-3 text-right">Ending Portfolio Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {calculations.yearlyData.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50">
                    <td className="p-3 font-bold font-sans">Year {row.year}</td>
                    <td className="p-3">${row.deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-3 text-emerald-700 font-semibold">
                      +${row.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-emerald-800">
                      ${row.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
