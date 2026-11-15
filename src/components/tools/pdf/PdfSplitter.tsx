'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, Split, AlertCircle, RefreshCw } from 'lucide-react';

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
      setError('Failed to open PDF. File may be encrypted, password-protected, or corrupted.');
    }
  };

  const parseRangeString = (str: string, maxPages: number): { indices: number[]; invalidParts: string[] } => {
    const indices: Set<number> = new Set();
    const invalidParts: string[] = [];
    const parts = str.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          invalidParts.push(trimmed);
          continue;
        }
        for (let i = start; i <= end; i++) {
          indices.add(i - 1); // 0-based index
        }
      } else {
        const single = parseInt(trimmed, 10);
        if (isNaN(single) || single < 1 || single > maxPages) {
          invalidParts.push(trimmed);
          continue;
        }
        indices.add(single - 1);
      }
    }

    return { indices: Array.from(indices).sort((a, b) => a - b), invalidParts };
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
        const { indices, invalidParts } = parseRangeString(pageRange, pageCount);

        if (invalidParts.length > 0) {
          setError(
            `Page range boundary error: "${invalidParts.join(', ')}" is out of valid bounds (document has ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}).`
          );
          setIsProcessing(false);
          return;
        }

        if (indices.length === 0) {
          setError(`No valid page numbers found in specified range. Document has ${pageCount} pages.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const bytes = await newDoc.save({ useObjectStreams: true });
        setResultBlob(new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' }));
        setResultIsZip(false);
      } else {
        // Split each page into individual PDF files inside ZIP
        const zip = new JSZip();
        const baseName = sourceFile.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < pageCount; i++) {
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save({ useObjectStreams: true });
          zip.file(`${baseName}-page-${i + 1}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultBlob(zipBlob);
        setResultIsZip(true);
      }
    } catch (err) {
      setError('An error occurred while splitting the document: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
              title="Select or drop a PDF document to split"
              description="Extract specific page ranges or split entire document into individual pages"
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
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Document</span>
                  <div className="text-sm font-bold text-slate-800">
                    {sourceFile.name} ({pageCount} total pages • {formatBytes(sourceFile.size)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {resultBlob ? (
                    <Button variant="primary" size="sm" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {resultIsZip ? 'Download All Pages (ZIP)' : 'Download Extracted PDF'}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={processSplit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <Split className="h-3.5 w-3.5 mr-1" />
                      )}
                      Process Split
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Splitting Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setSplitMode('range');
                      setResultBlob(null);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      splitMode === 'range'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">Custom Page Range</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Extract specific pages into a single PDF (e.g. 1-5, 8, 11-12)
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setSplitMode('all');
                      setResultBlob(null);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      splitMode === 'all'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">Separate All Pages</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Split every page into its own individual PDF bundled in a ZIP
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Page Range Controls */}
              {splitMode === 'range' && (
                <div className="space-y-2">
                  <label htmlFor="split-range" className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Page Selection (1 to {pageCount})
                  </label>
                  <Input
                    id="split-range"
                    type="text"
                    value={pageRange}
                    onChange={(e) => {
                      setPageRange(e.target.value);
                      setResultBlob(null);
                    }}
                    placeholder={`e.g. 1-${Math.min(pageCount, 5)}, ${pageCount}`}
                    className="font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Use commas to separate single pages or hyphens for ranges (e.g. 1-3, 5, 7-9).
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
