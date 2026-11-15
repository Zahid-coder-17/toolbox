'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock, Cake, Compass, AlertCircle, HelpCircle } from 'lucide-react';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const getZodiacSign = (day: number, month: number): string => {
    // month is 1-based
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
    const signs = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    return day < dates[month - 1] ? signs[month - 1] : signs[month % 12];
  };

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const calculation = useMemo(() => {
    if (!birthDate || !targetDate) {
      return { error: 'Please enter both dates.', stats: null };
    }

    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T00:00:00');

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      return { error: 'Invalid date format. Please check your date entries.', stats: null };
    }

    if (target < birth) {
      return { error: 'Date of birth cannot be later than the target date.', stats: null };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Exact totals
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalMonths = years * 12 + months;

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayOfWeek = daysOfWeek[birth.getDay()];

    // Leap year birth awareness
    const isLeapBirth = birth.getMonth() === 1 && birth.getDate() === 29;

    // Next birthday calculation
    let nextBdayYear = target.getFullYear();
    let nextBdayDate = birth.getDate();
    let nextBdayMonth = birth.getMonth();

    if (isLeapBirth && !isLeapYear(nextBdayYear)) {
      // In non-leap year, celebration falls on March 1st
      nextBdayMonth = 2;
      nextBdayDate = 1;
    }

    let nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDate);
    if (nextBday < target) {
      nextBdayYear += 1;
      nextBdayMonth = birth.getMonth();
      nextBdayDate = birth.getDate();
      if (isLeapBirth && !isLeapYear(nextBdayYear)) {
        nextBdayMonth = 2;
        nextBdayDate = 1;
      }
      nextBday = new Date(nextBdayYear, nextBdayMonth, nextBdayDate);
    }

    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac
    const zodiac = getZodiacSign(birth.getDate(), birth.getMonth() + 1);

    return {
      error: null,
      stats: {
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        birthDayOfWeek,
        daysToNextBday,
        zodiac,
        isLeapBirth,
      },
    };
  }, [birthDate, targetDate]);

  const { error, stats } = calculation;

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birth-date" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Date of Birth
              </label>
              <Input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="target-date" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Age as of Date
              </label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Age Highlight */}
      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Primary Age
              </span>
              <div className="text-4xl sm:text-5xl font-black mt-2">
                {stats.years} <span className="text-2xl font-medium">years</span>
              </div>
              <div className="text-sm font-medium text-blue-100 mt-2">
                {stats.months} months, {stats.days} days
              </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                  <Cake className="h-4 w-4" />
                  Next Birthday Countdown
                </span>
                <div className="text-3xl font-extrabold text-violet-900 mt-2">
                  {stats.daysToNextBday === 0 ? 'Today! 🎉' : `${stats.daysToNextBday} days`}
                </div>
              </div>
              <p className="text-xs text-violet-600 mt-3">
                {stats.isLeapBirth
                  ? 'Born on Leap Day (Feb 29). Celebrated on March 1st in common years.'
                  : `Next birthday arrives in ~${Math.round(stats.daysToNextBday / 30.4)} months.`}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-blue-600" />
                  Day & Zodiac Sign
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats.zodiac}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Born on a <strong className="text-slate-800">{stats.birthDayOfWeek}</strong>
              </p>
            </div>
          </div>

          {/* Detailed Age Breakdown Grid */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Comprehensive Life Milestones
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    {stats.totalMonths.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-1">
                    Total Months
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    {stats.totalWeeks.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-1">
                    Total Weeks
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    {stats.totalDays.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-1">
                    Total Days
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    {stats.totalHours.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-1">
                    Total Hours
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worked Example Card */}
          <Card className="border-blue-100 bg-blue-50/40">
            <CardContent className="p-4 sm:p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                <HelpCircle className="h-4 w-4" /> Worked Calculation Example
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For a person born on <strong>{birthDate}</strong> evaluated on <strong>{targetDate}</strong>:
                The calendar calculates elapsed full years ({stats.years}), then advances to the current month to compute remaining full months ({stats.months}), and finally tallies the leftover calendar days ({stats.days}), accounting for varying month lengths (28, 30, or 31 days) and leap years.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
