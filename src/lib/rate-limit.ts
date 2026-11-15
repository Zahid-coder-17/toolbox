/**
 * In-memory sliding window rate limiter for Next.js API endpoints.
 * Protects endpoints from burst denial-of-service and brute force queries.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  intervalMs?: number; // Time window (default: 60,000 ms = 1 min)
  maxRequests?: number; // Max requests per window (default: 60)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const intervalMs = options.intervalMs || 60000;
  const maxRequests = options.maxRequests || 60;
  const now = Date.now();

  const record = ipRequestMap.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + intervalMs,
    };
    ipRequestMap.set(identifier, newRecord);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Cleanup stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipRequestMap.entries()) {
      if (now > value.resetTime) {
        ipRequestMap.delete(key);
      }
    }
  }, 120000);
}
