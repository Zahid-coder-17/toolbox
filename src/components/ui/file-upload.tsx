'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';

export interface FileUploadProps {
  accept?: string;
  maxSizeBytes?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  description?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSizeBytes = 25 * 1024 * 1024,
  multiple = false,
  onFilesSelected,
  title = 'Upload a file',
  description = 'Drag and drop your file here, or click to browse',
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndEmit = (incomingFiles: FileList | File[]) => {
    setError(null);
    const filesArray = Array.from(incomingFiles);

    if (filesArray.length === 0) return;

    for (const file of filesArray) {
      if (maxSizeBytes && file.size > maxSizeBytes) {
        setError(
          `File "${file.name}" exceeds the maximum allowed size of ${formatBytes(maxSizeBytes)}.`
        );
        return;
      }
    }

    onFilesSelected(multiple ? filesArray : [filesArray[0]]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndEmit(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndEmit(e.target.files);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-blue-600 bg-blue-50/50 scale-[1.005]'
            : 'border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50',
          error && 'border-red-300 bg-red-50/30'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h4 className="text-base font-semibold text-slate-800">{title}</h4>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
        <p className="mt-2 text-xs text-slate-400">
          Max file size: {formatBytes(maxSizeBytes)}
          {accept && ` • Accepted: ${accept}`}
        </p>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
