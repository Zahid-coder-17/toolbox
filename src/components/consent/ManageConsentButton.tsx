'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { openConsentPreferences } from '@/components/consent/ConsentManager';

export function ManageConsentButton({
  variant = 'outline',
  size = 'sm',
  className = '',
}: {
  variant?: 'outline' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={`inline-flex items-center gap-2 ${className}`}
      onClick={() => openConsentPreferences()}
    >
      <Settings2 className="h-4 w-4" />
      <span>Manage Cookie &amp; Advertising Preferences</span>
    </Button>
  );
}
