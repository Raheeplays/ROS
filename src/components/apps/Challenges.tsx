import React from 'react';
import { Trophy, Award, Flame } from 'lucide-react';

export default function Challenges() {
  return (
    <div className="h-full bg-black text-white p-6 md:p-8 scrollable-layout">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">RAHEE CHALLENGES</h1>
      <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12">Push Your Limits</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-6 md:p-8 rounded-3xl bg-accent/5 border border-accent/20 flex flex-col items-center text-center hover:bg-accent/10 transition-all group">
          <Flame className="w-10 h-10 md:w-12 md:h-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-accent transition-colors">30 Day Code</h2>
          <p className="text-[10px] md:text-xs text-white/40">Day 12 of 30</p>
        </div>
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all group">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white/40 group-hover:text-accent mb-6 transition-colors" />
          <h2 className="text-lg md:text-xl font-bold mb-2">Marathon Prep</h2>
          <p className="text-[10px] md:text-xs text-white/40">Locked</p>
        </div>
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all group">
          <Award className="w-10 h-10 md:w-12 md:h-12 text-white/40 group-hover:text-accent mb-6 transition-colors" />
          <h2 className="text-lg md:text-xl font-bold mb-2">Master Reader</h2>
          <p className="text-[10px] md:text-xs text-white/40">Locked</p>
        </div>
      </div>
    </div>
  );
}
