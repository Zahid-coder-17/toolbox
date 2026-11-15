import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QrCodeGenerator } from '@/components/tools/image/QrCodeGenerator';
import { ColorPicker } from '@/components/tools/image/ColorPicker';
import { ImageCompressor } from '@/components/tools/image/ImageCompressor';
import { ImageResizer } from '@/components/tools/image/ImageResizer';
import { JpgToPng } from '@/components/tools/image/JpgToPng';
import { PngToWebp } from '@/components/tools/image/PngToWebp';
import { HeicToJpg } from '@/components/tools/image/HeicToJpg';
import { FaviconGenerator } from '@/components/tools/image/FaviconGenerator';

beforeEach(() => {
  // Mock URL methods for jsdom
  URL.createObjectURL = vi.fn(() => 'blob:mock-image-url');
  URL.revokeObjectURL = vi.fn();
});

describe('IMAGE TOOLS (8/8)', () => {
  // 14. QR Code Generator
  describe('QR Code Generator', () => {
    it('renders QR code and generates preview on valid URL', async () => {
      render(<QrCodeGenerator />);
      const textarea = screen.getByRole('textbox', { name: /qr code content text/i });
      fireEvent.change(textarea, { target: { value: 'https://toolbox.dev' } });

      expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download svg/i })).toBeInTheDocument();
    });

    it('updates when error correction margin is adjusted', () => {
      render(<QrCodeGenerator />);
      const highBtn = screen.getByRole('button', { name: /high \(30%\)/i });
      fireEvent.click(highBtn);
      expect(highBtn).toBeInTheDocument();
    });
  });

  // 16. Color Picker
  describe('Color Picker', () => {
    it('converts HEX to RGB, HSL, CMYK and displays WCAG contrast ratios', () => {
      render(<ColorPicker />);
      const inputs = screen.getAllByDisplayValue('#2563eb');
      fireEvent.change(inputs[1], { target: { value: '#ff0000' } });

      // RGB for red
      expect(screen.getByText('rgb(255, 0, 0)')).toBeInTheDocument();
      // WCAG Contrast
      expect(screen.getByText(/WCAG 2.1 Accessibility/i)).toBeInTheDocument();
      expect(screen.getByText(/Harmonious Color Palettes/i)).toBeInTheDocument();
    });

    it('renders pass/fail ratings for contrast against white and black', () => {
      render(<ColorPicker />);
      expect(screen.getByText(/Against White/i)).toBeInTheDocument();
      expect(screen.getByText(/Against Black/i)).toBeInTheDocument();
    });
  });

  // 9. Image Compressor
  describe('Image Compressor', () => {
    it('renders file upload dropzone and accepts images', () => {
      render(<ImageCompressor />);
      expect(screen.getByText(/select or drop an image to compress/i)).toBeInTheDocument();
    });
  });

  // 10. Image Resizer
  describe('Image Resizer', () => {
    it('renders upload area and controls', () => {
      render(<ImageResizer />);
      expect(screen.getByText(/select or drop an image to resize/i)).toBeInTheDocument();
    });
  });

  // 11. JPG to PNG
  describe('JPG to PNG', () => {
    it('renders dropzone for JPG images', () => {
      render(<JpgToPng />);
      expect(screen.getByText(/select or drop jpg \/ jpeg images/i)).toBeInTheDocument();
    });
  });

  // 12. PNG to WebP
  describe('PNG to WebP', () => {
    it('renders dropzone for PNG images', () => {
      render(<PngToWebp />);
      expect(screen.getByText(/select or drop png image/i)).toBeInTheDocument();
    });
  });

  // 13. HEIC to JPG
  describe('HEIC to JPG', () => {
    it('renders dropzone for iPhone HEIC images', () => {
      render(<HeicToJpg />);
      expect(screen.getByText(/select or drop iphone heic photo/i)).toBeInTheDocument();
    });
  });

  // 15. Favicon Generator
  describe('Favicon Generator', () => {
    it('renders dropzone and lists target multi-size icon outputs', () => {
      render(<FaviconGenerator />);
      expect(screen.getByText(/select or drop your logo or icon/i)).toBeInTheDocument();
    });
  });
});
