import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdSlot } from '@/components/ads/AdSense';
import {
  ConsentManager,
  saveConsent,
  getStoredConsent,
} from '@/components/consent/ConsentManager';
import {
  trackToolView,
  trackToolStart,
  trackToolComplete,
  trackToolError,
  trackFileDownload,
  trackToolSearch,
  trackRelatedToolClick,
  trackEvent,
} from '@/lib/analytics';
import DisclaimerPage from '@/app/disclaimer/page';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
import ContactPage from '@/app/contact/page';

describe('MONETIZATION, CONSENT & GA4 ANALYTICS SUITE', () => {
  beforeEach(() => {
    localStorage.clear();
    window.gtag = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AdSlot Component & AdSense Readiness', () => {
    it('does not render fake advertisement placeholders when client or slot ID is missing', () => {
      const { container } = render(<AdSlot slotId={undefined} />);
      expect(container.firstChild).toBeNull();
      expect(screen.queryByLabelText(/advertisement/i)).not.toBeInTheDocument();
    });

    it('renders with clear visual separation and reserved dimensions when IDs are configured', () => {
      // Temporarily mock environment variable
      const originalEnv = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = 'ca-pub-9999999999999999';

      try {
        render(
          <AdSlot
            slotId="1234567890"
            layout="banner"
            className="test-ad-class"
          />
        );

        const aside = screen.getByLabelText(/advertisement/i);
        expect(aside).toBeInTheDocument();
        expect(aside.tagName).toBe('ASIDE');
        expect(screen.getByText(/ADVERTISEMENT/i)).toBeInTheDocument();

        // Check for ins tag with adsbygoogle class
        const ins = aside.querySelector('ins.adsbygoogle');
        expect(ins).toBeInTheDocument();
        expect(ins).toHaveAttribute('data-ad-client', 'ca-pub-9999999999999999');
        expect(ins).toHaveAttribute('data-ad-slot', '1234567890');

        // By default without personalization consent, data-npa is set to 1
        expect(ins).toHaveAttribute('data-npa', '1');
      } finally {
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = originalEnv;
      }
    });
  });

  describe('Consent Management & Google Consent Mode v2', () => {
    it('initializes and saves consent choices to localStorage and syncs with gtag', () => {
      saveConsent({
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });

      const stored = getStoredConsent();
      expect(stored).not.toBeNull();
      expect(stored?.ad_storage).toBe('granted');
      expect(stored?.ad_personalization).toBe('granted');

      // Verify gtag consent update call
      expect(window.gtag).toHaveBeenCalledWith(
        'consent',
        'update',
        expect.objectContaining({
          ad_storage: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        })
      );
    });

    it('renders consent banner when no previous choice is recorded', () => {
      render(<ConsentManager />);
      expect(screen.getByRole('region', { name: /cookie & privacy consent/i })).toBeInTheDocument();
      expect(screen.getByText(/Accept All/i)).toBeInTheDocument();
      expect(screen.getByText(/Reject Non-Essential/i)).toBeInTheDocument();
      expect(screen.getByText(/Customize Options/i)).toBeInTheDocument();
    });

    it('rejects non-essential cookies and stores denied consent', () => {
      render(<ConsentManager />);
      const rejectBtn = screen.getByRole('button', { name: /reject non-essential/i });
      fireEvent.click(rejectBtn);

      const stored = getStoredConsent();
      expect(stored?.ad_storage).toBe('denied');
      expect(stored?.ad_personalization).toBe('denied');
      expect(stored?.analytics_storage).toBe('denied');

      // Banner should close
      expect(screen.queryByRole('region', { name: /cookie & privacy consent/i })).not.toBeInTheDocument();
    });

    it('opens customize options and saves selective consent', () => {
      render(<ConsentManager />);
      const customizeBtn = screen.getByRole('button', { name: /customize options/i });
      fireEvent.click(customizeBtn);

      expect(screen.getByText(/Performance & Analytics \(GA4\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Personalized Advertising \(Google AdSense\)/i)).toBeInTheDocument();

      const saveBtn = screen.getByRole('button', { name: /save preferences/i });
      fireEvent.click(saveBtn);

      expect(getStoredConsent()).not.toBeNull();
    });
  });

  describe('GA4 Events Integration (7/7 Events)', () => {
    it('1. trackToolView: sends tool view event without sensitive payloads', () => {
      trackToolView('word-counter', 'Word Counter', 'text');
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_view', {
        tool_id: 'word-counter',
        tool_name: 'Word Counter',
        tool_category: 'text',
      });
    });

    it('2. trackToolStart: records tool initiation', () => {
      trackToolStart('pdf-compressor', 'PDF Compressor', 'pdf');
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_start', {
        tool_id: 'pdf-compressor',
        tool_name: 'PDF Compressor',
        tool_category: 'pdf',
      });
    });

    it('3. trackToolComplete: records duration and completion', () => {
      trackToolComplete('image-compressor', 'Image Compressor', 'image', 142.6);
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_complete', {
        tool_id: 'image-compressor',
        tool_name: 'Image Compressor',
        tool_category: 'image',
        duration_ms: 143,
      });
    });

    it('4. trackToolError: sanitizes error strings preventing confidential leaks', () => {
      trackToolError('pdf-splitter', 'PDF Splitter', 'pdf', 'Corrupted header bytes in input file');
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_error', {
        tool_id: 'pdf-splitter',
        tool_name: 'PDF Splitter',
        tool_category: 'pdf',
        error_type: 'Corrupted header bytes in input file',
      });
    });

    it('5. trackFileDownload: captures file extension and size, never file contents', () => {
      trackFileDownload('pdf-merger', 'final-contract.pdf', 'application/pdf', 102400);
      expect(window.gtag).toHaveBeenCalledWith('event', 'file_download', {
        tool_id: 'pdf-merger',
        file_extension: 'pdf',
        file_type: 'application/pdf',
        file_size_kb: 100,
      });
    });

    it('6. trackToolSearch: records search term and count', () => {
      trackToolSearch('qr code', 1);
      expect(window.gtag).toHaveBeenCalledWith('event', 'tool_search', {
        search_term: 'qr code',
        results_count: 1,
      });
    });

    it('7. trackRelatedToolClick: tracks cross-tool navigation', () => {
      trackRelatedToolClick('word-counter', 'character-counter', 'text');
      expect(window.gtag).toHaveBeenCalledWith('event', 'related_tool_click', {
        current_tool_id: 'word-counter',
        target_tool_id: 'character-counter',
        tool_category: 'text',
      });
    });

    it('guards against transmitting massive strings (e.g. file content payloads)', () => {
      const massivePayload = 'A'.repeat(500);
      trackEvent('test_payload_guard', {
        safe_param: 'test',
        huge_param: massivePayload,
      });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_payload_guard', {
        safe_param: 'test',
        huge_param: 'A'.repeat(256),
      });
    });
  });

  describe('Legal, Privacy, Terms, Contact & Disclaimer Pages', () => {
    it('renders Disclaimer page with financial and advertising disclosures', () => {
      render(<DisclaimerPage />);
      expect(screen.getByRole('heading', { level: 1, name: /disclaimer/i })).toBeInTheDocument();
      expect(screen.getByText(/Not Certified Financial or Legal Advice/i)).toBeInTheDocument();
      expect(screen.getByText(/Third-Party Advertising & Monetization Disclosure/i)).toBeInTheDocument();
    });

    it('renders Privacy page with Consent Mode v2 and Manage Consent button', () => {
      render(<PrivacyPage />);
      expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument();
      expect(screen.getByText(/Zero-Upload Architecture/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Google Consent Mode v2/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /manage cookie & advertising preferences/i })).toBeInTheDocument();
    });

    it('renders Terms of Service page', () => {
      render(<TermsPage />);
      expect(screen.getByRole('heading', { level: 1, name: /terms of service/i })).toBeInTheDocument();
      expect(screen.getByText(/Permitted Use/i)).toBeInTheDocument();
      expect(screen.getByText(/Disclaimer of Warranties/i)).toBeInTheDocument();
    });

    it('renders Contact page and handles submission', () => {
      render(<ContactPage />);
      expect(screen.getByRole('heading', { level: 1, name: /contact & feedback/i })).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/your name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message \/ feedback/i);

      fireEvent.change(nameInput, { target: { value: 'Alex' } });
      fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Great suite of tools!' } });

      const submitBtn = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Message Received!/i)).toBeInTheDocument();
    });
  });
});
