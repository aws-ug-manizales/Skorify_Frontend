'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
  sx?: object;
}

// Apple-style easing — same curve used by SwiftUI's `.easeOut` for refined reveals.
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

const offsetFor = (direction: RevealDirection, distance: number): string => {
  switch (direction) {
    case 'up':
      return `translate3d(0, ${distance}px, 0)`;
    case 'down':
      return `translate3d(0, -${distance}px, 0)`;
    case 'left':
      return `translate3d(${distance}px, 0, 0)`;
    case 'right':
      return `translate3d(-${distance}px, 0, 0)`;
    default:
      return 'translate3d(0, 0, 0)';
  }
};

const Reveal = ({
  children,
  delay = 0,
  duration = 800,
  direction = 'up',
  distance = 24,
  threshold = 0.15,
  once = true,
  as = 'div',
  sx,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Box
      ref={ref}
      component={as}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : offsetFor(direction, distance),
        transition: `opacity ${duration}ms ${EASING} ${delay}ms, transform ${duration}ms ${EASING} ${delay}ms`,
        willChange: 'opacity, transform',
        '@media (prefers-reduced-motion: reduce)': {
          opacity: 1,
          transform: 'none',
          transition: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Reveal;
