import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  // Use client IP or fallback identifier
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const { allowed, remaining, resetTime } = checkRateLimit(ip, {
    intervalMs: 60000,
    maxRequests: 30,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return NextResponse.json(
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      toolsActive: 24,
    },
    {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      },
    }
  );
}
