import React from 'react';
import { Map, Plus, Share2, Download } from 'lucide-react';

export default function MindMapping() {
  return (
    <div className="h-full bg-black text-white flex flex-col scrollable-layout">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#080808]">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-accent">MIND MAPPING</h1>
          <div className="h-4 w-px bg-white/10" />
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-accent text-black rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-accent/80 transition-all">
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">New Topic</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <Share2 className="w-4 h-4 text-white/20 cursor-pointer hover:text-accent transition-colors" />
          <Download className="w-4 h-4 text-white/20 cursor-pointer hover:text-accent transition-colors" />
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-12">
        <div className="relative group">
          <div className="px-6 md:px-8 py-3 md:py-4 bg-accent text-black rounded-2xl shadow-2xl shadow-accent/20 text-lg md:text-xl font-black border border-white/20 cursor-move active:scale-95 transition-all">
            Main Topic
          </div>
          
          {/* Mock branches */}
          <div className="absolute top-1/2 left-full w-12 md:w-16 h-px bg-accent/30" />
          <div className="absolute top-1/2 right-full w-12 md:w-16 h-px bg-accent/30" />
          <div className="absolute bottom-full left-1/2 w-px h-12 md:h-16 bg-accent/30" />
          <div className="absolute top-full left-1/2 w-px h-12 md:h-16 bg-accent/30" />
          
          <div className="absolute top-1/2 left-[calc(100%+48px)] md:left-[calc(100%+64px)] -translate-y-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-sm whitespace-nowrap hover:border-accent/50 transition-all cursor-pointer">Subtopic 1</div>
          <div className="absolute top-1/2 right-[calc(100%+48px)] md:right-[calc(100%+64px)] -translate-y-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-sm whitespace-nowrap hover:border-accent/50 transition-all cursor-pointer">Subtopic 2</div>
        </div>
      </div>
    </div>
  );
}
