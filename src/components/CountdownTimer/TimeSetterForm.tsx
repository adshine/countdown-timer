'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { MAX_TIMER_DURATION } from '@/utils/constants';
import { hoursMinutesToMs } from '@/utils/time';

interface TimeSetterFormProps {
  onSetTimer: (duration: number) => void;
  onStart: () => void;
}

/**
 * Form component for setting the countdown timer duration
 */
export const TimeSetterForm: React.FC<TimeSetterFormProps> = ({
  onSetTimer,
  onStart,
}) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [error, setError] = useState<string>('');

  /**
   * Validates the input and sets the timer
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (hours === 0 && minutes === 0) {
      setError('Please set a time greater than zero');
      return;
    }
    
    if (hours > 24) {
      setError('Maximum time is 24 hours');
      return;
    }
    
    if (minutes > 59) {
      setError('Minutes should be between 0 and 59');
      return;
    }
    
    // Calculate duration in milliseconds
    const durationMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    
    // Ensure duration doesn't exceed maximum
    if (durationMs > MAX_TIMER_DURATION) {
      setError('Maximum time is 24 hours');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Set timer and start
    onSetTimer(durationMs);
    onStart();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-accent">Set Your Timer</h2>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="hours" 
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Hours
            </label>
            <input
              id="hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              min="0"
              max="24"
              className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
              aria-describedby={error ? 'form-error' : undefined}
            />
          </div>
          
          <div>
            <label 
              htmlFor="minutes" 
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Minutes
            </label>
            <input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              min="0"
              max="59"
              className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
              aria-describedby={error ? 'form-error' : undefined}
            />
          </div>
        </div>
        
        {error && (
          <div id="form-error" className="sr-only">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
        >
          Start Countdown
        </Button>
      </div>
    </form>
  );
}; 