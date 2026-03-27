import React from 'react';
import { Activity, Heart, Brain, Zap, Sparkles } from 'lucide-react';

export default function MPES() {
  const metrics = [
    { name: 'Mental', icon: Brain, color: 'text-blue-400', value: 85 },
    { name: 'Physical', icon: Activity, color: 'text-red-400', value: 70 },
    { name: 'Emotional', icon: Heart, color: 'text-pink-400', value: 92 },
    { name: 'Spiritual', icon: Sparkles, color: 'text-purple-400', value: 65 },
  ];

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 scrollable-layout">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">MPES</h1>
      <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12">Holistic Health Tracker</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {metrics.map(m => (
          <div key={m.name} className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <m.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <h2 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors">{m.name}</h2>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-accent">{m.value}%</span>
            </div>
            <div className="h-2 md:h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgba(50,190,250,0.5)]" 
                style={{ width: `${m.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
