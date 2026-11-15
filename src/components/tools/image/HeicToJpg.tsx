'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';

export function HeicToJpg() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(85);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processHeic = async (file: File, q: number) => {
    setIsConverting(true);
    setError(null);

    try {
      // Dynamic import to avoid SSR issues and optimize initial bundle
      const heic2any = (await import('heic2any')).default;
      const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: q / 100,
      });

      const outputBlob = Array.isArray(result) ? result[0] : result;
      setConvertedBlob(outputBlob);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(URL.createObjectURL(outputBlob));
    } catch (err: unknown) {
      setError(
        'Failed to decode HEIC image. Please verify that this is a valid Apple HEIC photo.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    processHeic(file, quality);
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (sourceFile) {
      processHeic(sourceFile, q);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !sourceFile) return;
    const outName = sourceFile.name.replace(/\.heic$/i, '') + '.jpg';
    downloadBlob(convertedBlob, outName);
  };

  const handleReset = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setSourceFile(null);
    setConvertedBlob(null);
    setConvertedUrl('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept=".heic,.heif,image/heic,image/heif"
              onFilesSelected={handleFilesSelected}
              title="Select or drop iPhone HEIC photo"
              description="Converts Apple HEIC photos into universally compatible standard JPG"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Source File</span>
                  <div className="text-sm font-bold text-slate-800">
                    {sourceFile.name} ({formatBytes(sourceFile.size)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!convertedBlob || isConverting}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download JPG
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              <Slider
                label="JPEG Output Quality"
                valueDisplay={`${quality}%`}
                min={10}
                max={100}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
              />
            </CardContent>
          </Card>

          {isConverting && (
            <div className="flex items-center justify-center p-12 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
              <span>Decoding Apple HEIC file in browser...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {convertedUrl && !isConverting && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Converted JPG Preview</span>
                  <span>{convertedBlob ? formatBytes(convertedBlob.size) : ''}</span>
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100 p-2 min-h-[300px]">
                  <img
                    src={convertedUrl}
                    alt="Converted JPG"
                    className="max-h-[350px] max-w-full rounded object-contain shadow-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
