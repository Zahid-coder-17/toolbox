import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getRelatedArticlesForTool } from '@/config/articles';

export function RelatedArticles({ toolId }: { toolId: string }) {
  const articles = getRelatedArticlesForTool(toolId);
  if (!articles || articles.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-blue-600" />
        Educational Guides &amp; Tutorials
      </h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/40"
          >
            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 leading-snug line-clamp-2">
              {article.title}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{article.readTimeMinutes} min read</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-blue-600 flex items-center gap-1">
                Read Guide <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
