import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { calculateTimeRemaining, calculateProgress } from '@/utils/time';

interface UseCountdownProps {
  onComplete?: () => void;
  interval?: number;
}

interface UseCountdownReturn {
  timeLeft: number;
  progress: number;
  isComplete: boolean;
  isRunning: boolean;
  isPaused: boolean;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Custom hook for countdown timer functionality
 */
export const useCountdown = ({
  onComplete,
  interval = 1000,
}: UseCountdownProps = {}): UseCountdownReturn => {
  const {
    endTime,
    startTime,
    isRunning,
    isPaused,
    duration,
    isComplete,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimer
  } = useTimerStore();
  
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [progress, setProgress] = useState<number>(0);
  
  // Calculate remaining time based on end time
  const calculateRemaining = useCallback(() => {
    if (!isRunning || !endTime) {
      return isPaused ? timeLeft : duration;
    }
    return calculateTimeRemaining(endTime);
  }, [isRunning, endTime, isPaused, timeLeft, duration]);
  
  // Calculate progress percentage
  const calculateCurrentProgress = useCallback(() => {
    if (!isRunning || !startTime || !endTime) return 0;
    return calculateProgress(startTime, endTime);
  }, [isRunning, startTime, endTime]);
  
  // Format time for display (implemented in DisplayTimer component)
  const formattedTime = "00:00:00"; // placeholder
  
  // Tick function for timer updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning && endTime) {
      intervalId = setInterval(() => {
        const remaining = calculateRemaining();
        setTimeLeft(remaining);
        
        const currentProgress = calculateCurrentProgress();
        setProgress(currentProgress);
        
        // Check if timer is complete
        if (remaining <= 0) {
          completeTimer();
          if (onComplete) onComplete();
        }
      }, interval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isRunning,
    endTime,
    interval,
    calculateRemaining,
    calculateCurrentProgress,
    completeTimer,
    onComplete
  ]);
  
  // Initial setup when component mounts
  useEffect(() => {
    const remaining = calculateRemaining();
    setTimeLeft(remaining);
    
    const currentProgress = calculateCurrentProgress();
    setProgress(currentProgress);
  }, [calculateRemaining, calculateCurrentProgress]);
  
  return {
    timeLeft,
    progress,
    isComplete,
    isRunning,
    isPaused,
    formattedTime,
    start: startTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    reset: resetTimer,
  };
}; 