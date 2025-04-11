import { format, intervalToDuration } from 'date-fns';
import { TIME_FORMATS } from './constants';

/**
 * Formats milliseconds to a time string (HH:mm:ss)
 */
export const formatMilliseconds = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates the time remaining between now and an end time
 */
export const calculateTimeRemaining = (endTime: number): number => {
  const now = Date.now();
  const remaining = Math.max(0, endTime - now);
  return remaining;
};

/**
 * Calculates progress percentage (0-100) between start and end time
 */
export const calculateProgress = (
  startTime: number,
  endTime: number
): number => {
  const now = Date.now();
  const total = endTime - startTime;
  const elapsed = now - startTime;
  
  if (total <= 0) return 0;
  
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

/**
 * Formats a duration in milliseconds to a human-readable string
 */
export const formatDuration = (ms: number): string => {
  const start = new Date(0);
  const end = new Date(ms);
  
  const duration = intervalToDuration({ start, end });
  
  const hours = duration.hours?.toString().padStart(2, '0') || '00';
  const minutes = duration.minutes?.toString().padStart(2, '0') || '00';
  const seconds = duration.seconds?.toString().padStart(2, '0') || '00';
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Converts HH:mm string to milliseconds
 */
export const hoursMinutesToMs = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60 * 60 + minutes * 60) * 1000;
};

/**
 * Formats a date to the specified format
 */
export const formatDate = (
  date: Date | number,
  formatString = TIME_FORMATS.HOURS_MINUTES_SECONDS
): string => {
  return format(date, formatString);
}; 