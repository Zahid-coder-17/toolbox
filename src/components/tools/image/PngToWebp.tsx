'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowRight, AlertCircle } from 'lucide-react';

export function PngToWebp() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [quality, setQuality] = useState<number>(85);
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);
  const [webpUrl, setWebpUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (webpUrl) URL.revokeObjectURL(webpUrl);
    };
  }, [sourceUrl, webpUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setError(null);

    if (file.size > 50 * 1024 * 1024) {
      setError('Selected PNG exceeds 50 MB limit.');
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (webpUrl) URL.revokeObjectURL(webpUrl);

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    convertToWebp(url, quality);
  };

  const convertToWebp = (imgUrl: string, q: number) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Full transparency preservation for WebP
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setWebpBlob(blob);
              if (webpUrl) URL.revokeObjectURL(webpUrl);
              setWebpUrl(URL.createObjectURL(blob));
            } else {
              setError('Failed to convert image to WebP.');
            }
            setIsProcessing(false);
          },
          'image/webp',
          q / 100
        );
      } catch (err) {
        setError('Conversion error: ' + (err instanceof Error ? err.message : 'Unknown'));
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setError('Failed to decode PNG. The file may be corrupt or not a valid PNG.');
      setIsProcessing(false);
    };
    img.src = imgUrl;
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (sourceUrl) {
      convertToWebp(sourceUrl, q);
    }
  };

  const handleDownload = () => {
    if (!webpBlob || !sourceFile) return;
    const outName = sourceFile.name.replace(/\.png$/i, '') + '.webp';
    downloadBlob(webpBlob, outName);
  };

  const handleReset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (webpUrl) URL.revokeObjectURL(webpUrl);
    setSourceFile(null);
    setSourceUrl('');
    setWebpBlob(null);
    setWebpUrl('');
    setError(null);
  };

  // Measured savings
  const sizeDiff = sourceFile && webpBlob ? sourceFile.size - webpBlob.size : 0;
  const percentChange =
    sourceFile && webpBlob && sourceFile.size > 0
      ? Math.round((Math.abs(sizeDiff) / sourceFile.size) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/png"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop PNG image"
              description="Converts to modern WebP format with full alpha transparency and smaller file sizes"
            />
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">PNG Original</span>
                    <div className="text-sm font-bold text-slate-800">
                      {formatBytes(sourceFile.size)}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">WebP Output</span>
                    <div className="text-sm font-bold text-blue-600">
                      {webpBlob ? formatBytes(webpBlob.size) : 'Converting...'}
                    </div>
                  </div>

                  {webpBlob && sizeDiff > 0 && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      -{percentChange}% Smaller (Saved {formatBytes(sizeDiff)})
                    </span>
                  )}
                  {webpBlob && sizeDiff < 0 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      +{percentChange}% Larger
                    </span>
                  )}
                  {webpBlob && sizeDiff === 0 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      Identical Size
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!webpBlob || isProcessing}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download WebP
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              <Slider
                label="WebP Compression Quality"
                valueDisplay={`${quality}%`}
                min={10}
                max={100}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
              />
            </CardContent>
          </Card>

          {/* Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>PNG Original</span>
                  <span>{formatBytes(sourceFile.size)}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px] overflow-hidden">
                  {sourceUrl && (
                    <img
                      src={sourceUrl}
                      alt="PNG Original"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>WebP Output (Alpha Preserved)</span>
                  <span>{webpBlob ? formatBytes(webpBlob.size) : '...'}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px] overflow-hidden">
                  {webpUrl ? (
                    <img
                      src={webpUrl}
                      alt="WebP Output"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      {isProcessing ? 'Converting to WebP...' : 'Ready'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
