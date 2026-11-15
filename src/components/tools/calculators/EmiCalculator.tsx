'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { downloadText } from '@/lib/utils';
import { Download, Table, HelpCircle } from 'lucide-react';

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
    const P = Math.max(0, principal);
    const annualRate = Math.max(0, interestRate);
    const n = Math.max(1, totalMonths);
    const r = annualRate / 12 / 100;

    if (P <= 0 || n <= 0) {
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

    // Zero interest rate calculation (0% financing)
    if (r === 0) {
      const emi = P / n;
      const schedule: AmortizationRow[] = [];
      let balance = P;

      for (let m = 1; m <= n; m++) {
        const principalForMonth = m === n ? balance : emi;
        const ending = Math.max(0, balance - principalForMonth);

        schedule.push({
          month: m,
          year: Math.ceil(m / 12),
          beginningBalance: balance,
          emi: principalForMonth,
          principalPaid: principalForMonth,
          interestPaid: 0,
          endingBalance: ending,
        });

        balance = ending;
      }

      const yearlyMap: Record<number, { principalPaid: number; interestPaid: number; endingBalance: number }> = {};
      for (const row of schedule) {
        if (!yearlyMap[row.year]) {
          yearlyMap[row.year] = { principalPaid: 0, interestPaid: 0, endingBalance: 0 };
        }
        yearlyMap[row.year].principalPaid += row.principalPaid;
        yearlyMap[row.year].interestPaid += 0;
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
        totalInterest: 0,
        totalAmount: P,
        schedule,
        yearlySchedule,
      };
    }

    // Standard reducing balance EMI formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    // Build monthly amortization schedule
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
  const interestRatio = Math.max(0, 100 - principalRatio);

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
                  min={0}
                  step={5000}
                  aria-label="Loan principal amount"
                />
                <Slider
                  min={1000}
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
                    {interestRate}% {interestRate === 0 ? '(0% Interest Financing)' : ''}
                  </span>
                </div>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  min={0}
                  max={30}
                  step={0.1}
                  aria-label="Annual interest rate"
                />
                <Slider
                  min={0}
                  max={25}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>

              {/* Loan Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-700">
                  <label htmlFor="loan-tenure">Loan Tenure</label>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={tenureType === 'years' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setTenureType('years')}
                    >
                      Years
                    </Button>
                    <Button
                      variant={tenureType === 'months' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setTenureType('months')}
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
                      onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      min={1}
                      max={40}
                      aria-label="Loan tenure in years"
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
                    onChange={(e) => setTenureMonthsInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min={1}
                    max={480}
                    aria-label="Loan tenure in months"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Result Summary */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/60 to-white shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Monthly EMI Payment
                </span>
                <div className="text-4xl sm:text-5xl font-black text-blue-700 mt-2">
                  ${calculations.monthlyEmi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  for {totalMonths} months ({Math.round(totalMonths / 12)} years)
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Principal Amount:</span>
                  <span className="font-bold text-slate-900">${principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Interest Payable:</span>
                  <span className="font-bold text-violet-700">
                    ${calculations.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900">Total Payment (Principal + Interest):</span>
                  <span className="font-extrabold text-blue-900">
                    ${calculations.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Progress Bar of Principal vs Interest */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-blue-700">Principal: {principalRatio.toFixed(1)}%</span>
                  <span className="text-violet-700">Interest: {interestRatio.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-violet-100 overflow-hidden flex">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${principalRatio}%` }}
                  />
                  <div
                    className="h-full bg-violet-500 transition-all duration-300"
                    style={{ width: `${interestRatio}%` }}
                  />
                </div>
              </div>

              {/* Worked Formula Note */}
              <div className="rounded-lg bg-blue-50/80 p-3 text-xs text-blue-900 border border-blue-100 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  {interestRate === 0
                    ? `0% Interest: $${principal.toLocaleString()} ÷ ${totalMonths} months = $${calculations.monthlyEmi.toFixed(2)}/mo`
                    : `Formula: E = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ - 1) where r = ${(interestRate / 12).toFixed(4)}%`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {calculations.schedule.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Amortization Schedule</h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={scheduleView === 'yearly' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setScheduleView('yearly')}
                >
                  Yearly Summary
                </Button>
                <Button
                  variant={scheduleView === 'monthly' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setScheduleView('monthly')}
                >
                  Monthly Details
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCsv}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{scheduleView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th className="py-2.5 px-3">Principal Paid</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {scheduleView === 'yearly'
                    ? calculations.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-bold text-slate-800">Year {row.year}</td>
                          <td className="py-2 px-3 text-emerald-700">
                            ${row.principalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-violet-700">
                            ${row.interestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-700">
                            ${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    : calculations.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-slate-700">Month {row.month}</td>
                          <td className="py-2 px-3 text-emerald-700">
                            ${row.principalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-violet-700">
                            ${row.interestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-700">
                            ${row.endingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
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
