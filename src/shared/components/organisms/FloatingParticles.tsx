'use client';

import { useEffect, useRef } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import { tokens } from '@lib/theme/theme';
import type { Particle } from '@shared/types/particles';

interface FloatingParticlesProps {
  /** Hex color (`#RRGGBB`) used for the particles. Defaults to the brand primary. */
  color?: string;
  /** Number of particles on screen. Defaults to 40. */
  density?: number;
  /** Overall canvas opacity (0–1). Defaults to 0.7. */
  opacity?: number;
  /** Container positioning — `'fixed'` covers the viewport, `'absolute'` fits the parent. */
  position?: 'fixed' | 'absolute';
  /** Stack order. Defaults to 0. */
  zIndex?: number;
  /** Optional sx overrides applied to the underlying canvas. */
  sx?: BoxProps['sx'];
}

const DEFAULT_DENSITY = 40;
const DEFAULT_OPACITY = 0.7;
const FALLBACK_RGB: [number, number, number] = [25, 118, 210];

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : FALLBACK_RGB;
};

const buildParticle = (canvas: HTMLCanvasElement): Particle => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 1,
  vy: (Math.random() - 0.5) * 1,
  radius: Math.random() * 3 + 1.5,
  opacity: Math.random() * 0.6 + 0.3,
  life: Math.random() * 100 + 50,
});

const FloatingParticles = ({
  color = tokens.primary,
  density = DEFAULT_DENSITY,
  opacity = DEFAULT_OPACITY,
  position = 'fixed',
  zIndex = 0,
  sx,
}: FloatingParticlesProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [r, g, b] = hexToRgb(color);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const particles: Particle[] = Array.from({ length: density }, () => buildParticle(canvas));

    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.3;

        if (particle.x < 0 || particle.x > w) particle.vx *= -1;
        if (particle.y < 0 || particle.y > h) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(w, particle.x));
        particle.y = Math.max(0, Math.min(h, particle.y));

        const fadeOpacity = Math.max(0, (particle.life / 100) * particle.opacity);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeOpacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        if (particle.life <= 0) particles[index] = buildParticle(canvas);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [color, density]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden
      sx={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        opacity,
        display: 'block',
        ...sx,
      }}
    />
  );
};

export default FloatingParticles;
