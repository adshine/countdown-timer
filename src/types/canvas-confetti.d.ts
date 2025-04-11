declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: Array<'square' | 'circle'>;
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  export type CreateTypes = {
    (options?: Options): void;
    reset(): void;
  };

  function create(
    canvas: HTMLCanvasElement,
    options?: { resize?: boolean; useWorker?: boolean }
  ): CreateTypes;

  function reset(): void;

  export default function confetti(options?: Options): void;
  export { create, reset };
} 