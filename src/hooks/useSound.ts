import { useState, useCallback, useEffect } from 'react';
import useSound from 'use-sound';

interface UseSoundOptions {
  soundEnabled?: boolean;
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  sprite?: Record<string, [number, number]>;
  onend?: () => void;
}

/**
 * Custom wrapper around use-sound library
 * Adds ability to disable sounds globally and handles server-side rendering
 */
export const useSoundEffect = (
  url: string,
  options: UseSoundOptions = {}
) => {
  const [isClient, setIsClient] = useState(false);
  const { soundEnabled = true, ...restOptions } = options;

  // Handle SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only try to load sounds on client side
  const [play, { sound, stop, pause, duration }] = useSound(
    url,
    {
      ...restOptions,
      soundEnabled: isClient && soundEnabled,
    }
  );

  // Safe play function that works on client side only
  const safePlay = useCallback(
    (options?: Record<string, unknown>) => {
      if (isClient && soundEnabled) {
        play(options);
      }
    },
    [isClient, soundEnabled, play]
  );

  return {
    play: safePlay,
    sound,
    stop,
    pause,
    duration,
  };
}; 