'use client';
import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

export function FramerMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
