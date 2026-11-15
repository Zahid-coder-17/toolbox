'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowUp, ArrowDown, FileText, Layers, ShieldCheck, RefreshCw } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export function PdfMerger() {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const newItems: PdfFileItem[] = [];

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount: doc.getPageCount(),
        });
      } catch (err) {
        console.error('Failed to parse PDF', err);
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
    if (items.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const buffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err) {
      console.error(err);
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
            onFilesSelected={handleFilesSelected}
            title="Select or drop multiple PDF documents"
            description="Combine two or more PDFs into a single continuous file"
          />
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
                    Download Merged PDF
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
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Reorderable Items List */}
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                        {item.file.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.file.size)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="h-8 w-8 p-0"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="h-8 w-8 p-0"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-red-600"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
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
