'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { copyToClipboard, downloadBlob } from '@/lib/utils';
import { Download, Copy, Check, Globe, RefreshCw, X } from 'lucide-react';

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

  const generateAllFavicons = async (file: File) => {
    setIsGenerating(true);
    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = url;
    });

    const generatedList: FaviconSize[] = [];
    for (const item of sizes) {
      const canvas = document.createElement('canvas');
      canvas.width = item.size;
      canvas.height = item.size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
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
    setSourceFile(files[0]);
    generateAllFavicons(files[0]);
  };

  const handleDownloadZip = async () => {
    if (favicons.length === 0) return;
    const zip = new JSZip();

    for (const fav of favicons) {
      if (fav.blob) {
        zip.file(fav.name, fav.blob);
      }
    }

    // Add sample webmanifest
    const webmanifest = JSON.stringify(
      {
        name: 'My Web App',
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

  const preview32 = favicons.find((f) => f.size === 32)?.url;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="image/*"
              onFilesSelected={handleFilesSelected}
              title="Select or drop your logo or icon"
              description="Generates complete bundle for modern browsers, Apple iOS, and Android PWA"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Browser Tab Mock Preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Browser Tab Live Simulation
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadZip}
                    disabled={favicons.length === 0 || isGenerating}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Complete ZIP Package
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSourceFile(null);
                      setFavicons([]);
                    }}
                    className="text-red-600"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Mock Browser Header */}
              <div className="rounded-xl border border-slate-300 bg-slate-200/60 p-2 shadow-xs">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 rounded-t-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs">
                    {preview32 ? (
                      <img src={preview32} alt="Favicon" className="h-4 w-4 rounded-xs" />
                    ) : (
                      <Globe className="h-4 w-4 text-slate-400" />
                    )}
                    <span>My Production Website</span>
                    <X className="h-3 w-3 text-slate-400 ml-2" />
                  </div>
                </div>
                <div className="rounded-lg bg-white px-3 py-1 text-xs text-slate-500 font-mono flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">🔒</span>
                  <span>https://mywebsite.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Sizes Grid */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Generated Favicon Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {favicons.map((item) => (
                  <div
                    key={item.size}
                    className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-center"
                  >
                    <div className="h-16 flex items-center justify-center">
                      {item.url && (
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{
                            width: Math.min(48, item.size),
                            height: Math.min(48, item.size),
                          }}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-slate-800">{item.size}×{item.size}</div>
                    <div className="text-[10px] text-slate-500 truncate w-full">{item.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HTML Embed Snippet */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  HTML &lt;head&gt; Code Snippet
                </span>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy HTML'}
                </Button>
              </div>
              <pre className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                {htmlSnippet}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
