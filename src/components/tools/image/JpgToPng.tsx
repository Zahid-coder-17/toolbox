'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, Trash2, CheckCircle, FileImage } from 'lucide-react';

interface ConvertedItem {
  name: string;
  originalSize: number;
  blob: Blob;
  url: string;
  dimensions: { width: number; height: number };
}

export function JpgToPng() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    const results: ConvertedItem[] = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                const outName = file.name.replace(/\.(jpe?g)$/i, '') + '.png';
                results.push({
                  name: outName,
                  originalSize: file.size,
                  blob,
                  url: blobUrl,
                  dimensions: { width: img.naturalWidth, height: img.naturalHeight },
                });
              }
              resolve();
            }, 'image/png');
          } else {
            resolve();
          }
        };
        img.src = url;
      });
      URL.revokeObjectURL(url);
    }

    setItems((prev) => [...prev, ...results]);
    setIsProcessing(false);
  };

  const handleDownload = (item: ConvertedItem) => {
    downloadBlob(item.blob, item.name);
  };

  const handleClear = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <FileUpload
            accept="image/jpeg,image/jpg"
            multiple
            onFilesSelected={handleFilesSelected}
            title="Select or drop JPG / JPEG images"
            description="Converts to high-fidelity PNG format with 100% pixel accuracy"
          />
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Converted PNG Files ({items.length})
              </span>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-center bg-white rounded-lg p-2 h-40 border border-slate-100 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>

                  <div>
                    <div className="font-semibold text-sm text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.dimensions.width}×{item.dimensions.height} px • {formatBytes(item.blob.size)}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDownload(item)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download PNG
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
