import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Hash,
  CaseSensitive,
  Braces,
  Binary,
  GitCompare,
  Link as LinkIcon,
  Fingerprint,
  Minimize2,
  Maximize2,
  FileImage,
  FileCode2,
  Smartphone,
  QrCode,
  Globe,
  Palette,
  FileArchive,
  Layers,
  Split,
  ImageDown,
  Calendar,
  Percent,
  Coins,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ToolDefinition } from '@/config/tools';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Hash,
  CaseSensitive,
  Braces,
  Binary,
  GitCompare,
  Link: LinkIcon,
  Fingerprint,
  Minimize2,
  Maximize2,
  FileImage,
  FileCode2,
  Smartphone,
  QrCode,
  Globe,
  Palette,
  FileArchive,
  Layers,
  Split,
  ImageDown,
  Calendar,
  Percent,
  Coins,
  TrendingUp,
};

export function ToolCard({
  tool,
  className,
}: {
  tool: ToolDefinition;
  className?: string;
}) {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;

  return (
    <Link
      href={tool.href}
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <IconComponent className="h-5 w-5" />
          </div>
          {tool.badge && (
            <Badge variant="accent" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {tool.badge}
            </Badge>
          )}
        </div>

        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
        <span>Launch tool</span>
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
