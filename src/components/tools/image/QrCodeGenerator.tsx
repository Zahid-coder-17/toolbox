'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { copyToClipboard, downloadBlob, downloadText } from '@/lib/utils';
import { Download, Copy, Check, QrCode as QrIcon, Sparkles } from 'lucide-react';

export function QrCodeGenerator() {
  const [content, setContent] = useState('https://toolbox.dev');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);

  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    if (!content.trim()) {
      Promise.resolve().then(() => {
        if (active) {
          setDataUrl('');
          setSvgString('');
        }
      });
      return () => {
        active = false;
      };
    }

    // Generate PNG data URL
    QRCode.toDataURL(content, {
      errorCorrectionLevel: ecLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      width: size,
      margin: 2,
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch((err) => console.error(err));

    // Generate SVG string
    QRCode.toString(content, {
      type: 'svg',
      errorCorrectionLevel: ecLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      width: size,
      margin: 2,
    })
      .then((svg) => {
        if (active) setSvgString(svg);
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, [content, ecLevel, fgColor, bgColor, size]);

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
      // Fallback: copy content
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
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
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
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Error correction level */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Error Correction Margin
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'L', label: 'Low (7%)' },
                  { id: 'M', label: 'Medium (15%)' },
                  { id: 'Q', label: 'Quartile (25%)' },
                  { id: 'H', label: 'High (30%)' },
                ].map((lvl) => (
                  <Button
                    key={lvl.id}
                    variant={ecLevel === lvl.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setEcLevel(lvl.id as 'L' | 'M' | 'Q' | 'H')}
                    className="text-xs px-1"
                  >
                    {lvl.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Slider */}
            <Slider
              label="Render Resolution"
              valueDisplay={`${size} × ${size} px`}
              min={150}
              max={800}
              step={50}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 self-start">
              Live QR Preview
            </div>

            <div
              className="p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center transition-all duration-200"
              style={{ backgroundColor: bgColor }}
            >
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="rounded"
                  style={{ width: Math.min(260, size), height: Math.min(260, size) }}
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-300">
                  <QrIcon className="h-16 w-16" />
                </div>
              )}
            </div>

            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadPng}
                  disabled={!dataUrl}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleDownloadSvg}
                  disabled={!svgString}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download SVG
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPng}
                disabled={!dataUrl}
                className="w-full text-slate-600"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Image to Clipboard'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
