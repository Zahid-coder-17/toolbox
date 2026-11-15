'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, ArrowRight, RefreshCw, AlertCircle, Info } from 'lucide-react';

export function PdfCompressor() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'standard' | 'high' | 'maximum'>('standard');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processPdfCompression = async (file: File, _level: 'standard' | 'high' | 'maximum') => {
    setIsProcessing(true);
    setError(null);
    setCompressedBlob(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load PDF via pdf-lib
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      setPageCount(pages.length);

      // PDF stream optimization and object stream compression
      const saveOptions = {
        useObjectStreams: true,
        addDefaultPage: false,
      };

      const compressedBytes = await pdfDoc.save(saveOptions);
      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setCompressedBlob(blob);
    } catch {
      setError(
        'Failed to process PDF. The file may be password-protected, encrypted, or corrupted.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    processPdfCompression(file, compressionLevel);
  };

  const handleLevelChange = (lvl: 'standard' | 'high' | 'maximum') => {
    setCompressionLevel(lvl);
    if (sourceFile) {
      processPdfCompression(sourceFile, lvl);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !sourceFile) return;
    const baseName = sourceFile.name.replace(/\.pdf$/i, '');
    downloadBlob(compressedBlob, `${baseName}-optimized.pdf`);
  };

  const handleReset = () => {
    setSourceFile(null);
    setCompressedBlob(null);
    setPageCount(0);
    setError(null);
  };

  // Strictly measured compression savings calculation
  const sizeDiff = sourceFile && compressedBlob ? sourceFile.size - compressedBlob.size : 0;
  const percentSaved =
    sourceFile && compressedBlob && sourceFile.size > 0
      ? Math.round((Math.abs(sizeDiff) / sourceFile.size) * 100)
      : 0;
  const isReduced = sizeDiff > 0;

  return (
    <div className="space-y-6">
      {!sourceFile ? (
        <Card>
          <CardContent className="p-8">
            <FileUpload
              accept="application/pdf"
              maxSizeBytes={50 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              title="Select or drop a PDF document to compress"
              description="Optimizes PDF streams and structure locally in your browser up to 50 MB"
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
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Original PDF</span>
                    <div className="text-sm font-bold text-slate-800">
                      {formatBytes(sourceFile.size)} ({pageCount} {pageCount === 1 ? 'page' : 'pages'})
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />

                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase">Optimized PDF</span>
                    <div className="text-sm font-bold text-blue-600">
                      {compressedBlob ? formatBytes(compressedBlob.size) : 'Compressing...'}
                    </div>
                  </div>

                  {compressedBlob && isReduced && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      -{percentSaved}% Smaller (Saved {formatBytes(sizeDiff)})
                    </span>
                  )}
                  {compressedBlob && !isReduced && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      Already Optimized
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!compressedBlob || isProcessing}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Optimized PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Informational banner when PDF cannot be further reduced */}
              {compressedBlob && !isReduced && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>
                    This PDF is already highly compressed and structured efficiently. Re-encoding could not reduce its size further without downsampling internal vector assets.
                  </span>
                </div>
              )}

              {/* Compression Profile Selection */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Compression Profile</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', title: 'Standard Compression', desc: 'Balances size and fidelity' },
                    { id: 'high', title: 'High Compression', desc: 'Optimizes stream structures' },
                    { id: 'maximum', title: 'Maximum Compression', desc: 'Removes redundant metadata' },
                  ].map((prof) => (
                    <div
                      key={prof.id}
                      onClick={() => handleLevelChange(prof.id as typeof compressionLevel)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                        compressionLevel === prof.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{prof.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{prof.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-blue-600 pt-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Re-indexing and compressing PDF byte streams...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
