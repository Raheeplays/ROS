import React from 'react';
import { Footprints, Lightbulb, ArrowRight } from 'lucide-react';

export default function StepOne() {
  return (
    <div className="h-full bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center text-center scrollable-layout">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/10 rounded-full flex items-center justify-center mb-8 border border-accent/20 shadow-2xl shadow-accent/10">
        <Footprints className="w-10 h-10 md:w-12 md:h-12 text-accent" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">STEP ONE</h1>
      <p className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] mb-12">Take The Leap</p>

      <div className="max-w-md w-full space-y-6">
        <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-4 text-left hover:border-accent/30 transition-all group">
          <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
          <p className="text-xs md:text-sm text-white/60">"The journey of a thousand miles begins with a single step. What is your step today?"</p>
        </div>
        
        <button className="w-full py-3 md:py-4 bg-accent text-black hover:bg-accent/80 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-95">
          <span>Start Your Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
