import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware, safeCompare } from '@/middleware';

describe('ADMIN HTTP BASIC AUTHENTICATION SECURITY SUITE', () => {
  const originalEnv = process.env;
  const TEST_USER = 'security_test_admin';
  const TEST_PASS = 'Test_Password_#2026_Secure';

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ADMIN_USERNAME = TEST_USER;
    process.env.ADMIN_PASSWORD = TEST_PASS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createRequest(url: string, authHeader?: string): NextRequest {
    const headers = new Headers();
    if (authHeader) {
      headers.set('authorization', authHeader);
    }
    return new NextRequest(new URL(url, 'https://toolbox-1llw.vercel.app'), {
      headers,
    });
  }

  function encodeBasicAuth(u: string, p: string): string {
    return `Basic ${btoa(`${u}:${p}`)}`;
  }

  describe('Constant-Time Comparison', () => {
    it('compares identical strings correctly', () => {
      expect(safeCompare('secret123', 'secret123')).toBe(true);
    });

    it('rejects strings of different lengths immediately', () => {
      expect(safeCompare('secret123', 'secret12')).toBe(false);
      expect(safeCompare('secret12', 'secret123')).toBe(false);
    });

    it('rejects strings with identical lengths but different characters', () => {
      expect(safeCompare('secret123', 'secret124')).toBe(false);
    });

    it('handles non-string arguments safely', () => {
      // @ts-expect-error Testing non-string input
      expect(safeCompare(null, 'secret123')).toBe(false);
      // @ts-expect-error Testing non-string input
      expect(safeCompare('secret123', undefined)).toBe(false);
    });
  });

  describe('Unauthenticated Admin Requests', () => {
    it('returns HTTP 401 and challenge when Authorization header is missing on /admin/seo', () => {
      const req = createRequest('/admin/seo');
      const res = middleware(req);

      expect(res.status).toBe(401);
      expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="ToolBox Admin"');
      expect(res.headers.get('Cache-Control')).toBe('no-store, max-age=0');
    });

    it('returns HTTP 401 when visiting base /admin route', () => {
      const req = createRequest('/admin');
      const res = middleware(req);

      expect(res.status).toBe(401);
      expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="ToolBox Admin"');
    });

    it('returns HTTP 401 for protected SEO API route /api/seo/gsc', () => {
      const req = createRequest('/api/seo/gsc');
      const res = middleware(req);

      expect(res.status).toBe(401);
      expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="ToolBox Admin"');
    });
  });

  describe('Credential Validation', () => {
    it('rejects requests with incorrect username', () => {
      const req = createRequest('/admin/seo', encodeBasicAuth('wrong_admin', TEST_PASS));
      const res = middleware(req);

      expect(res.status).toBe(401);
      expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="ToolBox Admin"');
    });

    it('rejects requests with incorrect password', () => {
      const req = createRequest('/admin/seo', encodeBasicAuth(TEST_USER, 'wrong_password'));
      const res = middleware(req);

      expect(res.status).toBe(401);
      expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="ToolBox Admin"');
    });

    it('rejects malformed authorization header without colon', () => {
      const req = createRequest('/admin/seo', `Basic ${btoa('invalid_no_colon')}`);
      const res = middleware(req);

      expect(res.status).toBe(401);
    });

    it('rejects non-Basic authorization schemes (e.g. Bearer)', () => {
      const req = createRequest('/admin/seo', 'Bearer some-random-token');
      const res = middleware(req);

      expect(res.status).toBe(401);
    });

    it('permits access when correct credentials are provided', () => {
      const req = createRequest('/admin/seo', encodeBasicAuth(TEST_USER, TEST_PASS));
      const res = middleware(req);

      // NextResponse.next() returns a response without 401 status
      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });

    it('permits access to protected API when correct credentials are provided', () => {
      const req = createRequest('/api/seo/gsc', encodeBasicAuth(TEST_USER, TEST_PASS));
      const res = middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });
  });

  describe('Fail-Closed Behavior When Server Is Unconfigured', () => {
    it('returns HTTP 401 when ADMIN_USERNAME is missing from environment', () => {
      delete process.env.ADMIN_USERNAME;
      const req = createRequest('/admin/seo', encodeBasicAuth(TEST_USER, TEST_PASS));
      const res = middleware(req);

      expect(res.status).toBe(401);
    });

    it('returns HTTP 401 when ADMIN_PASSWORD is missing from environment', () => {
      delete process.env.ADMIN_PASSWORD;
      const req = createRequest('/admin/seo', encodeBasicAuth(TEST_USER, TEST_PASS));
      const res = middleware(req);

      expect(res.status).toBe(401);
    });

    it('returns HTTP 401 when environment variables are empty strings', () => {
      process.env.ADMIN_USERNAME = '   ';
      process.env.ADMIN_PASSWORD = '   ';
      const req = createRequest('/admin/seo', encodeBasicAuth('', ''));
      const res = middleware(req);

      expect(res.status).toBe(401);
    });
  });

  describe('Public Routes Accessibility (No False Interceptions)', () => {
    it('allows public homepage / without authentication', () => {
      const req = createRequest('/');
      const res = middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });

    it('allows public tools such as /tools/text/word-counter without authentication', () => {
      const req = createRequest('/tools/text/word-counter');
      const res = middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });

    it('allows public blog hub /blog without authentication', () => {
      const req = createRequest('/blog');
      const res = middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });

    it('allows public API route /api/health without authentication', () => {
      const req = createRequest('/api/health');
      const res = middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('WWW-Authenticate')).toBeNull();
    });
  });

  describe('Zero Credential Leakage in Responses', () => {
    it('never exposes ADMIN_USERNAME or ADMIN_PASSWORD in response body or headers', async () => {
      const req = createRequest('/admin/seo', encodeBasicAuth('wrong_user', 'wrong_pass'));
      const res = middleware(req);
      const text = await res.text();

      expect(text).not.toContain(TEST_USER);
      expect(text).not.toContain(TEST_PASS);

      res.headers.forEach((value, key) => {
        expect(key.toLowerCase()).not.toContain('password');
        expect(value).not.toContain(TEST_USER);
        expect(value).not.toContain(TEST_PASS);
      });
    });
  });
});
