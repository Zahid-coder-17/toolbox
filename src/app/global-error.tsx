'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">An unexpected error occurred</h2>
          <p className="text-xs text-slate-500 mt-2">
            The application encountered a runtime issue. Please try refreshing or resetting the application state.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
