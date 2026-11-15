'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {error.message || 'An unexpected error occurred while loading this utility.'}
      </p>

      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="md">
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
