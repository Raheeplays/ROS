import React from 'react';
import { Moon, Star, Heart } from 'lucide-react';

export default function Dreaming() {
  return (
    <div className="h-full bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center text-center scrollable-layout">
      <Moon className="w-20 h-20 md:w-24 md:h-24 text-accent mb-8 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">SMART DREAMING</h1>
      <p className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] mb-12">Sleep & Gratitude</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-3xl">
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center hover:border-accent/30 transition-all group">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-accent transition-colors">Affirmations</h2>
          <p className="text-[10px] md:text-xs text-white/40 italic">"I am at peace with the universe."</p>
        </div>
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center hover:border-accent/30 transition-all group">
          <Heart className="w-6 h-6 md:w-8 md:h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-accent transition-colors">Gratitude</h2>
          <p className="text-[10px] md:text-xs text-white/40 italic">"Thank you for this beautiful day."</p>
        </div>
      </div>
    </div>
  );
}
