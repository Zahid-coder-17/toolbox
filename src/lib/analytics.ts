/**
 * Safe, Privacy-First Google Analytics 4 (GA4) Integration.
 *
 * CRITICAL PRIVACY RULE:
 * Never transmit user text inputs, file contents, passwords, or personal data.
 * Only sanitized metadata (e.g. tool ID, category, file extension, duration ms) is tracked.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isAnalyticsActive(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && Boolean(GA_MEASUREMENT_ID);
}

/**
 * Base generic safe event dispatcher.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === 'undefined') return;

  // Clean undefined params
  const cleanParams: Record<string, string | number | boolean> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      // Guard: strictly ensure no multi-kilobyte strings (e.g. accidentally passed file contents)
      if (typeof val === 'string' && val.length > 256) {
        cleanParams[key] = val.substring(0, 256);
      } else {
        cleanParams[key] = val;
      }
    }
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, cleanParams);
    }
  } catch {
    // Gracefully ignore tracking errors (e.g., ad blockers)
  }
}

/**
 * 1. tool_view — When a user visits a tool page
 */
export function trackToolView(toolId: string, toolName: string, category: string) {
  trackEvent('tool_view', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: category,
  });
}

/**
 * 2. tool_start — When a user begins an operation (uploads file, types query, hits calculate)
 */
export function trackToolStart(toolId: string, toolName: string, category: string) {
  trackEvent('tool_start', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: category,
  });
}

/**
 * 3. tool_complete — When an operation successfully completes
 */
export function trackToolComplete(
  toolId: string,
  toolName: string,
  category: string,
  durationMs?: number
) {
  trackEvent('tool_complete', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: category,
    duration_ms: durationMs !== undefined ? Math.round(durationMs) : undefined,
  });
}

/**
 * 4. tool_error — When an operation fails (e.g. invalid PDF, corrupt image, division by zero)
 */
export function trackToolError(
  toolId: string,
  toolName: string,
  category: string,
  errorType: string
) {
  // Sanitize errorType to generic message (max 100 chars, no user data)
  const sanitizedError = errorType.replace(/['"\r\n\t]/g, ' ').substring(0, 100).trim();
  trackEvent('tool_error', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: category,
    error_type: sanitizedError,
  });
}

/**
 * 5. file_download — When a processed file is downloaded
 */
export function trackFileDownload(
  toolId: string,
  fileName: string,
  fileType: string,
  fileSizeBytes?: number
) {
  // Only capture file extension and generic size, never full path or sensitive file contents
  const extension = fileName.split('.').pop()?.toLowerCase() || 'unknown';
  trackEvent('file_download', {
    tool_id: toolId,
    file_extension: extension,
    file_type: fileType,
    file_size_kb: fileSizeBytes ? Math.round(fileSizeBytes / 1024) : undefined,
  });
}

/**
 * 6. tool_search — When a user searches for tools in the homepage search bar
 */
export function trackToolSearch(queryTerm: string, resultsCount: number) {
  const sanitizedQuery = queryTerm.substring(0, 50).trim();
  trackEvent('tool_search', {
    search_term: sanitizedQuery,
    results_count: resultsCount,
  });
}

/**
 * 7. related_tool_click — When a user clicks a related tool recommendation
 */
export function trackRelatedToolClick(
  currentToolId: string,
  targetToolId: string,
  category: string
) {
  trackEvent('related_tool_click', {
    current_tool_id: currentToolId,
    target_tool_id: targetToolId,
    tool_category: category,
  });
}
