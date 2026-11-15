'use client';

import React, { useEffect } from 'react';

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  if (!CLIENT_ID) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}

interface AdUnitProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export function AdUnit({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
}: AdUnitProps) {
  useEffect(() => {
    if (!CLIENT_ID || !slotId) return;
    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error - adsbygoogle global queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore adsbygoogle push error if script is blocked by ad blocker
    }
  }, [slotId]);

  // If no AdSense publisher ID is configured, do not render intrusive placeholder ads
  if (!CLIENT_ID || !slotId) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50/50 p-2 text-center ${className}`}
    >
      <span className="mb-1 text-[10px] font-medium tracking-wider text-slate-400 uppercase select-none">
        Advertisement
      </span>
      <div className="w-full min-h-[90px] flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
}
