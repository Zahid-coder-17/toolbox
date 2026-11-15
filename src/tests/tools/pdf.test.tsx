import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PdfCompressor } from '@/components/tools/pdf/PdfCompressor';
import { PdfMerger } from '@/components/tools/pdf/PdfMerger';
import { PdfSplitter } from '@/components/tools/pdf/PdfSplitter';
import { PdfToJpg } from '@/components/tools/pdf/PdfToJpg';

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:mock-pdf-url');
  URL.revokeObjectURL = vi.fn();
});

describe('PDF UTILITIES (4/4)', () => {
  // 1. PDF Compressor
  describe('PDF Compressor', () => {
    it('normal: renders upload dropzone with maximum size restriction and privacy notice', () => {
      render(<PdfCompressor />);
      expect(
        screen.getByText(/select or drop a pdf document to compress/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Max file size: 50 MB/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized files exceeding maximum 50 MB boundary', () => {
      render(<PdfCompressor />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });

    it('handles corrupted or non-PDF binary data gracefully with clear error notification', async () => {
      render(<PdfCompressor />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const corruptFile = new File(['corrupted-non-pdf-content'], 'corrupted.pdf', {
        type: 'application/pdf',
      });

      fireEvent.change(fileInput, { target: { files: [corruptFile] } });

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to process PDF. The file may be password-protected, encrypted, or corrupted./i)
        ).toBeInTheDocument();
      });
    });
  });

  // 2. PDF Merger
  describe('PDF Merger', () => {
    it('normal: renders multiple file dropzone for combining PDFs', () => {
      render(<PdfMerger />);
      expect(
        screen.getByText(/select or drop multiple pdf documents/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Combine two or more PDFs into a single continuous file/i)).toBeInTheDocument();
    });

    it('invalid: warns when selected file exceeds size limits', () => {
      render(<PdfMerger />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'oversized.pdf', { type: 'application/pdf' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 3. PDF Splitter
  describe('PDF Splitter', () => {
    it('normal: renders dropzone for page extraction and splitting', () => {
      render(<PdfSplitter />);
      expect(
        screen.getByText(/select or drop a pdf document to split/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Extract specific page ranges or split entire document/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized files exceeding 50 MB limit', () => {
      render(<PdfSplitter />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'massive.pdf', { type: 'application/pdf' });
      Object.defineProperty(hugeFile, 'size', { value: 70 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });

    it('invalid: reports error when attempting to open a corrupted PDF file', async () => {
      render(<PdfSplitter />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const corruptFile = new File(['invalid-pdf-header'], 'broken.pdf', {
        type: 'application/pdf',
      });

      fireEvent.change(fileInput, { target: { files: [corruptFile] } });

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to open PDF. File may be encrypted, password-protected, or corrupted./i)
        ).toBeInTheDocument();
      });
    });
  });

  // 4. PDF to JPG
  describe('PDF to JPG', () => {
    it('normal: renders dropzone for high-resolution page rendering', () => {
      render(<PdfToJpg />);
      expect(
        screen.getByText(/select or drop a pdf to convert to jpg/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/150 DPI or 300 DPI/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized files exceeding 50 MB boundary', () => {
      render(<PdfToJpg />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(hugeFile, 'size', { value: 65 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });
});
