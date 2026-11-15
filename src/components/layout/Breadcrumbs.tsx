import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];
  const jsonLd = generateBreadcrumbSchema(allItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs text-slate-500">
        <ol className="flex items-center space-x-1.5 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-1 shrink-0" />
                )}
                {isLast ? (
                  <span className="font-medium text-slate-800" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="flex items-center hover:text-blue-600 transition-colors"
                  >
                    {index === 0 && <Home className="h-3.5 w-3.5 mr-1" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
