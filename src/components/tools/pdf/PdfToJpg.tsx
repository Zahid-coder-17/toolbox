'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

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

  const renderPdfPages = async (file: File, targetDpi: 150 | 300) => {
    setIsRendering(true);
    setError(null);
    setPages([]);

    try {
      // Dynamic import of pdfjs-dist for client-side rendering
      const pdfjs = await import('pdfjs-dist');
      // Set worker
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
          // Render page to canvas
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
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to render PDF to JPG. Please ensure the document is not password-protected.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
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
    downloadBlob(zipBlob, `${baseName}-images.zip`);
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
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">PDF Document</span>
                  <div className="text-sm font-bold text-slate-800">
                    {sourceFile.name} ({formatBytes(sourceFile.size)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadAllZip}
                    disabled={pages.length === 0 || isRendering}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download All as ZIP
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Resolution options */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Resolution Quality:</span>
                <div className="flex gap-2">
                  <Button
                    variant={dpi === 150 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDpiChange(150)}
                    disabled={isRendering}
                  >
                    Standard (150 DPI)
                  </Button>
                  <Button
                    variant={dpi === 300 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDpiChange(300)}
                    disabled={isRendering}
                  >
                    Print Quality (300 DPI)
                  </Button>
                </div>
              </div>

              {isRendering && (
                <div className="flex items-center gap-3 bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-200 text-xs">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>
                    Rendering page {progress.current} of {progress.total}...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {pages.length > 0 && (
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rendered JPG Pages ({pages.length})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages.map((page) => (
                    <div
                      key={page.pageNumber}
                      className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Page {page.pageNumber}</span>
                        <span>{formatBytes(page.blob.size)}</span>
                      </div>

                      <div className="rounded-lg bg-white p-2 shadow-xs border border-slate-100 flex items-center justify-center overflow-hidden max-h-80">
                        <img
                          src={page.url}
                          alt={`Page ${page.pageNumber}`}
                          className="max-h-72 object-contain rounded"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSingle(page)}
                        className="w-full"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download Page {page.pageNumber} JPG
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
