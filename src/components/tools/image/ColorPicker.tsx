'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/utils';
import { Copy, Check, Pipette, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export function ColorPicker() {
  const [color, setColor] = useState('#2563eb');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper conversions
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = (h % 360 + 360) % 360;
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  };

  // WCAG Luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (lum1: number, lum2: number) => {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const formats = useMemo(() => {
    try {
      const rgb = hexToRgb(color);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      const lum = getLuminance(rgb.r, rgb.g, rgb.b);
      const contrastWhite = getContrastRatio(lum, 1.0);
      const contrastBlack = getContrastRatio(lum, 0.0);

      // Harmonies
      const complementary = hslToHex(hsl.h + 180, hsl.s, hsl.l);
      const analogous1 = hslToHex(hsl.h + 30, hsl.s, hsl.l);
      const analogous2 = hslToHex(hsl.h - 30, hsl.s, hsl.l);
      const triadic1 = hslToHex(hsl.h + 120, hsl.s, hsl.l);
      const triadic2 = hslToHex(hsl.h + 240, hsl.s, hsl.l);

      return {
        hex: color.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        contrastWhite: Number(contrastWhite.toFixed(2)),
        contrastBlack: Number(contrastBlack.toFixed(2)),
        harmonies: [
          { name: 'Complementary', color: complementary },
          { name: 'Analogous +30°', color: analogous1 },
          { name: 'Analogous -30°', color: analogous2 },
          { name: 'Triadic 1', color: triadic1 },
          { name: 'Triadic 2', color: triadic2 },
        ],
      };
    } catch {
      return null;
    }
  }, [color]);

  const handleCopy = async (val: string, key: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-expect-error - EyeDropper API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setColor(result.sRGBHex);
        }
      } catch {
        // User canceled eye dropper
      }
    }
  };

  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div className="space-y-6">
      {/* Visual Swatch and Input */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <div
                className="w-full h-48 rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: color }}
              >
                <span
                  className="font-mono font-bold text-lg px-3 py-1 rounded-lg backdrop-blur-md bg-white/40 shadow-xs"
                  style={{
                    color: formats && formats.contrastWhite > 4.5 ? '#ffffff' : '#000000',
                  }}
                >
                  {formats?.hex}
                </span>
              </div>

              <div className="w-full flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-12 w-16 rounded-lg cursor-pointer border border-slate-200 p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono text-base font-bold uppercase"
                />
                {hasEyeDropper && (
                  <Button variant="outline" size="md" onClick={handleEyeDropper} title="Pick from screen">
                    <Pipette className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Values & Formats */}
        <div className="md:col-span-7">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Color Format Representations
              </span>

              {formats &&
                [
                  { label: 'HEX', val: formats.hex },
                  { label: 'RGB', val: formats.rgb },
                  { label: 'HSL', val: formats.hsl },
                  { label: 'CMYK', val: formats.cmyk },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-500 mr-3">{item.label}</span>
                      <span className="font-mono text-xs font-bold text-slate-800">{item.val}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.val, item.label)}
                      className="h-7 text-xs"
                    >
                      {copiedKey === item.label ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* WCAG Contrast Ratio Checker */}
      {formats && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              WCAG 2.1 Accessibility Contrast Ratios
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* White background */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Against White (#FFFFFF)</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {formats.contrastWhite} : 1
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span
                    className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                      formats.contrastWhite >= 4.5
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {formats.contrastWhite >= 4.5 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    AA Normal ({formats.contrastWhite >= 4.5 ? 'Pass' : 'Fail'})
                  </span>
                  <span
                    className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                      formats.contrastWhite >= 7.0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    AAA ({formats.contrastWhite >= 7.0 ? 'Pass' : 'Fail'})
                  </span>
                </div>
              </div>

              {/* Black background */}
              <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Against Black (#000000)</span>
                  <span className="font-mono font-bold text-base text-white">
                    {formats.contrastBlack} : 1
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span
                    className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                      formats.contrastBlack >= 4.5
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-red-950 text-red-400'
                    }`}
                  >
                    {formats.contrastBlack >= 4.5 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    AA Normal ({formats.contrastBlack >= 4.5 ? 'Pass' : 'Fail'})
                  </span>
                  <span
                    className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                      formats.contrastBlack >= 7.0
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    AAA ({formats.contrastBlack >= 7.0 ? 'Pass' : 'Fail'})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Color Harmonies */}
      {formats && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Harmonious Color Palettes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {formats.harmonies.map((h) => (
                <div
                  key={h.name}
                  onClick={() => setColor(h.color)}
                  className="group flex flex-col items-center rounded-xl border border-slate-200 p-2 text-center cursor-pointer hover:border-blue-400 transition-all"
                >
                  <div
                    className="w-full h-16 rounded-lg mb-2 shadow-2xs group-hover:scale-102 transition-transform"
                    style={{ backgroundColor: h.color }}
                  />
                  <span className="text-[11px] font-semibold text-slate-800">{h.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{h.color}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
