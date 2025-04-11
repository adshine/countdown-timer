'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MAX_TIMER_DURATION } from '@/utils/constants';
import ThreeJsModel from '@/components/ThreeJsModel';
import { motion, AnimatePresence } from 'framer-motion';

interface KnobTimeSetterProps {
  onSetTimer: (duration: number) => void;
  onStart: () => void;
}

/**
 * Enhanced form component for setting the countdown timer duration with 3D knob
 */
export const KnobTimeSetter: React.FC<KnobTimeSetterProps> = ({
  onSetTimer,
  onStart,
}) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'hours' | 'minutes' | null>(null);
  const knobContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Handle initial mount animation
  useEffect(() => {
    // Add a slight delay before showing the knob to prevent visual flash
    const timer = setTimeout(() => {
      setIsModelLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Handle knob rotation for updating time values
  const handleKnobRotate = (direction: 'clockwise' | 'counterclockwise', value: number) => {
    if (!activeInput) return;
    
    if (activeInput === 'hours') {
      // Update hours when knob is rotated
      if (direction === 'clockwise') {
        setHours(prev => Math.min(prev + value, 24));
      } else {
        setHours(prev => Math.max(prev - value, 0));
      }
    } else if (activeInput === 'minutes') {
      // Update minutes when knob is rotated
      if (direction === 'clockwise') {
        setMinutes(prev => {
          const newValue = prev + value;
          return newValue > 59 ? 59 : newValue;
        });
      } else {
        setMinutes(prev => Math.max(prev - value, 0));
      }
    }
  };

  // Handle focus on input fields
  const handleInputFocus = (input: 'hours' | 'minutes') => {
    setActiveInput(input);
  };

  // Handle blur on input fields
  const handleInputBlur = () => {
    // Small delay to allow for clicking on the 3D model
    setTimeout(() => {
      if (document.activeElement === knobContainerRef.current) {
        return; // Keep it active if focus is on the knob
      }
      
      const activeElement = document.activeElement;
      if (activeElement && formRef.current?.contains(activeElement)) {
        return; // Keep it active if focus is still within the form
      }
      
      setActiveInput(null);
    }, 100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="relative">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Set Your Timer</h2>
          
          {error && (
            <div className="p-3 bg-red-900 border border-red-600 text-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="hours" 
                className={`block text-sm font-medium mb-1 transition-colors duration-200 ${activeInput === 'hours' ? 'text-[#0000FF]' : 'text-gray-300'}`}
              >
                Hours
              </label>
              <input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                onFocus={() => handleInputFocus('hours')}
                onBlur={handleInputBlur}
                min="0"
                max="24"
                className={`w-full bg-[#111827] border ${activeInput === 'hours' ? 'border-[#0000FF] ring-1 ring-[#0000FF33]' : 'border-gray-700'} rounded-lg p-3 text-white transition-all duration-200`}
                aria-describedby={error ? 'form-error' : undefined}
              />
            </div>
            
            <div>
              <label 
                htmlFor="minutes" 
                className={`block text-sm font-medium mb-1 transition-colors duration-200 ${activeInput === 'minutes' ? 'text-[#0000FF]' : 'text-gray-300'}`}
              >
                Minutes
              </label>
              <input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                onFocus={() => handleInputFocus('minutes')}
                onBlur={handleInputBlur}
                min="0"
                max="59"
                className={`w-full bg-[#111827] border ${activeInput === 'minutes' ? 'border-[#0000FF] ring-1 ring-[#0000FF33]' : 'border-gray-700'} rounded-lg p-3 text-white transition-all duration-200`}
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
            variant="swiss"
            size="lg"
            fullWidth
            className="mt-8"
          >
            START COUNTDOWN
          </Button>
        </div>
      </form>

      {/* 3D Knob */}
      <AnimatePresence mode="wait">
        {activeInput && isModelLoaded && (
          <motion.div 
            className="h-[300px] mx-auto mt-8 rounded-xl overflow-hidden bg-[#111827] border border-[#0000FF33]"
            ref={knobContainerRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              boxShadow: '0 0 30px rgba(0, 0, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            }}
            tabIndex={0}
            onFocus={() => setActiveInput(activeInput)}
          >
            <ThreeJsModel 
              modelPath="/threed-assets/base_basic_shaded.glb" 
              width="100%" 
              height="100%" 
              backgroundColor="transparent"
              autoRotate={false}
              onRotate={handleKnobRotate}
              activeInput={activeInput}
              position="center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 