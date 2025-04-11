'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Howl } from 'howler';

type SoundOptions = {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
};

/**
 * Custom hook for playing sound effects
 */
export function useSoundEffect(src: string, options: SoundOptions = {}) {
  const soundRef = useRef<Howl | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Initialize sound on mount with lazy loading
  useEffect(() => {
    // Create sound instance
    const sound = new Howl({
      src: [src],
      volume: options.volume ?? 1,
      loop: options.loop ?? false,
      autoplay: false, // Never autoplay - requires user interaction first
      preload: true,
      html5: true, // Use HTML5 Audio API to avoid AudioContext issues
      onload: () => {
        setIsReady(true);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onend: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onpause: () => {
        setIsPlaying(false);
      }
    });
    
    soundRef.current = sound;
    
    // Clean up on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
  }, [src, options.volume, options.loop]);
  
  // Play sound only after user interaction
  const play = useCallback(() => {
    if (!soundRef.current || !isReady) return;
    
    try {
      // Check if Howler's AudioContext needs to be resumed
      if (Howler.ctx && Howler.ctx.state !== 'running') {
        Howler.ctx.resume().then(() => {
          soundRef.current?.play();
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      } else {
        soundRef.current.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isReady]);
  
  // Stop sound
  const stop = useCallback(() => {
    if (!soundRef.current || !isReady) return;
    soundRef.current.stop();
  }, [isReady]);
  
  // Pause sound
  const pause = useCallback(() => {
    if (!soundRef.current || !isReady) return;
    soundRef.current.pause();
  }, [isReady]);
  
  // Resume sound
  const resume = useCallback(() => {
    if (!soundRef.current || !isReady) return;
    
    try {
      // Check if Howler's AudioContext needs to be resumed
      if (Howler.ctx && Howler.ctx.state !== 'running') {
        Howler.ctx.resume().then(() => {
          soundRef.current?.play();
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      } else {
        soundRef.current.play();
      }
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }, [isReady]);
  
  return {
    play,
    stop,
    pause,
    resume,
    isPlaying,
    isReady
  };
} 