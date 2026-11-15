'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export function PngToWebp() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [quality, setQuality] = useState<number>(85);
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);
  const [webpUrl, setWebpUrl] = useState<string>('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    convertToWebp(url, quality);
  };

  const convertToWebp = (imgUrl: string, q: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setWebpBlob(blob);
            if (webpUrl) URL.revokeObjectURL(webpUrl);
            setWebpUrl(URL.createObjectURL(blob));
          }
        },
        'image/webp',
        q / 100
      );
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
  };

  const percentReduction =
    sourceFile && webpBlob
      ? Math.max(0, Math.round(((sourceFile.size - webpBlob.size) / sourceFile.size) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/png"
              onFilesSelected={handleFilesSelected}
              title="Select or drop PNG image"
              description="Converts to modern WebP format with alpha transparency"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
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

                  {percentReduction > 0 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      -{percentReduction}% Size Reduction
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!webpBlob}
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

          {/* Visual Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Original PNG
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100 p-2 min-h-[260px]">
                  {sourceUrl && (
                    <img
                      src={sourceUrl}
                      alt="Original PNG"
                      className="max-h-[260px] max-w-full rounded object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Converted WebP
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100 p-2 min-h-[260px]">
                  {webpUrl && (
                    <img
                      src={webpUrl}
                      alt="Converted WebP"
                      className="max-h-[260px] max-w-full rounded object-contain"
                    />
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
