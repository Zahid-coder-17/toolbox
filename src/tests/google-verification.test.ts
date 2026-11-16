import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Layout Metadata & Google Verification', () => {
  const originalEnv = process.env.GOOGLE_SITE_VERIFICATION;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.GOOGLE_SITE_VERIFICATION = originalEnv;
    } else {
      delete process.env.GOOGLE_SITE_VERIFICATION;
    }
    vi.resetModules();
  });

  it('includes verification.google when GOOGLE_SITE_VERIFICATION is present', async () => {
    process.env.GOOGLE_SITE_VERIFICATION = 'abc_123_XYZ_test_verification_token';
    const { metadata } = await import('@/app/layout');
    expect(metadata.verification).toBeDefined();
    expect(metadata.verification?.google).toBe('abc_123_XYZ_test_verification_token');

    // Confirm rendered HTML meta tag attributes match Next.js specification
    // Next.js maps `verification.google` to <meta name="google-site-verification" content="..." />
    const metaTagDefinition = {
      name: 'google-site-verification',
      content: metadata.verification?.google,
    };
    expect(metaTagDefinition.name).toBe('google-site-verification');
    expect(metaTagDefinition.content).toBe('abc_123_XYZ_test_verification_token');
  });

  it('omits verification when GOOGLE_SITE_VERIFICATION is absent', async () => {
    delete process.env.GOOGLE_SITE_VERIFICATION;
    const { metadata } = await import('@/app/layout');
    expect(metadata.verification).toBeUndefined();
  });

  it('omits verification when GOOGLE_SITE_VERIFICATION is empty or whitespace', async () => {
    process.env.GOOGLE_SITE_VERIFICATION = '   ';
    const { metadata } = await import('@/app/layout');
    expect(metadata.verification).toBeUndefined();
  });

  it('extracts token when full HTML meta tag is supplied in GOOGLE_SITE_VERIFICATION', async () => {
    process.env.GOOGLE_SITE_VERIFICATION =
      '<meta name="google-site-verification" content="qf7HT7T3pytnY-zGWN3M0FPJDApE-jKAU8K5HDHcFJ0" />';
    const { metadata } = await import('@/app/layout');
    expect(metadata.verification).toBeDefined();
    expect(metadata.verification?.google).toBe('qf7HT7T3pytnY-zGWN3M0FPJDApE-jKAU8K5HDHcFJ0');
  });
});
