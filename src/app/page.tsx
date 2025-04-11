'use client';

import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/CountdownTimer';
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#121212] flex flex-col items-start p-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-full mx-auto"
      >
        <header className="fixed top-6 right-6 z-10">
          <h1 className="text-3xl font-bold text-[#0000FF]">
            DIGITAL<br/>WORKSHOP
          </h1>
          <p className="text-sm text-right text-white">
            {new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '/')}
          </p>
        </header>
        
        <div className="w-full h-screen p-8 sm:p-12 pt-24">
          <CountdownTimer />
        </div>
        
        <div className="fixed left-8 bottom-36 text-white text-xs uppercase">
          <p>
            This countdown timer will save your progress<br />even if you close the browser.
          </p>
        </div>

        <div className="hidden">
          <Link 
            href="/workshop" 
            className="inline-block bg-primary hover:bg-primary-hover py-3 px-6 rounded-md transition-colors font-swiss"
          >
            <span className="text-[#FFF9E0] hover:text-white transition-colors text-base">
              Digital Workshop Preview
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
