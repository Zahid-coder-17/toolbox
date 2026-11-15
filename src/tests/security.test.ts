import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  isValidUrl,
  validateFileSignature,
  SafeUrlRegistry,
} from '@/lib/security';

describe('Security Utilities', () => {
  describe('sanitizeText', () => {
    it('escapes dangerous HTML/XSS characters', () => {
      const malicious = '<script>alert("xss")</script> & \'hello\'';
      const sanitized = sanitizeText(malicious);
      expect(sanitized).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#039;hello&#039;'
      );
      expect(sanitized).not.toContain('<script>');
    });

    it('handles empty input safely', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('isValidUrl', () => {
    it('validates safe http and https URLs', () => {
      expect(isValidUrl('https://example.com/test')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('rejects unsafe protocols and javascript: URIs', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      expect(isValidUrl('data:text/html,evil')).toBe(false);
      expect(isValidUrl('not a url')).toBe(false);
    });
  });

  describe('validateFileSignature (Magic Bytes)', () => {
    it('validates true JPEG magic number', async () => {
      const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const file = new File([jpegBytes], 'test.jpg', { type: 'image/jpeg' });
      const isValid = await validateFileSignature(file, 'image/jpeg');
      expect(isValid).toBe(true);
    });

    it('rejects spoofed JPEG extension', async () => {
      const fakeBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
      const file = new File([fakeBytes], 'fake.jpg', { type: 'image/jpeg' });
      const isValid = await validateFileSignature(file, 'image/jpeg');
      expect(isValid).toBe(false);
    });

    it('validates PNG magic number', async () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const file = new File([pngBytes], 'test.png', { type: 'image/png' });
      const isValid = await validateFileSignature(file, 'image/png');
      expect(isValid).toBe(true);
    });

    it('validates PDF magic number', async () => {
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]);
      const file = new File([pdfBytes], 'test.pdf', { type: 'application/pdf' });
      const isValid = await validateFileSignature(file, 'application/pdf');
      expect(isValid).toBe(true);
    });
  });

  describe('SafeUrlRegistry', () => {
    it('creates and tracks object URLs', () => {
      const registry = new SafeUrlRegistry();
      // Mock createObjectURL
      let revoked: string[] = [];
      const origCreate = URL.createObjectURL;
      const origRevoke = URL.revokeObjectURL;
      URL.createObjectURL = () => 'blob:mock-url-1';
      URL.revokeObjectURL = (url) => revoked.push(url);

      const blob = new Blob(['test']);
      const url = registry.create(blob);
      expect(url).toBe('blob:mock-url-1');

      registry.revokeAll();
      expect(revoked).toContain('blob:mock-url-1');

      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    });
  });
});
