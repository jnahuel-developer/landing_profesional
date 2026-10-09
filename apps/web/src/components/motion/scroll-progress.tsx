'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

export function ScrollProgress() {
  const enhanced = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 34, stiffness: 180 });
  if (!enhanced || reducedMotion) return null;
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />;
}
