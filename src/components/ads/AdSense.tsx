'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { getStoredConsent, ConsentSettings } from '@/components/consent/ConsentManager';

export function AdSenseScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-6319866397206659';

  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}

export interface AdSlotProps {
  clientId?: string;
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  layout?: 'banner' | 'in-article' | 'rectangle' | 'footer';
  responsive?: boolean;
  className?: string;
}

/**
 * Production-ready, CLS-safe AdSlot component.
 *
 * Requirements:
 * - Uses environment configuration for publisher ID and slot IDs.
 * - Reserved layout dimensions to eliminate Cumulative Layout Shift (CLS).
 * - Clear semantic (<aside>) and visual separation from tool controls.
 * - Respects Google Consent Mode v2 (serves non-personalized ads when personalization is denied).
 * - Never displays deceptive, fake, or unapproved ad placeholders when IDs are missing.
 */
export function AdSlot({
  clientId,
  slotId,
  format = 'auto',
  layout = 'banner',
  responsive = true,
  className = '',
}: AdSlotProps) {
  const activeClientId = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-6319866397206659';
  const [isNpa, setIsNpa] = useState<boolean>(() => {
    const consent = getStoredConsent();
    return consent ? consent.ad_personalization !== 'granted' : true;
  });

  useEffect(() => {
    // Listen to live consent updates
    const handleConsentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentSettings>;
      if (customEvent.detail) {
        setIsNpa(customEvent.detail.ad_personalization !== 'granted');
      }
    };

    window.addEventListener('toolbox:consent-updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('toolbox:consent-updated', handleConsentUpdate);
    };
  }, []);

  useEffect(() => {
    if (!activeClientId || !slotId) return;

    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error - Google AdSense push queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Gracefully catch push errors (e.g. ad blockers or strict browser privacy)
    }
  }, [activeClientId, slotId]);

  // If no AdSense publisher ID or slot ID is configured, do not render empty or fake placeholder ads
  if (!activeClientId || !slotId) {
    return null;
  }

  // Pre-calculated minimum layout dimensions to prevent Cumulative Layout Shift (CLS)
  const getContainerDimensionClass = () => {
    switch (layout) {
      case 'banner':
      case 'footer':
        return 'min-h-[90px] sm:min-h-[100px] max-w-[728px]';
      case 'rectangle':
        return 'min-h-[250px] max-w-[300px]';
      case 'in-article':
      default:
        return 'min-h-[120px] sm:min-h-[280px] max-w-full';
    }
  };

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/40 p-2 sm:p-3 text-center mx-auto ${className}`}
    >
      <span className="mb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none">
        Advertisement
      </span>
      <div className={`w-full flex items-center justify-center ${getContainerDimensionClass()}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={activeClientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
          data-npa={isNpa ? '1' : undefined}
        />
      </div>
    </aside>
  );
}

// Backwards-compatible export
export const AdUnit = AdSlot;
