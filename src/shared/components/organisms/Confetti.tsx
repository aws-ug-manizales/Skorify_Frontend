'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { tokens } from '@lib/theme/theme';

interface ConfettiProps {
  /** When true, a single burst of confetti rains down and then auto-completes. */
  active: boolean;
  /** Number of confetti pieces. Defaults to 180. */
  pieceCount?: number;
  /** Called once every piece has fallen out of view. */
  onComplete?: () => void;
}

const COLORS = [
  tokens.primary,
  tokens.primaryContainer,
  tokens.tertiary,
  tokens.secondary,
  tokens.success,
  '#FF8A00',
];

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  color: string;
}

const Confetti = ({ active, pieceCount = 180, onComplete }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const width = () => canvas.width / dpr;
    const height = () => canvas.height / dpr;

    // Stagger pieces above the viewport so they cascade in instead of dropping
    // all at once.
    const pieces: Piece[] = Array.from({ length: pieceCount }, () => ({
      x: Math.random() * width(),
      y: Math.random() * -height(),
      w: Math.random() * 8 + 5,
      h: Math.random() * 6 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      vx: (Math.random() - 0.5) * 1.6,
      vy: Math.random() * 3 + 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const animate = () => {
      const h = height();
      ctx.clearRect(0, 0, width(), h);

      let allGone = true;
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y <= h + 20) allGone = false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (allGone) {
        ctx.clearRect(0, 0, width(), h);
        onCompleteRef.current?.();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, pieceCount]);

  if (!active) return null;

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
    />
  );
};

export default Confetti;
