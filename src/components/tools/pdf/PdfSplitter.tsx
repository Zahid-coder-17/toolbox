'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Split, AlertCircle, RefreshCw, FileText } from 'lucide-react';

export function PdfSplitter() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [pageRange, setPageRange] = useState<string>('1');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultIsZip, setResultIsZip] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    setError(null);
    setResultBlob(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch {
      setError('Failed to open PDF. File may be encrypted or corrupted.');
    }
  };

  const parseRangeString = (str: string, maxPages: number): number[] => {
    const indices: Set<number> = new Set();
    const parts = str.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end)) continue;
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          indices.add(i - 1); // 0-based
        }
      } else {
        const single = parseInt(trimmed, 10);
        if (!isNaN(single) && single >= 1 && single <= maxPages) {
          indices.add(single - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const processSplit = async () => {
    if (!sourceFile) return;
    setIsProcessing(true);
    setError(null);
    setResultBlob(null);

    try {
      const buffer = await sourceFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (splitMode === 'range') {
        const indices = parseRangeString(pageRange, pageCount);
        if (indices.length === 0) {
          setError('No valid page numbers found in specified range.');
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const bytes = await newDoc.save();
        setResultBlob(new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' }));
        setResultIsZip(false);
      } else {
        // Split every single page into zip
        const zip = new JSZip();
        const baseName = sourceFile.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultBlob(zipBlob);
        setResultIsZip(true);
      }
    } catch {
      setError('An error occurred while splitting the document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.pdf$/i, '');
    if (resultIsZip) {
      downloadBlob(resultBlob, `${baseName}-split-pages.zip`);
    } else {
      downloadBlob(resultBlob, `${baseName}-extracted.pdf`);
    }
  };

  const handleReset = () => {
    setSourceFile(null);
    setPageCount(0);
    setResultBlob(null);
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
              title="Select or drop a PDF to split"
              description="Extract selected page ranges or separate all pages locally"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Loaded Document</span>
                  <div className="text-sm font-bold text-slate-800">
                    {sourceFile.name} ({pageCount} {pageCount === 1 ? 'page' : 'pages'})
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Mode Selection */}
              <div className="flex gap-2">
                <Button
                  variant={splitMode === 'range' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSplitMode('range');
                    setResultBlob(null);
                  }}
                >
                  Extract Custom Page Range
                </Button>
                <Button
                  variant={splitMode === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSplitMode('all');
                    setResultBlob(null);
                  }}
                >
                  Split All Pages (ZIP)
                </Button>
              </div>

              {splitMode === 'range' ? (
                <div className="space-y-2">
                  <label htmlFor="pdf-page-ranges" className="text-xs font-semibold text-slate-700 block">
                    Page Ranges to Extract (e.g., 1-3, 5, 7-{pageCount})
                  </label>
                  <Input
                    id="pdf-page-ranges"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder={`e.g. 1-${Math.min(pageCount, 3)}`}
                  />
                  <p className="text-xs text-slate-400">
                    Enter comma-separated single pages or ranges from 1 to {pageCount}.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  This will generate {pageCount} individual 1-page PDF documents packaged in a downloadable ZIP archive.
                </p>
              )}

              <Button
                variant="primary"
                size="md"
                onClick={processSplit}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Split className="h-4 w-4 mr-1.5" />
                )}
                {splitMode === 'range' ? 'Extract Selected Pages' : `Split into ${pageCount} PDFs`}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {resultBlob && (
            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardContent className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-emerald-900">
                    PDF Split Successful!
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    Ready to download: {formatBytes(resultBlob.size)} (
                    {resultIsZip ? 'ZIP archive with all pages' : 'Extracted PDF document'})
                  </div>
                </div>

                <Button variant="primary" size="md" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Download {resultIsZip ? 'ZIP Archive' : 'PDF'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
