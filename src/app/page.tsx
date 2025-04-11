'use client';

import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function Home() {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient">
            Countdown Timer
          </h1>
          <p className="text-lg text-gray-300">
            Set your timer and track the countdown
          </p>
        </header>
        
        <div className="bg-background-light p-8 rounded-xl shadow-lg glass-effect">
          <CountdownTimer />
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            This countdown timer will save your progress even if you close the browser.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
