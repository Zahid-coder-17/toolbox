import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Loading ToolBox...
      </span>
    </div>
  );
}
