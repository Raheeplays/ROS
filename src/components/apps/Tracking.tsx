import React from 'react';
import { BarChart, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function Tracking() {
  return (
    <div className="h-full bg-black text-white p-6 md:p-8 scrollable-layout">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">TRACKING</h1>
      <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-12">OS Analytics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors">Activity</h2>
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div className="h-24 md:h-32 flex items-end space-x-2">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-accent/20 rounded-t-lg group-hover:bg-accent/40 transition-all" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors">Growth</h2>
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          </div>
          <div className="h-24 md:h-32 flex items-center justify-center">
            <PieChart className="w-16 h-16 md:w-24 md:h-24 text-accent/20 group-hover:text-accent/40 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
