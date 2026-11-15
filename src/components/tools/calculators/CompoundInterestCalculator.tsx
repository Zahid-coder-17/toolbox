'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { downloadText } from '@/lib/utils';
import { Download, Table, HelpCircle } from 'lucide-react';

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
    const P0 = Math.max(0, initialPrincipal);
    const PMT = Math.max(0, monthlyContribution);
    const r = Math.max(0, annualRate) / 100;
    const n = Math.max(1, compoundFrequency);
    const t = Math.max(1, years);

    const yearlyData: YearlyGrowth[] = [];
    let currentBalance = P0;
    let totalDeposited = P0;

    for (let yr = 1; yr <= t; yr++) {
      let yearInterest = 0;

      if (r === 0) {
        // Zero interest: balance is simply deposits
        const yearDeposits = PMT * 12;
        currentBalance += yearDeposits;
        totalDeposited += yearDeposits;
      } else {
        // Simulate compounding across the 12 months with periodic compounding
        for (let m = 1; m <= 12; m++) {
          currentBalance += PMT;
          totalDeposited += PMT;
          const monthlyInterest = currentBalance * (r / n) * (n / 12);
          currentBalance += monthlyInterest;
          yearInterest += monthlyInterest;
        }
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
    const totalInterestEarned = Math.max(0, finalBalance - totalDeposited);

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
      : 100;
  const interestPercent = Math.max(0, 100 - depositPercent);

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
                  aria-label="Initial principal amount"
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
                  aria-label="Monthly contribution"
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
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                    <label htmlFor="comp-rate">Interest Rate (%)</label>
                    <span className="font-mono text-sm text-blue-600 font-bold">{annualRate}%</span>
                  </div>
                  <Input
                    id="comp-rate"
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    min={0}
                    max={30}
                    step={0.1}
                    aria-label="Annual interest rate percentage"
                  />
                  <Slider
                    min={0}
                    max={20}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                    <label htmlFor="comp-years">Investment Period</label>
                    <span className="font-mono text-sm text-blue-600 font-bold">{years} Years</span>
                  </div>
                  <Input
                    id="comp-years"
                    type="number"
                    value={years || ''}
                    onChange={(e) => setYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min={1}
                    max={50}
                    aria-label="Investment period in years"
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

              {/* Compounding Frequency */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold uppercase text-slate-700 block">
                  Compounding Frequency
                </label>
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
                    >
                      {freq.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Projection Summary */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/60 to-white shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Projected Future Balance
                </span>
                <div className="text-4xl sm:text-5xl font-black text-blue-700 mt-2">
                  ${calculations.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">after {years} years of compounding</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Deposits:</span>
                  <span className="font-bold text-slate-900">
                    ${calculations.totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Compound Interest:</span>
                  <span className="font-bold text-emerald-700">
                    ${calculations.totalInterestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Progress Ratio Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-blue-700">Deposits: {depositPercent.toFixed(1)}%</span>
                  <span className="text-emerald-700">Interest: {interestPercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-emerald-100 overflow-hidden flex">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${depositPercent}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${interestPercent}%` }}
                  />
                </div>
              </div>

              {/* Worked Formula Note */}
              <div className="rounded-lg bg-blue-50/80 p-3 text-xs text-blue-900 border border-blue-100 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  {annualRate === 0
                    ? `0% Interest: Initial ($${initialPrincipal.toLocaleString()}) + (${years} yrs × $${(monthlyContribution * 12).toLocaleString()}) = $${calculations.finalBalance.toLocaleString()}`
                    : `Formula: A = P(1 + r/n)ⁿᵗ + PMT × (((1 + r/n)ⁿᵗ - 1) ÷ (r/n))`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Yearly Growth Table */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Table className="h-4 w-4 text-blue-600" />
              Annual Accumulation Breakdown
            </h3>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="h-3.5 w-3.5 mr-1" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Total Invested</th>
                  <th className="py-2.5 px-3">Annual Interest</th>
                  <th className="py-2.5 px-3">Total Interest</th>
                  <th className="py-2.5 px-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {calculations.yearlyData.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-800">Year {row.year}</td>
                    <td className="py-2 px-3 text-slate-700">
                      ${row.deposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 text-emerald-600">
                      ${row.interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 text-emerald-700 font-semibold">
                      ${row.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 font-bold text-blue-900">
                      ${row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
