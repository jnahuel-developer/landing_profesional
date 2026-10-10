'use client';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import type { ContactInput } from '@portfolio/contracts';
import { analytics, trackContact } from '../../analytics/client';

export function ContactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
export function useContactMutation() {
  return useMutation({
    retry: false,
    onSuccess: (status, input) => {
      if (status === 201 && !input.website) trackContact('contact_submitted');
    },
    onError: (error, input) => {
      if (!input.website)
        analytics.track({
          name: 'contact_failed',
          properties: { category: analyticsContactError(error) },
        });
    },
    mutationFn: async (input: ContactInput) => {
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { code?: string };
        throw new Error(body.code ?? 'SERVICE_UNAVAILABLE');
      }
      const receipt = (await response.json()) as { received?: boolean };
      if (receipt.received !== true) throw new Error('SERVICE_UNAVAILABLE');
      return response.status;
    },
  });
}

function analyticsContactError(
  error: Error,
): 'validation' | 'rate_limit' | 'too_fast' | 'payload' | 'unavailable' {
  switch (error.message) {
    case 'VALIDATION_ERROR':
      return 'validation';
    case 'RATE_LIMITED':
      return 'rate_limit';
    case 'CONTACT_TOO_FAST':
      return 'too_fast';
    case 'PAYLOAD_TOO_LARGE':
      return 'payload';
    default:
      return 'unavailable';
  }
}
