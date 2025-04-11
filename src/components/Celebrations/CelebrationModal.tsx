'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Confetti } from './Confetti';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { SHARE_MESSAGE } from '@/utils/constants';

interface CelebrationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSetNewTimer: () => void;
}

/**
 * Modal displayed when timer completes with celebration effects and sharing options
 */
export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isVisible,
  onClose,
  onSetNewTimer,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Start confetti when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      // Disable confetti after 5 seconds to improve performance
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isVisible]);

  // Modal animations
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 15, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background-light glass-effect p-8 rounded-xl shadow-xl z-50 w-full max-w-md"
          >
            {showConfetti && <Confetti />}
            
            <div className="text-center">
              <motion.h2 
                className="text-3xl font-bold mb-4 text-gradient"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Time&apos;s Up!
              </motion.h2>
              
              <motion.p 
                className="text-lg mb-6 text-gray-300"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your countdown is complete!
              </motion.p>
              
              <motion.div 
                className="flex flex-col gap-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={onSetNewTimer} size="lg">
                  Set New Timer
                </Button>
                
                <Button onClick={onClose} variant="secondary" size="lg">
                  Close
                </Button>
              </motion.div>
              
              <motion.div 
                className="border-t border-gray-700 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-400 mb-3">Share your achievement:</p>
                <div className="flex justify-center space-x-4">
                  <FacebookShareButton url={shareUrl} hashtag="#countdown">
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                  
                  <TwitterShareButton url={shareUrl} title={SHARE_MESSAGE}>
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>
                  
                  <WhatsappShareButton url={shareUrl} title={SHARE_MESSAGE}>
                    <WhatsappIcon size={40} round />
                  </WhatsappShareButton>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 