'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { copyToClipboard, downloadText, downloadBlob } from '@/lib/utils';
import { Copy, Trash2, Download, Check, AlertCircle, ArrowLeftRight, FileCode, Type } from 'lucide-react';

export function Base64Tool() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // File state
  const [fileDataUri, setFileDataUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileMime, setFileMime] = useState('');
  const [fileSize, setFileSize] = useState(0);

  // UTF-8 safe Text to Base64
  const encodeText = () => {
    if (!textInput) return;
    try {
      const bytes = new TextEncoder().encode(textInput);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      setTextOutput(b64);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Encoding failed');
    }
  };

  // UTF-8 safe Base64 to Text
  const decodeText = () => {
    if (!textInput) return;
    try {
      const cleanInput = textInput.trim().replace(/\s/g, '');
      const binary = atob(cleanInput);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoded = new TextDecoder().decode(bytes);
      setTextOutput(decoded);
      setError(null);
    } catch {
      setError('Invalid Base64 string. Please verify the input characters.');
    }
  };

  const handleSwap = () => {
    setTextInput(textOutput);
    setTextOutput(textInput);
    setError(null);
  };

  const handleCopy = async (val: string) => {
    if (!val) return;
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    setFileMime(file.type || 'application/octet-stream');
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileDataUri(result);
    };
    reader.readAsDataURL(file);
  };

  const decodeDataUriToFile = () => {
    if (!fileDataUri) return;
    try {
      const parts = fileDataUri.split(',');
      const meta = parts[0];
      const base64Content = parts.length > 1 ? parts[1] : parts[0];
      const mimeMatch = meta.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

      const byteCharacters = atob(base64Content);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays], { type: mime });
      downloadBlob(blob, fileName || 'decoded-file.bin');
    } catch {
      setError('Unable to decode Base64 file string.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode selection */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setMode('text')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            mode === 'text'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Type className="h-4 w-4" />
          Text Mode
        </button>
        <button
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            mode === 'file'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCode className="h-4 w-4" />
          File to Base64
        </button>
      </div>

      {mode === 'text' ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Input String
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={encodeText} disabled={!textInput}>
                    Encode to Base64
                  </Button>
                  <Button variant="secondary" size="sm" onClick={decodeText} disabled={!textInput}>
                    Decode to Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwap}
                    disabled={!textInput && !textOutput}
                    title="Swap Input and Output"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTextInput('');
                      setTextOutput('');
                      setError(null);
                    }}
                    disabled={!textInput && !textOutput}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setError(null);
                }}
                placeholder="Enter UTF-8 text to encode, or paste Base64 string to decode..."
                className="w-full min-h-[160px] p-3 text-slate-900 placeholder:text-slate-400 bg-transparent resize-y focus:outline-none font-mono text-sm leading-relaxed"
                aria-label="Base64 text input"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Result
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(textOutput)}
                    disabled={!textOutput}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadText(textOutput, 'base64-result.txt')}
                    disabled={!textOutput}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>

              <textarea
                readOnly
                value={textOutput}
                placeholder="Encoded or decoded output will appear here..."
                className="w-full min-h-[160px] p-3 text-slate-900 placeholder:text-slate-400 bg-slate-50/50 rounded-lg resize-y focus:outline-none font-mono text-sm leading-relaxed"
                aria-label="Base64 text output"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Upload Any File to Encode</h3>
              <FileUpload
                onFilesSelected={handleFileSelected}
                title="Select image, PDF, or document"
                description="Converts your local file into a Base64 Data URI"
              />
            </CardContent>
          </Card>

          {fileDataUri && (
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{fileName}</span>
                    <span className="text-xs text-slate-500 ml-2">
                      ({fileMime} • {(fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(fileDataUri)}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      Copy Data URI
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={decodeDataUriToFile}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download File
                    </Button>
                  </div>
                </div>

                <textarea
                  readOnly
                  value={fileDataUri}
                  rows={8}
                  className="w-full p-3 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  aria-label="File Base64 Data URI"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
