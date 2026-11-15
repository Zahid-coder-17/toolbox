'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Lock, Unlock, AlertCircle, ArrowRight } from 'lucide-react';

export function ImageResizer() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [percentage, setPercentage] = useState(100);
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage'>('dimensions');
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState(90);

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [sourceUrl, resizedUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setError(null);

    if (file.size > 50 * 1024 * 1024) {
      setError('Selected image exceeds 50 MB limit. Please select a smaller file.');
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setPercentage(100);
    };
    img.onerror = () => {
      setError('Failed to load image. File may be corrupt or an unsupported format.');
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    const clamped = Math.max(1, Math.min(10000, val || 1));
    setTargetWidth(clamped);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.max(1, Math.min(10000, Math.round(clamped * ratio))));
    }
  };

  const handleHeightChange = (val: number) => {
    const clamped = Math.max(1, Math.min(10000, val || 1));
    setTargetHeight(clamped);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.max(1, Math.min(10000, Math.round(clamped * ratio))));
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    const scale = pct / 100;
    setTargetWidth(Math.max(1, Math.min(10000, Math.round(originalWidth * scale))));
    setTargetHeight(Math.max(1, Math.min(10000, Math.round(originalHeight * scale))));
  };

  const processResize = () => {
    if (!sourceUrl || targetWidth <= 0 || targetHeight <= 0) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setIsProcessing(true);
      setError(null);

      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Transparency preservation: fill with white only if JPEG
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        } else {
          ctx.clearRect(0, 0, targetWidth, targetHeight);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResizedBlob(blob);
              if (resizedUrl) URL.revokeObjectURL(resizedUrl);
              setResizedUrl(URL.createObjectURL(blob));
            } else {
              setError('Failed to resize image.');
            }
            setIsProcessing(false);
          },
          format,
          format === 'image/png' ? undefined : quality / 100
        );
      } catch (err) {
        setError('Canvas resize failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setError('Failed to decode image for resizing.');
      setIsProcessing(false);
    };
    img.src = sourceUrl;
  };

  useEffect(() => {
    if (sourceUrl && targetWidth > 0 && targetHeight > 0) {
      processResize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl, targetWidth, targetHeight, format, quality]);

  const handleDownload = () => {
    if (!resizedBlob || !sourceFile) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName = sourceFile.name.replace(/\.[^/.]+$/, '');
    downloadBlob(resizedBlob, `${baseName}-${targetWidth}x${targetHeight}.${ext}`);
  };

  const handleReset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setSourceFile(null);
    setSourceUrl('');
    setResizedBlob(null);
    setResizedUrl('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/*"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop an image to resize"
              description="Resize by exact pixels or percentage scale with aspect ratio lock"
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
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Original</span>
                    <div className="text-sm font-bold text-slate-800">
                      {originalWidth}×{originalHeight} px ({formatBytes(sourceFile.size)})
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Resized</span>
                    <div className="text-sm font-bold text-blue-600">
                      {targetWidth}×{targetHeight} px {resizedBlob ? `(${formatBytes(resizedBlob.size)})` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!resizedBlob || isProcessing}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Resized
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="flex items-center gap-2">
                <Button
                  variant={resizeMode === 'dimensions' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setResizeMode('dimensions')}
                >
                  By Dimensions (px)
                </Button>
                <Button
                  variant={resizeMode === 'percentage' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setResizeMode('percentage')}
                >
                  By Percentage (%)
                </Button>
              </div>

              {/* Dimension Controls */}
              {resizeMode === 'dimensions' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Width (px)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Height (px)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
                    />
                  </div>

                  <div className="pb-1">
                    <Button
                      variant={lockAspect ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setLockAspect(!lockAspect)}
                      className="w-full"
                    >
                      {lockAspect ? <Lock className="h-3.5 w-3.5 mr-1" /> : <Unlock className="h-3.5 w-3.5 mr-1" />}
                      {lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Slider
                  label="Scale Percentage"
                  valueDisplay={`${percentage}%`}
                  min={10}
                  max={500}
                  value={percentage}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                />
              )}

              {/* Format & Quality Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Output Format
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <Button
                        key={fmt.id}
                        variant={format === fmt.id ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setFormat(fmt.id as 'image/png' | 'image/jpeg' | 'image/webp')}
                      >
                        {fmt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {format !== 'image/png' && (
                  <Slider
                    label="Quality"
                    valueDisplay={`${quality}%`}
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Original ({originalWidth}×{originalHeight})</span>
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
                  <span>Resized ({targetWidth}×{targetHeight})</span>
                  <span>{resizedBlob ? formatBytes(resizedBlob.size) : '...'}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px] overflow-hidden">
                  {resizedUrl ? (
                    <img
                      src={resizedUrl}
                      alt="Resized Preview"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      {isProcessing ? 'Rendering resized image...' : 'Ready'}
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
