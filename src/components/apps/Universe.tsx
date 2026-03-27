import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Star, Moon, Sun, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const THOUGHTS = [
  "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
  "You are a child of the universe, no less than the trees and the stars; you have a right to be here.",
  "The more clearly we can focus our attention on the wonders and realities of the universe about us, the less taste we shall have for destruction.",
  "Everything you need is already within you. The universe is just waiting for you to realize it.",
  "Trust the timing of your life. The universe has a plan for you that is far greater than you can imagine.",
  "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.",
  "Somewhere, something incredible is waiting to be known.",
  "For small creatures such as we the vastness is bearable only through love."
];

export default function Universe() {
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
    setStars(newStars);
  }, []);

  const nextThought = () => {
    setThoughtIndex((prev) => (prev + 1) % THOUGHTS.length);
  };

  return (
    <div className="h-full bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 text-center">
      {/* Star Field */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(star => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: star.delay }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 space-y-12 max-w-2xl"
      >
        <div className="relative group cursor-pointer" onClick={nextThought}>
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-[60px] group-hover:blur-[80px] transition-all animate-pulse" />
          <Globe className="w-32 h-32 md:w-48 md:h-48 text-accent relative z-10 mx-auto drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)]" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-accent/20 rounded-full scale-125"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Star className="w-4 h-4 text-accent animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent/60">Cosmic Wisdom</span>
            <Star className="w-4 h-4 text-accent animate-spin-slow" />
          </div>

          <AnimatePresence mode="wait">
            <motion.h1 
              key={thoughtIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl md:text-3xl font-serif italic leading-relaxed px-4 min-h-[120px] flex items-center justify-center"
            >
              "{THOUGHTS[thoughtIndex]}"
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={nextThought}
            className="px-8 py-3 bg-accent hover:bg-accent/80 rounded-full text-black text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-accent/20 active:scale-95 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Seek Guidance</span>
          </button>
          
          <div className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Compass className="w-4 h-4 text-white/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Universe Node 0x7F</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Icons */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-12 opacity-20 hidden md:block"
      >
        <Moon className="w-8 h-8 text-accent" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 opacity-20 hidden md:block"
      >
        <Sun className="w-8 h-8 text-accent" />
      </motion.div>
    </div>
  );
}
