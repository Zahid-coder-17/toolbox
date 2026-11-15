/**
 * ToolBox Security & Input Validation Utilities
 * Client-first defense in depth: validates file magic bytes, restricts file sizes,
 * prevents XSS, and safely manages object URLs.
 */

export const MAX_FILE_SIZES = {
  IMAGE: 25 * 1024 * 1024, // 25 MB
  PDF: 50 * 1024 * 1024, // 50 MB
  TEXT: 10 * 1024 * 1024, // 10 MB
};

export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates file signature (magic numbers) to prevent file extension spoofing
 */
export async function validateFileSignature(
  file: File,
  expectedType: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'image/heic'
): Promise<boolean> {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    switch (expectedType) {
      case 'image/jpeg':
        // JPEG magic number: FF D8 FF
        return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

      case 'image/png':
        // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
        return (
          bytes[0] === 0x89 &&
          bytes[1] === 0x50 &&
          bytes[2] === 0x4e &&
          bytes[3] === 0x47 &&
          bytes[4] === 0x0d &&
          bytes[5] === 0x0a &&
          bytes[6] === 0x1a &&
          bytes[7] === 0x0a
        );

      case 'application/pdf':
        // PDF magic number: %PDF- (25 50 44 46 2D)
        return (
          bytes[0] === 0x25 &&
          bytes[1] === 0x50 &&
          bytes[2] === 0x44 &&
          bytes[3] === 0x46 &&
          bytes[4] === 0x2d
        );

      case 'image/webp':
        // WebP starts with RIFF (52 49 46 46) and bytes 8-11 are WEBP (57 45 42 50)
        return (
          bytes[0] === 0x52 &&
          bytes[1] === 0x49 &&
          bytes[2] === 0x46 &&
          bytes[3] === 0x46 &&
          bytes[8] === 0x57 &&
          bytes[9] === 0x45 &&
          bytes[10] === 0x42 &&
          bytes[11] === 0x50
        );

      case 'image/heic':
        // HEIC has ftyp at byte 4-7: 66 74 79 70
        return (
          bytes[4] === 0x66 &&
          bytes[5] === 0x74 &&
          bytes[6] === 0x79 &&
          bytes[7] === 0x70
        );

      default:
        return true;
    }
  } catch {
    return false;
  }
}

/**
 * Safe Object URL manager that automatically tracks and cleans up URLs to prevent memory leaks
 */
export class SafeUrlRegistry {
  private urls: Set<string> = new Set();

  create(blobOrFile: Blob | File): string {
    const url = URL.createObjectURL(blobOrFile);
    this.urls.add(url);
    return url;
  }

  revoke(url: string): void {
    if (this.urls.has(url)) {
      URL.revokeObjectURL(url);
      this.urls.delete(url);
    }
  }

  revokeAll(): void {
    for (const url of this.urls) {
      URL.revokeObjectURL(url);
    }
    this.urls.clear();
  }
}
