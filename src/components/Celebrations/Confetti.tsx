'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  colors?: string[];
}

/**
 * Component to display confetti celebration effect
 */
export const Confetti: React.FC<ConfettiProps> = ({
  duration = 3000,
  particleCount = 100,
  spread = 70,
  startVelocity = 30,
  colors = ['#6366F1', '#22D3EE', '#10B981', '#F59E0B', '#EF4444'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !canvasRef.current) return;
    
    // Create a confetti instance
    confettiInstanceRef.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });
    
    // Setup confetti options
    const options: confetti.Options = {
      particleCount,
      spread,
      startVelocity,
      ticks: 200,
      origin: { x: 0.5, y: 0.3 },
      colors,
      shapes: ['square', 'circle'],
      scalar: 1,
      zIndex: 100,
      disableForReducedMotion: true,
    };
    
    // Fire confetti
    confettiInstanceRef.current(options);
    
    // Add continuous fire effect
    const intervalId = setInterval(() => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current({
          ...options,
          origin: { 
            x: Math.random(), 
            y: Math.random() - 0.2 
          },
          particleCount: particleCount / 2,
        });
      }
    }, 250);
    
    // Cleanup
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    }, duration);
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, [particleCount, spread, startVelocity, colors, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50 
      }}
      aria-hidden="true"
    />
  );
}; 