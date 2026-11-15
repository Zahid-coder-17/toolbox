'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, Settings2 } from 'lucide-react';

export interface ConsentSettings {
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
  timestamp?: number;
}

const STORAGE_KEY = 'toolbox_consent_settings';

export function getStoredConsent(): ConsentSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentSettings;
  } catch {
    return null;
  }
}

export function saveConsent(settings: ConsentSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, timestamp: Date.now() }));
    // Update gtag consent mode v2
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: settings.ad_storage,
        ad_user_data: settings.ad_user_data,
        ad_personalization: settings.ad_personalization,
        analytics_storage: settings.analytics_storage,
      });
    }
    // Dispatch custom event for AdSense & Analytics reactivity
    window.dispatchEvent(
      new CustomEvent('toolbox:consent-updated', { detail: settings })
    );
  } catch {
    // Ignore storage errors
  }
}

export function openConsentPreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toolbox:open-consent-modal'));
  }
}

export function ConsentManager() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    return getStoredConsent() === null;
  });
  const [showCustomize, setShowCustomize] = useState(false);
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [allowAds, setAllowAds] = useState(true);

  useEffect(() => {
    // Re-apply stored consent to gtag if present
    const existing = getStoredConsent();
    if (existing && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: existing.ad_storage,
        ad_user_data: existing.ad_user_data,
        ad_personalization: existing.ad_personalization,
        analytics_storage: existing.analytics_storage,
      });
    }

    const handleOpenModal = () => {
      const current = getStoredConsent();
      if (current) {
        setAllowAnalytics(current.analytics_storage === 'granted');
        setAllowAds(current.ad_storage === 'granted');
      }
      setShowCustomize(true);
      setIsOpen(true);
    };

    window.addEventListener('toolbox:open-consent-modal', handleOpenModal);
    return () => {
      window.removeEventListener('toolbox:open-consent-modal', handleOpenModal);
    };
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    setIsOpen(false);
    setShowCustomize(false);
  };

  const handleRejectAll = () => {
    saveConsent({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    setIsOpen(false);
    setShowCustomize(false);
  };

  const handleSaveCustom = () => {
    saveConsent({
      ad_storage: allowAds ? 'granted' : 'denied',
      ad_user_data: allowAds ? 'granted' : 'denied',
      ad_personalization: allowAds ? 'granted' : 'denied',
      analytics_storage: allowAnalytics ? 'granted' : 'denied',
    });
    setIsOpen(false);
    setShowCustomize(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs flex justify-center pointer-events-auto"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Privacy &amp; Cookie Preferences
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We respect your privacy. All 24 tools process your documents and data <strong>locally in your browser</strong> without server uploads. We use minimal cookies to analyze platform traffic and support our free services via Google AdSense under Google Consent Mode v2.
            </p>
          </div>
        </div>

        {showCustomize && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3 text-xs">
            {/* Essential */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Essential Browser Storage</span>
                <p className="text-slate-500">Required for in-memory tools and temporary downloads. Cannot be disabled.</p>
              </div>
              <span className="font-semibold text-slate-400">Always Active</span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="font-bold text-slate-800">Performance &amp; Analytics (GA4)</span>
                <p className="text-slate-500">Anonymous metrics (tool usage count and errors) to help us improve features.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAnalytics}
                  onChange={(e) => setAllowAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Advertising */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Personalized Advertising (Google AdSense)</span>
                <p className="text-slate-500">Allows Google to show relevant advertising. When off, non-personalized ads are shown.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAds}
                  onChange={(e) => setAllowAds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>{showCustomize ? 'Hide Customization' : 'Customize Options'}</span>
          </button>

          <div className="flex items-center gap-2">
            {showCustomize ? (
              <Button size="sm" onClick={handleSaveCustom}>
                Save Preferences
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleRejectAll}>
                  Reject Non-Essential
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
