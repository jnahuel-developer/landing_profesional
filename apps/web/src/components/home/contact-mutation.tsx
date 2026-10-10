'use client';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import type { ContactInput } from '@portfolio/contracts';

export function ContactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
export function useContactMutation() {
  return useMutation({
    retry: false,
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
    },
  });
}
