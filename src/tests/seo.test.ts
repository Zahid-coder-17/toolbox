import { describe, it, expect } from 'vitest';
import { TOOLS, CATEGORIES, ToolCategory } from '@/config/tools';
import {
  getSiteUrl,
  getCanonicalUrl,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateArticleSchema,
} from '@/lib/seo';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

describe('PRODUCTION SEO & STRUCTURED DATA SUITE', () => {
  describe('Domain & Canonical URLs', () => {
    it('normalizes domain without trailing slash', () => {
      const siteUrl = getSiteUrl();
      expect(siteUrl).not.toMatch(/\/$/);
      expect(siteUrl.startsWith('http')).toBe(true);
    });

    it('generates valid canonical URLs without malformed path duplication', () => {
      const toolCanonical = getCanonicalUrl('/tools/text/word-counter');
      expect(toolCanonical).toBe(`${getSiteUrl()}/tools/text/word-counter`);

      const categoryCanonical = getCanonicalUrl('category/image');
      expect(categoryCanonical).toBe(`${getSiteUrl()}/category/image`);

      const rootCanonical = getCanonicalUrl('/');
      expect(rootCanonical).toBe(`${getSiteUrl()}/`);
    });
  });

  describe('Unique Tool Metadata (24/24)', () => {
    it('has exactly 24 registered tools across the 4 categories', () => {
      expect(TOOLS.length).toBe(24);
      const categoryCounts: Record<ToolCategory, number> = {
        text: 0,
        image: 0,
        pdf: 0,
        calculators: 0,
      };
      TOOLS.forEach((t) => {
        categoryCounts[t.category]++;
      });
      expect(categoryCounts.text).toBe(8);
      expect(categoryCounts.image).toBe(8);
      expect(categoryCounts.pdf).toBe(4);
      expect(categoryCounts.calculators).toBe(4);
    });

    it('ensures every tool has unique metaTitle and metaDescription with no duplication', () => {
      const titles = new Set<string>();
      const descriptions = new Set<string>();
      const slugs = new Set<string>();
      const hrefs = new Set<string>();

      TOOLS.forEach((tool) => {
        expect(tool.metaTitle).toBeTruthy();
        expect(tool.metaDescription).toBeTruthy();

        // Check uniqueness
        expect(titles.has(tool.metaTitle)).toBe(false);
        expect(descriptions.has(tool.metaDescription)).toBe(false);
        expect(slugs.has(tool.slug)).toBe(false);
        expect(hrefs.has(tool.href)).toBe(false);

        titles.add(tool.metaTitle);
        descriptions.add(tool.metaDescription);
        slugs.add(tool.slug);
        hrefs.add(tool.href);

        // Meaningful lengths (prevent empty or thin metadata)
        expect(tool.metaTitle.length).toBeGreaterThan(20);
        expect(tool.metaDescription.length).toBeGreaterThan(50);
      });
    });

    it('verifies all tools contain original descriptions, instructions, FAQs, and keywords', () => {
      TOOLS.forEach((tool) => {
        expect(tool.shortDescription.length).toBeGreaterThan(20);
        expect(tool.longDescription.length).toBeGreaterThan(40);
        expect(tool.keywords.length).toBeGreaterThanOrEqual(3);
        expect(tool.features.length).toBeGreaterThanOrEqual(3);
        expect(tool.howToSteps.length).toBeGreaterThanOrEqual(3);
        expect(tool.faqs.length).toBeGreaterThanOrEqual(2);

        tool.howToSteps.forEach((step) => {
          expect(step.name.trim()).toBeTruthy();
          expect(step.text.trim()).toBeTruthy();
        });

        tool.faqs.forEach((faq) => {
          expect(faq.question.trim()).toBeTruthy();
          expect(faq.answer.trim()).toBeTruthy();
        });
      });
    });
  });

  describe('Category Definitions & Landing Pages', () => {
    it('verifies all 4 categories have accurate toolCounts and valid metadata', () => {
      const categoryKeys = Object.keys(CATEGORIES) as ToolCategory[];
      expect(categoryKeys.length).toBe(4);

      categoryKeys.forEach((catKey) => {
        const cat = CATEGORIES[catKey];
        expect(cat.name).toBeTruthy();
        expect(cat.href).toBe(`/category/${catKey}`);
        expect(cat.description.length).toBeGreaterThan(30);

        const actualTools = TOOLS.filter((t) => t.category === catKey);
        expect(actualTools.length).toBe(cat.toolCount);
      });
    });
  });

  describe('Structured Data JSON-LD Schemas', () => {
    it('generates truthful Organization schema', () => {
      const schema = generateOrganizationSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('ToolBox');
      expect(schema.url).toBe(getSiteUrl());
      expect(schema.contactPoint['@type']).toBe('ContactPoint');
    });

    it('generates WebSite JSON-LD Schema with SearchAction', () => {
      const schema = generateWebsiteSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('ToolBox');
      expect(schema.potentialAction['@type']).toBe('SearchAction');
      expect(schema.potentialAction.target).toContain('?q={search_term_string}');
    });

    it('generates appropriate WebApplication schema for every tool with specialized categories', () => {
      TOOLS.forEach((tool) => {
        const schema = generateWebApplicationSchema(tool);
        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('WebApplication');
        expect(schema.name).toBe(tool.name);
        expect(schema.url).toBe(getCanonicalUrl(tool.href));
        expect(schema.offers.price).toBe('0');
        expect(schema.operatingSystem).toBe('All');

        if (tool.category === 'text') {
          expect(schema.applicationCategory).toBe('UtilitiesApplication');
        } else if (tool.category === 'image') {
          expect(schema.applicationCategory).toBe('DesignApplication');
        } else if (tool.category === 'pdf') {
          expect(schema.applicationCategory).toBe('BusinessApplication');
        } else if (tool.category === 'calculators') {
          expect(schema.applicationCategory).toBe('FinanceApplication');
        }
      });
    });

    it('generates HowTo schema with sequential steps and anchors', () => {
      TOOLS.forEach((tool) => {
        const schema = generateHowToSchema(tool);
        expect(schema).not.toBeNull();
        if (schema) {
          expect(schema['@type']).toBe('HowTo');
          expect(schema.step.length).toBe(tool.howToSteps.length);
          schema.step.forEach((st, idx) => {
            expect(st.position).toBe(idx + 1);
            expect(st.url).toContain(`#step-${idx + 1}`);
          });
        }
      });
    });

    it('generates FAQPage schema with questions and accepted answers', () => {
      TOOLS.forEach((tool) => {
        const schema = generateFAQSchema(tool.faqs);
        expect(schema).not.toBeNull();
        if (schema) {
          expect(schema['@type']).toBe('FAQPage');
          expect(schema.mainEntity.length).toBe(tool.faqs.length);
          schema.mainEntity.forEach((q) => {
            expect(q['@type']).toBe('Question');
            expect(q.acceptedAnswer['@type']).toBe('Answer');
          });
        }
      });
    });

    it('generates BreadcrumbList schema with sequential positions', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Text Utilities', url: '/category/text' },
        { name: 'Word Counter', url: '/tools/text/word-counter' },
      ];
      const schema = generateBreadcrumbSchema(breadcrumbs);
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement.length).toBe(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].item).toBe(`${getSiteUrl()}/`);
      expect(schema.itemListElement[2].name).toBe('Word Counter');
      expect(schema.itemListElement[2].item).toBe(`${getSiteUrl()}/tools/text/word-counter`);
    });

    it('generates CollectionPage schema for category landing hubs', () => {
      const textCategory = CATEGORIES.text;
      const textTools = TOOLS.filter((t) => t.category === 'text');
      const schema = generateCollectionPageSchema(textCategory, textTools);

      expect(schema['@type']).toBe('CollectionPage');
      expect(schema.name).toContain('Text Utilities');
      expect(schema.mainEntity['@type']).toBe('ItemList');
      expect(schema.mainEntity.itemListElement.length).toBe(8);
      expect(schema.mainEntity.itemListElement[0].url).toContain('/tools/text/');
    });

    it('generates valid Article JSON-LD schema for educational guides', () => {
      const sampleArticle = {
        title: 'How to Compress Images',
        description: 'Complete guide to WebP compression.',
        slug: 'how-to-compress-images',
        datePublished: '2026-11-17T08:00:00Z',
        dateModified: '2026-11-17T08:00:00Z',
        author: { name: 'ToolBox Engineering', role: 'Staff Engineer' },
      };
      const schema = generateArticleSchema(sampleArticle);
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('How to Compress Images');
      expect(schema.author.name).toBe('ToolBox Engineering');
      expect(schema.publisher.name).toBe('ToolBox');
      expect(schema.url).toContain('/blog/how-to-compress-images');
    });
  });

  describe('Sitemap & Robots.txt', () => {
    it('generates complete XML sitemap covering all production endpoints', () => {
      const entries = sitemap();
      // 1 root + 4 categories + 24 tools + 1 blog + 4 articles + 5 legal/info = 39
      expect(entries.length).toBe(39);

      const urls = entries.map((e) => e.url);
      const siteUrl = getSiteUrl();

      // Check root (matches canonical domain)
      expect(urls.includes(siteUrl) || urls.includes(`${siteUrl}/`)).toBe(true);

      // Check all 4 categories
      Object.values(CATEGORIES).forEach((cat) => {
        expect(urls).toContain(`${siteUrl}${cat.href}`);
      });

      // Check all 24 tools
      TOOLS.forEach((tool) => {
        expect(urls).toContain(`${siteUrl}${tool.href}`);
      });

      // Check Blog and Educational Articles
      expect(urls).toContain(`${siteUrl}/blog`);
      expect(urls).toContain(`${siteUrl}/blog/how-to-compress-images-without-losing-quality`);
      expect(urls).toContain(`${siteUrl}/blog/guide-to-merging-pdfs-securely`);
      expect(urls).toContain(`${siteUrl}/blog/understanding-loan-emi-amortization`);
      expect(urls).toContain(`${siteUrl}/blog/calculating-reading-time-and-speaking-speed`);

      // Check info pages
      expect(urls).toContain(`${siteUrl}/privacy`);
      expect(urls).toContain(`${siteUrl}/terms`);
      expect(urls).toContain(`${siteUrl}/disclaimer`);
      expect(urls).toContain(`${siteUrl}/about`);
      expect(urls).toContain(`${siteUrl}/contact`);

      // Ensure no placeholder or invalid URLs
      urls.forEach((u) => {
        expect(u.startsWith(siteUrl)).toBe(true);
        expect(u).not.toContain('undefined');
        expect(u).not.toContain('null');
        expect(u).not.toContain('//tools');
        expect(u).not.toContain('//category');
        expect(u).not.toContain('//blog');
      });
    });

    it('generates robots.txt granting full indexation and referencing sitemap', () => {
      const robotConfig = robots();
      expect(robotConfig.rules).toBeDefined();
      expect(robotConfig.sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
      const rules = Array.isArray(robotConfig.rules) ? robotConfig.rules[0] : robotConfig.rules;
      expect(rules.disallow).toContain('/api/');
      expect(rules.disallow).toContain('/admin/');
    });
  });
});
