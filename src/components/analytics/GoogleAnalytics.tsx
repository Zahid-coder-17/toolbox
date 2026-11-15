'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { getStoredConsent } from '@/components/consent/ConsentManager';

export function GoogleAnalyticsScript() {
  useEffect(() => {
    // Check if consent was previously stored and sync on load
    const stored = getStoredConsent();
    if (stored && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: stored.ad_storage,
        ad_user_data: stored.ad_user_data,
        ad_personalization: stored.ad_personalization,
        analytics_storage: stored.analytics_storage,
      });
    }
  }, []);

  return (
    <>
      {/* 1. Google Consent Mode v2 Initializer (runs privacy-first default 'denied' before any tags) */}
      <script
        id="google-consent-default"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* 2. GA4 Measurement Tag (Only loads if GA ID configured) */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  anonymize_ip: true
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
