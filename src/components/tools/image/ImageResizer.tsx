'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Lock, Unlock, Maximize2 } from 'lucide-react';

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

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
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
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    const scale = pct / 100;
    setTargetWidth(Math.round(originalWidth * scale));
    setTargetHeight(Math.round(originalHeight * scale));
  };

  const processResize = () => {
    if (!sourceUrl || targetWidth <= 0 || targetHeight <= 0) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResizedBlob(blob);
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            setResizedUrl(URL.createObjectURL(blob));
          }
        },
        format,
        0.92
      );
    };
    img.src = sourceUrl;
  };

  useEffect(() => {
    if (sourceUrl && targetWidth > 0 && targetHeight > 0) {
      processResize();
    }
  }, [sourceUrl, targetWidth, targetHeight, format]);

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
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/*"
              maxSizeBytes={25 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop an image to resize"
              description="Resize by exact pixels or percentage scale"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Original Size</span>
                  <div className="text-sm font-bold text-slate-800">
                    {originalWidth} × {originalHeight} px ({formatBytes(sourceFile.size)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!resizedBlob}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Resized Image
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Resize Mode Selector */}
              <div className="flex gap-2">
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

              {resizeMode === 'dimensions' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Width (px)
                    </label>
                    <Input
                      type="number"
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                      min={1}
                      max={10000}
                    />
                  </div>

                  <div className="flex items-center justify-center pb-2">
                    <Button
                      type="button"
                      variant={lockAspect ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setLockAspect(!lockAspect)}
                      title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                    >
                      {lockAspect ? <Lock className="h-3.5 w-3.5 mr-1" /> : <Unlock className="h-3.5 w-3.5 mr-1" />}
                      {lockAspect ? 'Locked' : 'Unlocked'}
                    </Button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Height (px)
                    </label>
                    <Input
                      type="number"
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                      min={1}
                      max={10000}
                    />
                  </div>
                </div>
              ) : (
                <Slider
                  label="Scale Percentage"
                  valueDisplay={`${percentage}% (${targetWidth}x${targetHeight}px)`}
                  min={10}
                  max={200}
                  value={percentage}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                />
              )}

              {/* Format selection */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-700">Export Format:</span>
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
            </CardContent>
          </Card>

          {/* Resized Result Preview */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                <span>Resized Preview ({targetWidth} × {targetHeight} px)</span>
                <span>{resizedBlob ? formatBytes(resizedBlob.size) : ''}</span>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-4 min-h-[300px]">
                {resizedUrl && (
                  <img
                    src={resizedUrl}
                    alt="Resized Preview"
                    className="max-h-[320px] max-w-full rounded object-contain shadow-xs"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
