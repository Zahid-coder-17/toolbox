import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  TOOLS,
  CATEGORIES,
  getToolBySlug,
  getToolsByCategory,
  searchTools,
} from '@/config/tools';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ToolCard } from '@/components/ui/tool-card';

// Mock usePathname for Header
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Phase 1: Central Tool Registry Tests', () => {
  it('contains exactly 24 tools registered', () => {
    expect(TOOLS.length).toBe(24);
  });

  it('contains all 4 required categories with exact tool counts', () => {
    expect(Object.keys(CATEGORIES)).toEqual(['text', 'image', 'pdf', 'calculators']);

    const textTools = getToolsByCategory('text');
    const imageTools = getToolsByCategory('image');
    const pdfTools = getToolsByCategory('pdf');
    const calculatorTools = getToolsByCategory('calculators');

    expect(textTools.length).toBe(8);
    expect(imageTools.length).toBe(8);
    expect(pdfTools.length).toBe(4);
    expect(calculatorTools.length).toBe(4);
    expect(textTools.length + imageTools.length + pdfTools.length + calculatorTools.length).toBe(24);
  });

  it('verifies every tool has complete SEO metadata, how-to steps, and FAQs', () => {
    const slugSet = new Set<string>();

    TOOLS.forEach((tool) => {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.slug).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.href).toBe(`/tools/${tool.category}/${tool.slug}`);
      expect(tool.shortDescription).toBeTruthy();
      expect(tool.longDescription).toBeTruthy();
      expect(tool.iconName).toBeTruthy();
      expect(tool.keywords.length).toBeGreaterThan(0);
      expect(tool.features.length).toBeGreaterThan(0);
      expect(tool.howToSteps.length).toBeGreaterThan(0);
      expect(tool.faqs.length).toBeGreaterThan(0);
      expect(tool.metaTitle).toBeTruthy();
      expect(tool.metaDescription).toBeTruthy();

      // Ensure slug uniqueness
      expect(slugSet.has(tool.slug)).toBe(false);
      slugSet.add(tool.slug);
    });
  });

  it('retrieves tools by slug and searches correctly', () => {
    const wordCounter = getToolBySlug('word-counter');
    expect(wordCounter).toBeDefined();
    expect(wordCounter?.name).toBe('Word Counter');

    const searchResults = searchTools('pdf');
    expect(searchResults.length).toBeGreaterThanOrEqual(4);
    expect(searchResults.some((t) => t.id === 'pdf-merger')).toBe(true);
  });
});

describe('Phase 1: Navigation & Layout Component Tests', () => {
  it('renders Header with branding, category links, and quick search button', () => {
    render(<Header />);

    // Brand
    expect(screen.getByRole('link', { name: /^ToolBox$/i })).toBeInTheDocument();

    // Category navigation links
    expect(screen.getByRole('link', { name: /^Text$/i })).toHaveAttribute('href', '/category/text');
    expect(screen.getByRole('link', { name: /^Image$/i })).toHaveAttribute('href', '/category/image');
    expect(screen.getByRole('link', { name: /^PDF$/i })).toHaveAttribute('href', '/category/pdf');
    expect(screen.getByRole('link', { name: /^Calculators$/i })).toHaveAttribute('href', '/category/calculators');

    // Quick search trigger
    const searchBtn = screen.getByRole('button', { name: /search tools/i });
    expect(searchBtn).toBeInTheDocument();
  });

  it('toggles mobile menu responsive navigation on mobile viewport', () => {
    render(<Header />);
    const toggleBtn = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(toggleBtn);

    // Mobile links should now be visible
    expect(screen.getByRole('link', { name: /Text Utilities/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Image Utilities/i })).toBeInTheDocument();
  });

  it('renders Breadcrumbs with Home and category links', () => {
    render(
      <Breadcrumbs
        items={[
          { name: 'Text Utilities', url: '/category/text' },
          { name: 'Word Counter', url: '/tools/text/word-counter' },
        ]}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Text Utilities')).toBeInTheDocument();
    expect(screen.getByText('Word Counter')).toBeInTheDocument();
  });

  it('renders ToolCard with icon, description, and launch link', () => {
    const tool = getToolBySlug('word-counter')!;
    render(<ToolCard tool={tool} />);

    expect(screen.getByText('Word Counter')).toBeInTheDocument();
    expect(screen.getByText(tool.shortDescription)).toBeInTheDocument();
    expect(screen.getByText(/Launch tool/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/tools/text/word-counter');
  });

  it('renders Footer with trust assurance, categories, and legal page links', () => {
    render(<Footer />);

    expect(screen.getByText(/Zero server uploads/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /About ToolBox/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /Contact & Feedback/i })).toHaveAttribute('href', '/contact');
  });
});
