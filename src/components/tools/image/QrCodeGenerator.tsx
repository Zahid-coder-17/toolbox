'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { copyToClipboard, downloadText } from '@/lib/utils';
import { Download, Copy, Check, QrCode as QrIcon, Sparkles, AlertCircle } from 'lucide-react';

export function QrCodeGenerator() {
  const [content, setContent] = useState('https://toolbox.dev');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);

  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const trimmed = content.trim();

    if (!trimmed) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          setDataUrl('');
          setSvgString('');
          setError(null);
        }
      });
      return;
    }

    if (trimmed.length > 2500) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          setError('Content exceeds maximum QR payload capacity (2,500 characters). Please shorten your input.');
          setDataUrl('');
          setSvgString('');
        }
      });
      return;
    }

    // Generate PNG and SVG
    Promise.all([
      QRCode.toDataURL(trimmed, {
        errorCorrectionLevel: ecLevel,
        color: { dark: fgColor, light: bgColor },
        width: size,
        margin,
      }),
      QRCode.toString(trimmed, {
        type: 'svg',
        errorCorrectionLevel: ecLevel,
        color: { dark: fgColor, light: bgColor },
        width: size,
        margin,
      }),
    ])
      .then(([pngUrl, svg]) => {
        if (!isCancelled) {
          setDataUrl(pngUrl);
          setSvgString(svg);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to generate QR Code');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [content, ecLevel, fgColor, bgColor, size, margin]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    downloadText(svgString, 'qrcode.svg', 'image/svg+xml');
  };

  const handleCopyPng = async () => {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy textual content
      copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Configuration Column */}
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              QR Code Content (URL or Text)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Enter website link, text, WiFi credentials, or contact details..."
              className="w-full p-3 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              aria-label="QR Code content text"
            />
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Color Customization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    aria-label="Foreground color picker"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    aria-label="Foreground hex code"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    aria-label="Background color picker"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    aria-label="Background hex code"
                  />
                </div>
              </div>
            </div>

            {/* Error Correction Selection */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'L', label: 'Low (7%)' },
                  { id: 'M', label: 'Medium (15%)' },
                  { id: 'Q', label: 'Quartile (25%)' },
                  { id: 'H', label: 'High (30%)' },
                ].map((level) => (
                  <Button
                    key={level.id}
                    variant={ecLevel === level.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setEcLevel(level.id as 'L' | 'M' | 'Q' | 'H')}
                    className="text-xs"
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sliders: Size & Margin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Slider
                label="Resolution Size"
                valueDisplay={`${size}px`}
                min={128}
                max={600}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />

              <Slider
                label="Quiet Zone (Margin)"
                valueDisplay={`${margin} modules`}
                min={0}
                max={10}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 self-start">
              Live Preview
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-center transition-all"
              style={{ backgroundColor: bgColor }}
            >
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="rounded object-contain"
                  style={{ width: `${Math.min(size, 260)}px`, height: `${Math.min(size, 260)}px` }}
                />
              ) : (
                <div className="h-52 w-52 flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-xl">
                  <QrIcon className="h-10 w-10 text-slate-300" />
                  <span className="text-xs">Enter content to generate</span>
                </div>
              )}
            </div>

            {/* Download Buttons */}
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  onClick={handleDownloadPng}
                  disabled={!dataUrl}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadSvg}
                  disabled={!svgString}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download SVG
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={handleCopyPng}
                disabled={!dataUrl}
                className="w-full"
              >
                {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
