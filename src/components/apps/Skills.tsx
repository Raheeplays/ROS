import React from 'react';
import { Zap, Book, Code, Palette, Music } from 'lucide-react';

export default function Skills() {
  const skills = [
    { name: 'Web Development', icon: Code, level: 'Advanced' },
    { name: 'UI/UX Design', icon: Palette, level: 'Intermediate' },
    { name: 'Music Theory', icon: Music, level: 'Beginner' },
    { name: 'Public Speaking', icon: Book, level: 'Intermediate' },
  ];

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 scrollable-layout">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">RAHEE SKILLS</h1>
      <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12">Knowledge Acquisition</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {skills.map(s => (
          <div key={s.name} className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4 md:space-x-6 hover:border-accent/30 transition-all group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <s.icon className="w-7 h-7 md:w-8 md:h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors">{s.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Zap className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{s.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
