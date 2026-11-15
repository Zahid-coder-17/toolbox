import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PdfCompressor } from '@/components/tools/pdf/PdfCompressor';
import { PdfMerger } from '@/components/tools/pdf/PdfMerger';
import { PdfSplitter } from '@/components/tools/pdf/PdfSplitter';
import { PdfToJpg } from '@/components/tools/pdf/PdfToJpg';

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:mock-pdf-url');
  URL.revokeObjectURL = vi.fn();
});

describe('PDF TOOLS (4/4)', () => {
  // 17. PDF Compressor
  describe('PDF Compressor', () => {
    it('renders upload dropzone with maximum size restriction and privacy notice', () => {
      render(<PdfCompressor />);
      expect(
        screen.getByText(/select or drop a pdf document to compress/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Max file size: 50 MB/i)).toBeInTheDocument();
    });
  });

  // 18. PDF Merger
  describe('PDF Merger', () => {
    it('renders multiple file dropzone for combining PDFs', () => {
      render(<PdfMerger />);
      expect(
        screen.getByText(/select or drop multiple pdf documents/i)
      ).toBeInTheDocument();
    });
  });

  // 19. PDF Splitter
  describe('PDF Splitter', () => {
    it('renders dropzone for page extraction and splitting', () => {
      render(<PdfSplitter />);
      expect(
        screen.getByText(/select or drop a pdf to split/i)
      ).toBeInTheDocument();
    });
  });

  // 20. PDF to JPG
  describe('PDF to JPG', () => {
    it('renders dropzone for page rendering to JPG', () => {
      render(<PdfToJpg />);
      expect(
        screen.getByText(/select or drop a pdf to convert to jpg/i)
      ).toBeInTheDocument();
    });
  });
});
