import { ToolDefinition, FAQItem, ToolCategory, CategoryDefinition } from '@/config/tools';

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-1llw.vercel.app';
  return url.replace(/\/+$/, '');
}

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${cleanPath}`;
}

export function generateWebsiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolBox',
    url: siteUrl,
    description: 'Free, fast, and secure online utilities for text, images, PDFs, and financial calculations.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ToolBox',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'Provider of free, privacy-first online browser utilities for developers, designers, and professionals.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${siteUrl}/contact`,
    },
  };
}

function mapApplicationCategory(category: ToolCategory): string {
  switch (category) {
    case 'text':
      return 'UtilitiesApplication';
    case 'image':
      return 'DesignApplication';
    case 'pdf':
      return 'BusinessApplication';
    case 'calculators':
      return 'FinanceApplication';
    default:
      return 'UtilityApplication';
  }
}

export function generateWebApplicationSchema(tool: ToolDefinition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: getCanonicalUrl(tool.href),
    description: tool.longDescription,
    applicationCategory: mapApplicationCategory(tool.category),
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.features,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
  };
}

export function generateHowToSchema(tool: ToolDefinition) {
  if (!tool.howToSteps || tool.howToSteps.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name}`,
    description: `Step-by-step instructions to use ${tool.name} online for free.`,
    step: tool.howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${getCanonicalUrl(tool.href)}#step-${index + 1}`,
    })),
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  };
}

export function generateCollectionPageSchema(
  category: CategoryDefinition,
  tools: ToolDefinition[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — Free Online Utilities`,
    url: getCanonicalUrl(category.href),
    description: category.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.name,
        url: getCanonicalUrl(tool.href),
        description: tool.shortDescription,
      })),
    },
  };
}
