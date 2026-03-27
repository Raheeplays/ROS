import React from 'react';
import { BookOpen, Mic, Headphones, PenTool } from 'lucide-react';

export default function LSRW() {
  const modes = [
    { id: 'listen', name: 'Listen', icon: Headphones, color: 'text-blue-400' },
    { id: 'speak', name: 'Speak', icon: Mic, color: 'text-red-400' },
    { id: 'read', name: 'Read', icon: BookOpen, color: 'text-green-400' },
    { id: 'write', name: 'Write', icon: PenTool, color: 'text-purple-400' },
  ];

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 scrollable-layout">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">LSRW</h1>
        <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12">Language Skills Mastery</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {modes.map(m => (
            <div key={m.id} className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-accent/10 hover:border-accent/30 transition-all cursor-pointer group">
              <m.icon className="w-10 h-10 md:w-12 md:h-12 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{m.name}</h2>
              <p className="text-white/40 text-xs md:text-sm">Practice your {m.id} skills with interactive exercises and real-time feedback.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
