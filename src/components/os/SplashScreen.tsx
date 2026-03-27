import React from 'react';
import { motion } from 'motion/react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="text-8xl md:text-9xl font-black tracking-tighter text-white">
          ROS <span className="text-accent">X</span>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          className="h-1 bg-accent mt-4 shadow-[0_0_20px_rgba(50,190,250,0.5)]"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/20"
      >
        Next Generation OS Simulation
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
}
