'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Cake, Compass, Sparkles } from 'lucide-react';

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

  const stats = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null;
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

    // Next birthday
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac
    const zodiac = getZodiacSign(birth.getDate(), birth.getMonth() + 1);

    return {
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
    };
  }, [birthDate, targetDate]);

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
                  {stats.daysToNextBday} <span className="text-base font-normal">days left</span>
                </div>
              </div>
              <p className="text-xs text-violet-600 mt-2">
                Get ready to celebrate your next chapter!
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-blue-600" />
                  Day Born & Zodiac
                </span>
                <div className="text-xl font-bold text-slate-900 mt-2">
                  Born on a {stats.birthDayOfWeek}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-2">
                Astrological Sign: <span className="text-blue-600">{stats.zodiac}</span>
              </div>
            </div>
          </div>

          {/* Granular Total Statistics Grid */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Total Time Elapsed Since Birth
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xl font-extrabold text-slate-900">{stats.totalMonths.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Months</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xl font-extrabold text-slate-900">{stats.totalWeeks.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Weeks</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xl font-extrabold text-slate-900">{stats.totalDays.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Days</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xl font-extrabold text-slate-900">{stats.totalHours.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Hours</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 col-span-2 sm:col-span-1">
                  <div className="text-xl font-extrabold text-slate-900">{stats.totalMinutes.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
