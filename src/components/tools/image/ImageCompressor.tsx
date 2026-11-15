'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { formatBytes, downloadBlob } from '@/lib/utils';
import { Download, RefreshCw, Trash2, ArrowRight, AlertCircle, Info } from 'lucide-react';

export function ImageCompressor() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [sourceUrl, compressedUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setError(null);

    // Validate size (max 50 MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Selected image exceeds the 50 MB limit. Please select a smaller file.');
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    setSourceFile(file);

    // Set matching default format
    if (file.type === 'image/png') setOutputFormat('image/png');
    else if (file.type === 'image/webp') setOutputFormat('image/webp');
    else setOutputFormat('image/jpeg');

    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    img.onload = () => {
      setSourceDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setError('Failed to load image. The file may be corrupt or an unsupported format.');
    };
    img.src = url;
  };

  const compressImage = () => {
    if (!sourceUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setIsProcessing(true);
      setError(null);

      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Transparency preservation: fill with white only if converting to JPEG (JPEG lacks alpha channel)
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const q = quality / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              setCompressedUrl(URL.createObjectURL(blob));
            } else {
              setError('Failed to compress image.');
            }
            setIsProcessing(false);
          },
          outputFormat,
          outputFormat === 'image/png' ? undefined : q
        );
      } catch (err) {
        setError('Error during canvas compression: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setError('Failed to decode source image for compression.');
      setIsProcessing(false);
    };
    img.src = sourceUrl;
  };

  useEffect(() => {
    if (sourceUrl) {
      compressImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl, quality, outputFormat]);

  const handleDownload = () => {
    if (!compressedBlob || !sourceFile) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    downloadBlob(compressedBlob, `${baseName}-compressed.${ext}`);
  };

  const handleReset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setSourceFile(null);
    setSourceUrl('');
    setCompressedBlob(null);
    setCompressedUrl('');
    setError(null);
  };

  // Measured savings
  const sizeDiff = sourceFile && compressedBlob ? sourceFile.size - compressedBlob.size : 0;
  const percentChange =
    sourceFile && compressedBlob && sourceFile.size > 0
      ? Math.round((Math.abs(sizeDiff) / sourceFile.size) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop an image to compress"
              description="Supports JPG, PNG, and WebP up to 50 MB with 100% client-side privacy"
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

          {/* Controls & Metrics Header */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Original</span>
                    <div className="text-sm font-bold text-slate-800">
                      {formatBytes(sourceFile.size)}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Processed</span>
                    <div className="text-sm font-bold text-blue-600">
                      {compressedBlob ? formatBytes(compressedBlob.size) : 'Calculating...'}
                    </div>
                  </div>

                  {/* Strictly measured comparison badge */}
                  {compressedBlob && sizeDiff > 0 && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      -{percentChange}% Smaller (Saved {formatBytes(sizeDiff)})
                    </span>
                  )}
                  {compressedBlob && sizeDiff < 0 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800" title="Output is larger than input (try lowering quality or using WebP)">
                      +{percentChange}% Larger
                    </span>
                  )}
                  {compressedBlob && sizeDiff === 0 && (
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
                    disabled={!compressedBlob || isProcessing}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Compression Sliders & Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <Slider
                  label="Quality Setting"
                  valueDisplay={`${quality}%`}
                  min={1}
                  max={100}
                  value={quality}
                  disabled={outputFormat === 'image/png'}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Output Format</span>
                    {outputFormat === 'image/png' && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Info className="h-3 w-3" /> Lossless alpha preserved
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/webp', label: 'WebP' },
                      { id: 'image/png', label: 'PNG' },
                    ].map((fmt) => (
                      <Button
                        key={fmt.id}
                        variant={outputFormat === fmt.id ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setOutputFormat(fmt.id as 'image/jpeg' | 'image/webp' | 'image/png')}
                      >
                        {fmt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Original ({sourceDimensions.width}×{sourceDimensions.height})</span>
                  <span>{formatBytes(sourceFile.size)}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px] overflow-hidden">
                  {sourceUrl && (
                    <img
                      src={sourceUrl}
                      alt="Original Preview"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Compressed Preview</span>
                  <span>{compressedBlob ? formatBytes(compressedBlob.size) : '...'}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px] overflow-hidden">
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      {isProcessing ? 'Compressing image...' : 'Ready to compress'}
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
