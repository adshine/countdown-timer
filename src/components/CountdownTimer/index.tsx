'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { KnobTimeSetter } from './KnobTimeSetter';
import { DisplayTimer } from './DisplayTimer';
import { CelebrationModal } from '@/components/Celebrations/CelebrationModal';
import { useCountdown } from '@/hooks/useCountdown';
import { useTimerStore } from '@/store/timerStore';
import { useSoundEffect } from '@/hooks/useSound';
import { SOUNDS } from '@/utils/constants';

/**
 * Main countdown timer component that manages the timer state and UI
 */
export const CountdownTimer: React.FC = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const { isComplete, setTimer } = useTimerStore();
  
  // Set up sound effects
  const completionSound = useSoundEffect(SOUNDS.TIMER_COMPLETE, {
    volume: 0.5,
  });
  
  const buttonSound = useSoundEffect(SOUNDS.BUTTON_CLICK, {
    volume: 0.2,
  });

  // Handle timer completion
  const handleComplete = useCallback(() => {
    completionSound.play();
    setShowCelebration(true);
  }, [completionSound]);
  
  // Set up countdown hook
  const { 
    timeLeft, 
    isRunning, 
    isPaused,
    start, 
    pause, 
    resume, 
    reset 
  } = useCountdown({
    onComplete: handleComplete,
  });

  // Handle timer actions with sound effects
  const handleStart = useCallback(() => {
    buttonSound.play();
    start();
  }, [buttonSound, start]);
  
  const handlePause = useCallback(() => {
    buttonSound.play();
    pause();
  }, [buttonSound, pause]);
  
  const handleResume = useCallback(() => {
    buttonSound.play();
    resume();
  }, [buttonSound, resume]);
  
  const handleReset = useCallback(() => {
    buttonSound.play();
    reset();
  }, [buttonSound, reset]);
  
  const handleSetTimer = useCallback((duration: number) => {
    setTimer(duration);
  }, [setTimer]);

  // Close celebration modal
  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);
  
  // Handle setting a new timer after completion
  const handleSetNewTimer = useCallback(() => {
    setShowCelebration(false);
    reset();
  }, [reset]);
  
  // Show celebration modal when timer completes
  useEffect(() => {
    if (isComplete) {
      setShowCelebration(true);
    }
  }, [isComplete]);

  return (
    <>
      {/* Timer interface */}
      <div className="w-full">
        {!isRunning && !isPaused ? (
          <KnobTimeSetter 
            onSetTimer={handleSetTimer} 
            onStart={handleStart} 
          />
        ) : (
          <DisplayTimer 
            timeLeft={timeLeft}
            isRunning={isRunning}
            isPaused={isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />
        )}
      </div>
      
      {/* Celebration modal */}
      <CelebrationModal 
        isVisible={showCelebration}
        onClose={handleCloseCelebration}
        onSetNewTimer={handleSetNewTimer}
      />
    </>
  );
}; 