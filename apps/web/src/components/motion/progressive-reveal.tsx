'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, useSyncExternalStore, type ReactNode } from 'react';

const subscribe = () => () => undefined;

export function ProgressiveReveal({ children }: Readonly<{ children: ReactNode }>) {
  const enhanced = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.18, once: true });
  const visible = !enhanced || reducedMotion || inView;

  return (
    <motion.div
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      className="progressive-reveal"
      initial={false}
      ref={ref}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
