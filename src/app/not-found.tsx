import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <head>
        <title>404 — Page Not Found | ToolBox</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="text-6xl font-black text-blue-600 mb-2">404</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        Page or Utility Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        The tool or page you are looking for may have been moved, renamed, or is unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
