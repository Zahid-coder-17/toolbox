'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { downloadText } from '@/lib/utils';
import { Download, Coins, PieChart, Table, Sparkles } from 'lucide-react';

interface AmortizationRow {
  month: number;
  year: number;
  beginningBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [tenureMonthsInput, setTenureMonthsInput] = useState<number>(180);
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  const totalMonths = tenureType === 'years' ? tenureYears * 12 : tenureMonthsInput;

  const calculations = useMemo(() => {
    const P = principal;
    const r = interestRate / 12 / 100;
    const n = totalMonths;

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalAmount: 0,
        schedule: [] as AmortizationRow[],
        yearlySchedule: [] as {
          year: number;
          principalPaid: number;
          interestPaid: number;
          endingBalance: number;
        }[],
      };
    }

    // EMI formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    // Build amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = P;

    for (let m = 1; m <= n; m++) {
      const interestForMonth = balance * r;
      const principalForMonth = emi - interestForMonth;
      const ending = Math.max(0, balance - principalForMonth);

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        beginningBalance: balance,
        emi,
        principalPaid: principalForMonth,
        interestPaid: interestForMonth,
        endingBalance: ending,
      });

      balance = ending;
    }

    // Yearly summary
    const yearlyMap: Record<number, { principalPaid: number; interestPaid: number; endingBalance: number }> = {};
    for (const row of schedule) {
      if (!yearlyMap[row.year]) {
        yearlyMap[row.year] = { principalPaid: 0, interestPaid: 0, endingBalance: 0 };
      }
      yearlyMap[row.year].principalPaid += row.principalPaid;
      yearlyMap[row.year].interestPaid += row.interestPaid;
      yearlyMap[row.year].endingBalance = row.endingBalance;
    }

    const yearlySchedule = Object.entries(yearlyMap).map(([year, data]) => ({
      year: parseInt(year, 10),
      principalPaid: data.principalPaid,
      interestPaid: data.interestPaid,
      endingBalance: data.endingBalance,
    }));

    return {
      monthlyEmi: emi,
      totalInterest,
      totalAmount,
      schedule,
      yearlySchedule,
    };
  }, [principal, interestRate, totalMonths]);

  const handleExportCsv = () => {
    if (calculations.schedule.length === 0) return;
    let csv = 'Month,Year,Beginning Balance,EMI,Principal Paid,Interest Paid,Ending Balance\n';
    calculations.schedule.forEach((row) => {
      csv += `${row.month},${row.year},${row.beginningBalance.toFixed(2)},${row.emi.toFixed(2)},${row.principalPaid.toFixed(2)},${row.interestPaid.toFixed(2)},${row.endingBalance.toFixed(2)}\n`;
    });
    downloadText(csv, 'loan-amortization-schedule.csv', 'text/csv');
  };

  const principalRatio = calculations.totalAmount > 0 ? (principal / calculations.totalAmount) * 100 : 50;
  const interestRatio = 100 - principalRatio;

  return (
    <div className="space-y-6">
      {/* Input Form & Visual Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-5">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Principal Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor="loan-amount">Loan Principal Amount ($)</label>
                  <span className="font-mono text-sm text-blue-600 font-bold">
                    ${principal.toLocaleString()}
                  </span>
                </div>
                <Input
                  id="loan-amount"
                  type="number"
                  value={principal || ''}
                  onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={1000}
                  step={5000}
                />
                <Slider
                  min={5000}
                  max={2000000}
                  step={5000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor="interest-rate">Annual Interest Rate (%)</label>
                  <span className="font-mono text-sm text-blue-600 font-bold">
                    {interestRate}%
                  </span>
                </div>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  min={0.1}
                  max={30}
                  step={0.1}
                />
                <Slider
                  min={1}
                  max={20}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>

              {/* Loan Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor={tenureType === 'years' ? 'loan-tenure' : 'loan-tenure-months'}>
                    Loan Tenure
                  </label>
                  <div className="flex gap-1">
                    <Button
                      variant={tenureType === 'years' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setTenureType('years')}
                      className="h-6 text-xs px-2"
                    >
                      Years
                    </Button>
                    <Button
                      variant={tenureType === 'months' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTenureType('months');
                        setTenureMonthsInput(tenureYears * 12);
                      }}
                      className="h-6 text-xs px-2"
                    >
                      Months
                    </Button>
                  </div>
                </div>

                {tenureType === 'years' ? (
                  <>
                    <Input
                      id="loan-tenure"
                      type="number"
                      value={tenureYears || ''}
                      onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={40}
                    />
                    <Slider
                      min={1}
                      max={35}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                    />
                  </>
                ) : (
                  <Input
                    id="loan-tenure-months"
                    type="number"
                    value={tenureMonthsInput || ''}
                    onChange={(e) => setTenureMonthsInput(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={480}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Result Highlights */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40">
            <CardContent className="p-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Monthly EMI Payment
                </span>
                <div className="text-4xl sm:text-5xl font-black text-blue-900 mt-1">
                  ${calculations.monthlyEmi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Per month for {totalMonths} installments
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200/60">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Interest</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    ${calculations.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Payment</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">
                    ${calculations.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Ratio breakdown meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Principal: {principalRatio.toFixed(1)}%</span>
                  <span>Interest: {interestRatio.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: `${principalRatio}%` }} />
                  <div className="bg-amber-500 h-full" style={{ width: `${interestRatio}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Amortization Table */}
      {calculations.schedule.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Amortization Repayment Schedule</h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Button
                    variant={scheduleView === 'yearly' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setScheduleView('yearly')}
                    className="h-8 text-xs"
                  >
                    Yearly Schedule
                  </Button>
                  <Button
                    variant={scheduleView === 'monthly' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setScheduleView('monthly')}
                    className="h-8 text-xs"
                  >
                    Monthly Schedule
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={handleExportCsv} className="h-8 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="p-3">{scheduleView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th className="p-3">Principal Paid</th>
                    <th className="p-3">Interest Paid</th>
                    <th className="p-3">Total Payment</th>
                    <th className="p-3 text-right">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  {scheduleView === 'yearly'
                    ? calculations.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50">
                          <td className="p-3 font-bold font-sans">Year {row.year}</td>
                          <td className="p-3 text-emerald-700">${row.principalPaid.toFixed(2)}</td>
                          <td className="p-3 text-amber-700">${row.interestPaid.toFixed(2)}</td>
                          <td className="p-3 font-semibold">
                            ${(row.principalPaid + row.interestPaid).toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-bold">${row.endingBalance.toFixed(2)}</td>
                        </tr>
                      ))
                    : calculations.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50">
                          <td className="p-3 font-bold font-sans">Month {row.month}</td>
                          <td className="p-3 text-emerald-700">${row.principalPaid.toFixed(2)}</td>
                          <td className="p-3 text-amber-700">${row.interestPaid.toFixed(2)}</td>
                          <td className="p-3 font-semibold">${row.emi.toFixed(2)}</td>
                          <td className="p-3 text-right font-bold">${row.endingBalance.toFixed(2)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
