'use client';

import React, { useRef } from 'react';
import { formatMilliseconds } from '@/utils/time';
import TextCursorProximity from '@/components/ui/text-cursor-proximity';

interface DisplayTimerProps {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

/**
 * Component to display the current countdown time with Swiss design principles
 * Using 12-point grid system and top-left aligned timer
 */
export const DisplayTimer: React.FC<DisplayTimerProps> = ({
  timeLeft,
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

  // Container ref for mouse proximity tracking
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4">
      {/* Top left large timer */}
      <div className="col-span-12 sm:col-span-10 md:col-span-8 flex flex-col items-start" ref={containerRef}>
        <div className="timer-container mb-8">
          <div className="timer-digit flex text-[12rem] md:text-[16rem] font-mono font-bold text-left tracking-tight">
            <TextCursorProximity
              label={hours1}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
            <TextCursorProximity
              label={hours2}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
            <span className="inline-block text-center opacity-50">:</span>
            <TextCursorProximity
              label={minutes1}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
            <TextCursorProximity
              label={minutes2}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
            <span className="inline-block text-center opacity-50">:</span>
            <TextCursorProximity
              label={seconds1}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
            <TextCursorProximity
              label={seconds2}
              containerRef={containerRef}
              className="inline-block text-center"
              styles={{
                transform: {
                  from: "scale(1)",
                  to: "scale(1.1)",
                },
                color: { 
                  from: "#FFFFFF", 
                  to: "#0000FF"
                },
              }}
              falloff="gaussian"
              radius={100}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom controls with icons */}
      <div className="col-span-12 flex justify-between items-center fixed bottom-0 left-0 right-0 p-8 bg-[#121212]">
        <div className="grid grid-cols-12 gap-4 w-full">
          {/* Left icon - reset */}
          <div className="col-span-4 flex justify-start">
            <button 
              onClick={onReset}
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#0000FF] hover:bg-[#0000FF]/10 transition-colors"
              aria-label="Reset timer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          
          {/* Center icon - play/pause */}
          <div className="col-span-4 flex justify-center">
            {isRunning && !isPaused ? (
              <button
                onClick={onPause}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-[#0000FF] hover:bg-[#0000D6] transition-colors"
                aria-label="Pause timer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>
            ) : (
              <button
                onClick={onResume}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-[#0000FF] hover:bg-[#0000D6] transition-colors"
                aria-label="Resume timer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            )}
          </div>
          
          {/* Right placeholder for symmetry */}
          <div className="col-span-4 flex justify-end">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#0000FF] hover:bg-[#0000FF]/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
