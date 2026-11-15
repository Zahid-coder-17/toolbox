import { describe, it, expect } from 'vitest';
import { TOOLS, CATEGORIES } from '@/config/tools';
import {
  getCanonicalUrl,
  generateWebsiteSchema,
  generateWebApplicationSchema,
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo';

describe('SEO & Structured Data Utilities', () => {
  it('generates valid canonical URLs', () => {
    expect(getCanonicalUrl('/tools/text/word-counter')).toContain('/tools/text/word-counter');
    expect(getCanonicalUrl('category/image')).toContain('/category/image');
  });

  it('generates WebSite JSON-LD Schema with SearchAction', () => {
    const schema = generateWebsiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe('ToolBox');
    expect(schema.potentialAction['@type']).toBe('SearchAction');
  });

  it('generates WebApplication schema for every tool', () => {
    TOOLS.forEach((tool) => {
      const schema = generateWebApplicationSchema(tool);
      expect(schema['@type']).toBe('WebApplication');
      expect(schema.name).toBe(tool.name);
      expect(schema.applicationCategory).toBe('UtilityApplication');
      expect(schema.offers.price).toBe('0');
    });
  });

  it('generates HowTo schema for every tool with steps', () => {
    TOOLS.forEach((tool) => {
      const schema = generateHowToSchema(tool);
      expect(schema).not.toBeNull();
      if (schema) {
        expect(schema['@type']).toBe('HowTo');
        expect(schema.step.length).toBeGreaterThan(0);
      }
    });
  });

  it('generates FAQPage schema for tools with FAQs', () => {
    TOOLS.forEach((tool) => {
      const schema = generateFAQSchema(tool.faqs);
      expect(schema).not.toBeNull();
      if (schema) {
        expect(schema['@type']).toBe('FAQPage');
        expect(schema.mainEntity.length).toBeGreaterThan(0);
      }
    });
  });

  it('generates valid BreadcrumbList schema', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Text Utilities', url: '/category/text' },
      { name: 'Word Counter', url: '/tools/text/word-counter' },
    ];
    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement.length).toBe(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[2].name).toBe('Word Counter');
  });
});
