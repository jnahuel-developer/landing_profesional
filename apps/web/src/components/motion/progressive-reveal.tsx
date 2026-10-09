'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useSyncExternalStore, type ReactNode } from 'react';

const subscribe = () => () => undefined;

export function ProgressiveReveal({ children }: Readonly<{ children: ReactNode }>) {
  const enhanced = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reducedMotion = useReducedMotion();

  if (!enhanced || reducedMotion) return <div className="progressive-reveal">{children}</div>;

  return (
    <motion.div
      className="progressive-reveal"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
