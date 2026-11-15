'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Smartphone, AlertCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';

export function HeicToJpg() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(85);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasmCompatible] = useState<boolean>(() => typeof WebAssembly !== 'undefined');

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [convertedUrl]);

  const processHeic = async (file: File, q: number) => {
    if (typeof WebAssembly === 'undefined') {
      setError('Your browser does not support WebAssembly, which is required for browser-side HEIC decoding.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // Dynamic import to optimize bundle and avoid SSR issues
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
        'Failed to decode HEIC image. Please verify that this is a valid Apple HEIC / HEIF photo.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setError(null);

    if (file.size > 50 * 1024 * 1024) {
      setError('Selected HEIC file exceeds 50 MB limit.');
      return;
    }

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
    const outName = sourceFile.name.replace(/\.(heic|heif)$/i, '') + '.jpg';
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
      {!wasmCompatible && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 border border-amber-200 text-sm text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <span>WebAssembly is not supported or disabled in your browser. HEIC decoding requires modern WebAssembly support.</span>
        </div>
      )}

      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept=".heic,.heif,image/heic,image/heif"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop iPhone HEIC photo"
              description="Converts Apple HEIC / HEIF photos into universally compatible standard JPG"
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
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">HEIC Source</span>
                    <div className="text-sm font-bold text-slate-800">
                      {sourceFile.name} ({formatBytes(sourceFile.size)})
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">JPG Output</span>
                    <div className="text-sm font-bold text-blue-600">
                      {convertedBlob ? formatBytes(convertedBlob.size) : 'Decoding...'}
                    </div>
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
              <span>Decoding Apple HEIC file in browser via WebAssembly...</span>
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
                <div className="flex items-center justify-center rounded-lg bg-slate-100/70 p-2 min-h-[350px] overflow-hidden">
                  <img
                    src={convertedUrl}
                    alt="Converted JPG Preview"
                    className="max-h-[400px] max-w-full rounded object-contain shadow-xs"
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
