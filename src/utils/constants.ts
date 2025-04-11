/**
 * Timer-related constants
 */

// Maximum timer duration in hours (24 hours in milliseconds)
export const MAX_TIMER_DURATION = 24 * 60 * 60 * 1000;

// Sound effects
export const SOUNDS = {
  TIMER_COMPLETE: '/sounds/timer-complete.mp3',
  BUTTON_CLICK: '/sounds/button-click.mp3',
  TIMER_TICK: '/sounds/timer-tick.mp3',
};

// Local storage keys
export const STORAGE_KEYS = {
  TIMER_STATE: 'countdown-timer-state',
};

// Time formats
export const TIME_FORMATS = {
  HOURS_MINUTES_SECONDS: 'HH:mm:ss',
  HOURS_MINUTES: 'HH:mm',
};

// Animation durations (ms)
export const ANIMATION = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    DEFAULT: [0.42, 0.0, 0.58, 1.0], // easing function array for Framer Motion
    BOUNCE: [0.68, -0.55, 0.27, 1.55],
  },
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

// Share message template
export const SHARE_MESSAGE = 'I just completed my countdown! Try it yourself:'; 