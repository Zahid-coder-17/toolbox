'use client';

import React, { useEffect } from 'react';
import { trackToolView, trackRelatedToolClick } from '@/lib/analytics';
import { ToolDefinition } from '@/config/tools';
import { ToolCard } from '@/components/ui/tool-card';

export function ToolAnalyticsTracker({
  toolId,
  toolName,
  category,
}: {
  toolId: string;
  toolName: string;
  category: string;
}) {
  useEffect(() => {
    trackToolView(toolId, toolName, category);
  }, [toolId, toolName, category]);

  return null;
}

export function RelatedToolLink({
  currentToolId,
  relatedTool,
}: {
  currentToolId: string;
  relatedTool: ToolDefinition;
}) {
  return (
    <div
      onClick={() =>
        trackRelatedToolClick(currentToolId, relatedTool.id, relatedTool.category)
      }
    >
      <ToolCard tool={relatedTool} />
    </div>
  );
}
