'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatMilliseconds } from '@/utils/time';

interface DisplayTimerProps {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

/**
 * Component to display the current countdown time and progress
 */
export const DisplayTimer: React.FC<DisplayTimerProps> = ({
  timeLeft,
  progress,
  isRunning,
  isPaused,
  onPause,
  onResume,
  onReset,
}) => {
  // Format the time for display
  const formattedTime = formatMilliseconds(timeLeft);
  
  // Split time into digits for animation
  const [hours1, hours2, , minutes1, minutes2, , seconds1, seconds2] = formattedTime.split('');
  
  // Animation variants for digits
  const digitVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="timer-container p-6 mb-6">
        <div className="relative">
          <div className="timer-digit flex justify-center text-6xl md:text-8xl font-mono font-bold mb-8 text-center">
            <motion.span
              key={`h1-${hours1}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {hours1}
            </motion.span>
            <motion.span
              key={`h2-${hours2}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {hours2}
            </motion.span>
            <span className="inline-block w-6 md:w-8 text-center opacity-50">:</span>
            <motion.span
              key={`m1-${minutes1}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: 0.1 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {minutes1}
            </motion.span>
            <motion.span
              key={`m2-${minutes2}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: 0.15 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {minutes2}
            </motion.span>
            <span className="inline-block w-6 md:w-8 text-center opacity-50">:</span>
            <motion.span
              key={`s1-${seconds1}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: 0.2 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {seconds1}
            </motion.span>
            <motion.span
              key={`s2-${seconds2}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, delay: 0.25 }}
              className="inline-block w-14 md:w-20 text-center"
            >
              {seconds2}
            </motion.span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="bg-accent h-full rounded-full" 
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-4">
          {isRunning && !isPaused ? (
            <Button
              onClick={onPause}
              variant="secondary"
              size="md"
            >
              Pause
            </Button>
          ) : isPaused ? (
            <Button
              onClick={onResume}
              variant="primary"
              size="md"
            >
              Resume
            </Button>
          ) : null}
          
          <Button
            onClick={onReset}
            variant="danger"
            size="md"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}; 