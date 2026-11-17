import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Target paths: /admin, /admin/*, /api/seo/*
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProtectedApiRoute = pathname.startsWith('/api/seo/');

  if (!isAdminRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  // Fail closed if server credentials are not configured or empty
  if (!expectedUser || !expectedPass || expectedUser.trim() === '' || expectedPass.trim() === '') {
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ToolBox Admin", charset="UTF-8"',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ToolBox Admin", charset="UTF-8"',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }

  try {
    const base64Credentials = authHeader.slice(6).trim();
    const decoded = atob(base64Credentials);
    const colonIndex = decoded.indexOf(':');

    if (colonIndex === -1) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="ToolBox Admin", charset="UTF-8"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    if (safeCompare(username, expectedUser) && safeCompare(password, expectedPass)) {
      return NextResponse.next();
    }

    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ToolBox Admin", charset="UTF-8"',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return new NextResponse('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="ToolBox Admin", charset="UTF-8"',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/seo/:path*'],
};
