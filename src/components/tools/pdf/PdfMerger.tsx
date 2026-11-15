'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowUp, ArrowDown, FileText, Layers, RefreshCw, AlertCircle } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export function PdfMerger() {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    const newItems: PdfFileItem[] = [];

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds 50 MB limit and was skipped.`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount: doc.getPageCount(),
        });
      } catch {
        setError(`Failed to read "${file.name}". File may be corrupt, password-protected, or invalid.`);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setMergedBlob(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setItems(updated);
    setMergedBlob(null);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      setError('Please select at least 2 PDF documents to merge.');
      return;
    }
    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const buffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err) {
      setError('An error occurred during PDF merging: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadBlob(mergedBlob, 'merged-document.pdf');
  };

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0);
  const totalSize = items.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <FileUpload
            accept="application/pdf"
            multiple
            maxSizeBytes={50 * 1024 * 1024}
            onFilesSelected={handleFilesSelected}
            title="Select or drop multiple PDF documents"
            description="Combine two or more PDFs into a single continuous file"
          />
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-sm font-bold text-slate-800">
                  {items.length} Documents Selected
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  ({totalPages} total pages • {formatBytes(totalSize)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {mergedBlob ? (
                  <Button variant="primary" size="sm" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Merged PDF ({formatBytes(mergedBlob.size)})
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleMerge}
                    disabled={items.length < 2 || isMerging}
                  >
                    {isMerging ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
                    ) : (
                      <Layers className="h-3.5 w-3.5 mr-1" />
                    )}
                    Merge {items.length} PDFs
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setItems([]);
                    setMergedBlob(null);
                    setError(null);
                  }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Draggable/Reorderable Item List */}
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all hover:border-slate-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-slate-800">{item.file.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.file.size)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1}
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
