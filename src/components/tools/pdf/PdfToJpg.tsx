'use client';

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, RefreshCw, AlertCircle, Archive } from 'lucide-react';

interface RenderedPage {
  pageNumber: number;
  blob: Blob;
  url: string;
}

export function PdfToJpg() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState<150 | 300>(150);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  // Object URL cleanup on unmount
  useEffect(() => {
    return () => {
      pages.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [pages]);

  const renderPdfPages = async (file: File, targetDpi: 150 | 300) => {
    setIsRendering(true);
    setError(null);

    // Revoke previous URLs
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setPages([]);

    try {
      // Dynamic import of pdfjs-dist
      const pdfjs = await import('pdfjs-dist');
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      }

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setProgress({ current: 0, total: numPages });

      const scale = targetDpi === 300 ? 2.5 : 1.5;
      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport }).promise;

          await new Promise<void>((resolveBlob) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  rendered.push({
                    pageNumber: i,
                    blob,
                    url,
                  });
                }
                resolveBlob();
              },
              'image/jpeg',
              0.92
            );
          });
        }
        setProgress({ current: i, total: numPages });
      }

      setPages(rendered);
    } catch {
      setError('Failed to render PDF to JPG. Please ensure the document is not password-protected or corrupt.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    if (file.size > 50 * 1024 * 1024) {
      setError('Selected PDF exceeds 50 MB limit.');
      return;
    }
    setSourceFile(file);
    renderPdfPages(file, dpi);
  };

  const handleDpiChange = (newDpi: 150 | 300) => {
    setDpi(newDpi);
    if (sourceFile) {
      renderPdfPages(sourceFile, newDpi);
    }
  };

  const handleDownloadSingle = (page: RenderedPage) => {
    if (!sourceFile) return;
    const baseName = sourceFile.name.replace(/\.pdf$/i, '');
    downloadBlob(page.blob, `${baseName}-page-${page.pageNumber}.jpg`);
  };

  const handleDownloadAllZip = async () => {
    if (pages.length === 0 || !sourceFile) return;
    const zip = new JSZip();
    const baseName = sourceFile.name.replace(/\.pdf$/i, '');

    for (const page of pages) {
      zip.file(`${baseName}-page-${page.pageNumber}.jpg`, page.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${baseName}-jpg-pages.zip`);
  };

  const handleReset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setSourceFile(null);
    setPages([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="application/pdf"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop a PDF to convert to JPG"
              description="High-resolution page-by-page rendering with 150 DPI or 300 DPI"
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
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Document</span>
                  <div className="text-sm font-bold text-slate-800">
                    {sourceFile.name} ({formatBytes(sourceFile.size)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pages.length > 0 && (
                    <Button variant="primary" size="sm" onClick={handleDownloadAllZip}>
                      <Archive className="h-3.5 w-3.5 mr-1" />
                      Download All as ZIP ({pages.length} Pages)
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Resolution Setting */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Render Resolution (DPI)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={dpi === 150 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDpiChange(150)}
                  >
                    150 DPI (Standard Web)
                  </Button>
                  <Button
                    variant={dpi === 300 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDpiChange(300)}
                  >
                    300 DPI (High Resolution Print)
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {isRendering && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                      Rendering page {progress.current} of {progress.total}...
                    </span>
                    <span className="font-mono font-bold">
                      {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                      style={{
                        width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rendered Pages Grid */}
          {pages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((p) => (
                <Card key={p.pageNumber}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>Page {p.pageNumber}</span>
                      <span>{formatBytes(p.blob.size)}</span>
                    </div>

                    <div className="flex items-center justify-center bg-slate-50 rounded-lg p-2 h-64 border border-slate-100 overflow-hidden">
                      <img
                        src={p.url}
                        alt={`Page ${p.pageNumber}`}
                        className="max-h-full max-w-full object-contain shadow-xs rounded"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSingle(p)}
                      className="w-full"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download JPG
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
