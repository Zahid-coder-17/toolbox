'use client';

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { copyToClipboard, downloadBlob } from '@/lib/utils';
import { Download, Copy, Check, Globe, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';

interface FaviconSize {
  size: number;
  name: string;
  blob?: Blob;
  url?: string;
}

export function FaviconGenerator() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [favicons, setFavicons] = useState<FaviconSize[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' },
  ];

  const htmlSnippet = `<!-- ToolBox Favicon Package -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      favicons.forEach((f) => {
        if (f.url) URL.revokeObjectURL(f.url);
      });
    };
  }, [sourceUrl, favicons]);

  const generateAllFavicons = async (file: File) => {
    setIsGenerating(true);
    setError(null);

    // Clean up previous URLs
    favicons.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
    });

    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => {
        setError('Failed to decode image file. Please provide a valid PNG, JPG, or SVG.');
        resolve();
      };
      img.src = url;
    });

    if (!img.naturalWidth) {
      setIsGenerating(false);
      return;
    }

    const generatedList: FaviconSize[] = [];
    for (const item of sizes) {
      const canvas = document.createElement('canvas');
      canvas.width = item.size;
      canvas.height = item.size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High quality downscaling with alpha transparency preserved
        ctx.clearRect(0, 0, item.size, item.size);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, item.size, item.size);

        await new Promise<void>((resolveBlob) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              generatedList.push({
                size: item.size,
                name: item.name,
                blob,
                url: blobUrl,
              });
            }
            resolveBlob();
          }, 'image/png');
        });
      }
    }

    setFavicons(generatedList);
    setIsGenerating(false);
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > 25 * 1024 * 1024) {
      setError('Selected icon file exceeds 25 MB limit.');
      return;
    }
    setSourceFile(file);
    generateAllFavicons(file);
  };

  const handleDownloadZip = async () => {
    if (favicons.length === 0) return;
    const zip = new JSZip();

    for (const fav of favicons) {
      if (fav.blob) {
        zip.file(fav.name, fav.blob);
      }
    }

    // Add standard site.webmanifest
    const webmanifest = JSON.stringify(
      {
        name: 'My Web Application',
        short_name: 'App',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
      },
      null,
      2
    );
    zip.file('site.webmanifest', webmanifest);

    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'favicon-package.zip');
  };

  const handleCopyCode = async () => {
    const ok = await copyToClipboard(htmlSnippet);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleReset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    favicons.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
    });
    setSourceFile(null);
    setSourceUrl('');
    setFavicons([]);
    setError(null);
  };

  const preview32 = favicons.find((f) => f.size === 32)?.url;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/*"
              maxSizeBytes={25 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop your logo or icon"
              description="Generates complete bundle for modern desktop browsers, Apple iOS, and Android PWA"
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

          {/* Action Header Card */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                    {preview32 ? (
                      <img src={preview32} alt="Favicon" className="h-full w-full object-contain" />
                    ) : (
                      <Globe className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sourceFile.name}</h3>
                    <p className="text-xs text-slate-500">
                      {isGenerating ? 'Generating multi-resolution package...' : 'Complete Favicon Package Ready'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadZip}
                    disabled={favicons.length === 0 || isGenerating}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download All (ZIP)
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Realistic Browser Tab Simulation */}
              <div className="rounded-xl bg-slate-900 p-3 text-xs text-slate-300">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Browser Tab Preview</div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5 w-fit border border-slate-700">
                  {preview32 ? (
                    <img src={preview32} alt="Favicon preview in tab" className="h-4 w-4 rounded-xs" />
                  ) : (
                    <Globe className="h-4 w-4 text-blue-400" />
                  )}
                  <span className="font-medium text-slate-200 truncate max-w-[150px]">My Awesome Site</span>
                  <span className="text-slate-500 text-[10px]">×</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Resolutions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {favicons.map((item) => (
              <div
                key={item.size}
                className="rounded-xl border border-slate-200 bg-white p-3 text-center space-y-2 shadow-xs"
              >
                <div className="h-16 flex items-center justify-center bg-slate-50 rounded-lg p-2 overflow-hidden border border-slate-100">
                  {item.url && (
                    <img
                      src={item.url}
                      alt={item.name}
                      style={{ maxHeight: `${Math.min(item.size, 56)}px`, maxWidth: `${Math.min(item.size, 56)}px` }}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="font-mono text-xs font-bold text-slate-800">{item.size}×{item.size}</div>
                <div className="text-[10px] text-slate-400 truncate" title={item.name}>{item.name}</div>
              </div>
            ))}
          </div>

          {/* HTML Integration Snippet */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  HTML Integration Snippet
                </span>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied HTML' : 'Copy HTML'}
                </Button>
              </div>

              <pre className="p-3 bg-slate-900 text-slate-100 text-xs font-mono rounded-lg overflow-x-auto leading-relaxed">
                {htmlSnippet}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
