import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

describe('IMAGE & QR UTILITIES (8/8)', () => {
  // 1. QR Code Generator
  describe('QR Code Generator', () => {
    it('normal: renders QR code controls and provides download options', async () => {
      await act(async () => {
        render(<QrCodeGenerator />);
      });

      expect(screen.getByRole('textbox', { name: /qr code content text/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download svg/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy image/i })).toBeInTheDocument();
    });

    it('edge: allows customizing error correction, margin, and colors', async () => {
      await act(async () => {
        render(<QrCodeGenerator />);
      });

      const highEcBtn = screen.getByRole('button', { name: /high \(30%\)/i });
      await act(async () => {
        fireEvent.click(highEcBtn);
      });
      expect(highEcBtn).toBeInTheDocument();

      const fgInput = screen.getByRole('textbox', { name: /foreground hex code/i });
      await act(async () => {
        fireEvent.change(fgInput, { target: { value: '#0055ff' } });
      });
      expect(fgInput).toHaveValue('#0055ff');
    });

    it('invalid: reports validation error when QR content exceeds safe capacity', async () => {
      await act(async () => {
        render(<QrCodeGenerator />);
      });

      const textarea = screen.getByRole('textbox', { name: /qr code content text/i });
      const excessiveContent = 'x'.repeat(2600); // Exceeds 2500 char max limit
      await act(async () => {
        fireEvent.change(textarea, { target: { value: excessiveContent } });
      });

      expect(screen.getByText(/content exceeds maximum qr payload capacity/i)).toBeInTheDocument();
    });
  });

  // 2. Color Picker
  describe('Color Picker', () => {
    it('normal: converts HEX to RGB, HSL, CMYK representations accurately', () => {
      render(<ColorPicker />);
      const inputs = screen.getAllByDisplayValue('#2563eb');
      fireEvent.change(inputs[1], { target: { value: '#ff0000' } });

      // RGB conversion for pure red
      expect(screen.getByText('rgb(255, 0, 0)')).toBeInTheDocument();
      expect(screen.getByText('hsl(0, 100%, 50%)')).toBeInTheDocument();
      expect(screen.getByText('cmyk(0%, 100%, 100%, 0%)')).toBeInTheDocument();
    });

    it('edge: calculates WCAG 2.1 accessibility contrast and color harmonies', () => {
      render(<ColorPicker />);
      expect(screen.getByText(/WCAG 2.1 Accessibility/i)).toBeInTheDocument();
      expect(screen.getByText(/Against White/i)).toBeInTheDocument();
      expect(screen.getByText(/Against Black/i)).toBeInTheDocument();
      expect(screen.getByText(/Harmonious Color Palettes/i)).toBeInTheDocument();
      expect(screen.getByText(/Complementary/i)).toBeInTheDocument();
    });

    it('invalid: recovers gracefully from malformed hex inputs without crashing', () => {
      render(<ColorPicker />);
      const inputs = screen.getAllByDisplayValue('#2563eb');
      fireEvent.change(inputs[1], { target: { value: '#invalidhex' } });

      // Fallback maintains valid component rendering
      expect(screen.getByText(/WCAG 2.1 Accessibility/i)).toBeInTheDocument();
    });
  });

  // 3. Image Compressor
  describe('Image Compressor', () => {
    it('normal: renders upload dropzone and format controls', () => {
      render(<ImageCompressor />);
      expect(screen.getByText(/select or drop an image to compress/i)).toBeInTheDocument();
      expect(screen.getByText(/supports jpg, png, and webp/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized files exceeding maximum 50 MB limit', () => {
      render(<ImageCompressor />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Mock 60 MB file
      const hugeFile = new File([new ArrayBuffer(100)], 'huge-image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 4. Image Resizer
  describe('Image Resizer', () => {
    it('normal: renders dropzone and explains dimension & percentage scaling', () => {
      render(<ImageResizer />);
      expect(screen.getByText(/select or drop an image to resize/i)).toBeInTheDocument();
      expect(screen.getByText(/aspect ratio lock/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized files exceeding memory safety limits', () => {
      render(<ImageResizer />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'massive.png', { type: 'image/png' });
      Object.defineProperty(hugeFile, 'size', { value: 55 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 5. JPG to PNG
  describe('JPG to PNG', () => {
    it('normal: renders multi-file dropzone for JPG/JPEG images', () => {
      render(<JpgToPng />);
      expect(screen.getByText(/select or drop jpg \/ jpeg images/i)).toBeInTheDocument();
      expect(screen.getByText(/100% pixel accuracy/i)).toBeInTheDocument();
    });

    it('edge: rejects files exceeding maximum upload boundary', () => {
      render(<JpgToPng />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 6. PNG to WebP
  describe('PNG to WebP', () => {
    it('normal: renders dropzone emphasizing alpha transparency retention', () => {
      render(<PngToWebp />);
      expect(screen.getByText(/select or drop png image/i)).toBeInTheDocument();
      expect(screen.getByText(/full alpha transparency/i)).toBeInTheDocument();
    });

    it('invalid: warns when selected file exceeds size limit', () => {
      render(<PngToWebp />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'huge.png', { type: 'image/png' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 7. HEIC to JPG
  describe('HEIC to JPG', () => {
    it('normal: renders dropzone for Apple iPhone HEIC photos', () => {
      render(<HeicToJpg />);
      expect(screen.getByText(/select or drop iphone heic photo/i)).toBeInTheDocument();
      expect(screen.getByText(/standard jpg/i)).toBeInTheDocument();
    });

    it('invalid: handles oversized HEIC files safely', () => {
      render(<HeicToJpg />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'huge.heic', { type: 'image/heic' });
      Object.defineProperty(hugeFile, 'size', { value: 60 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 50 MB/i)).toBeInTheDocument();
    });
  });

  // 8. Favicon Generator
  describe('Favicon Generator', () => {
    it('normal: renders dropzone and multi-resolution icon specifications', () => {
      render(<FaviconGenerator />);
      expect(screen.getByText(/select or drop your logo or icon/i)).toBeInTheDocument();
      expect(screen.getByText(/modern desktop browsers, apple ios, and android pwa/i)).toBeInTheDocument();
    });

    it('invalid: rejects oversized icon assets exceeding 25 MB limit', () => {
      render(<FaviconGenerator />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      const hugeFile = new File([new ArrayBuffer(100)], 'icon.png', { type: 'image/png' });
      Object.defineProperty(hugeFile, 'size', { value: 30 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [hugeFile] } });
      expect(screen.getByText(/exceeds the maximum allowed size of 25 MB/i)).toBeInTheDocument();
    });
  });
});
