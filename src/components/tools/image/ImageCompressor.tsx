'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { formatBytes, downloadBlob } from '@/lib/utils';
import { Download, RefreshCw, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function ImageCompressor() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);

    // Determine initial format
    if (file.type === 'image/png') setOutputFormat('image/png');
    else if (file.type === 'image/webp') setOutputFormat('image/webp');
    else setOutputFormat('image/jpeg');

    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    img.onload = () => {
      setSourceDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const compressImage = () => {
    if (!sourceUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setIsProcessing(true);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Export with quality
      const q = quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : q
      );
    };
    img.src = sourceUrl;
  };

  useEffect(() => {
    if (sourceUrl) {
      compressImage();
    }
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
  };

  const percentSaved =
    sourceFile && compressedBlob
      ? Math.max(0, Math.round(((sourceFile.size - compressedBlob.size) / sourceFile.size) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={25 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop an image to compress"
              description="Supports JPG, PNG, and WebP up to 25 MB"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Controls & Metrics Header */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Original</span>
                    <div className="text-sm font-bold text-slate-800">
                      {formatBytes(sourceFile.size)}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500">Compressed</span>
                    <div className="text-sm font-bold text-blue-600">
                      {compressedBlob ? formatBytes(compressedBlob.size) : 'Calculating...'}
                    </div>
                  </div>

                  {percentSaved > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      -{percentSaved}% Smaller
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
                  onChange={(e) => setQuality(Number(e.target.value))}
                />

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Output Format</span>
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
                  <span>Original ({sourceDimensions.width}x{sourceDimensions.height})</span>
                  <span>{formatBytes(sourceFile.size)}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px]">
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
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[300px]">
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed Preview"
                      className="max-h-[300px] max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Rendering compressed preview...</span>
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
