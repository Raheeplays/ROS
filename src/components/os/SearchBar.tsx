import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { APPS } from '../../config/apps';
import { cn } from '../../lib/utils';

interface SearchBarProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  onOpenApp: (appId: string) => void;
  isPortrait: boolean;
}

export default function SearchBar({
  isSearchOpen,
  setIsSearchOpen,
  onOpenApp,
  isPortrait,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={cn(
      "w-full max-w-2xl relative z-10",
      isPortrait ? "mt-4" : "mt-8"
    )}>
      <div className={cn(
        "relative flex items-center transition-all duration-500",
        isPortrait ? "flex-col" : "flex-row"
      )}>
        {/* Search Input Container */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
            <Search className="w-5 h-5 text-white/40" />
            {!isPortrait && query === '' && (
              <span className="text-sm font-medium text-white/20 tracking-tight">Search ROS X...</span>
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className={cn(
              "w-full bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl py-3 md:py-4 pl-14 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-black/90 transition-all text-base md:text-lg shadow-2xl",
              isSearchOpen ? "rounded-b-none" : ""
            )}
          />

          {/* ROS X Center Label (Landscape) */}
          {!isPortrait && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-lg md:text-xl font-black tracking-tighter text-white/5 group-focus-within:text-accent/10 transition-colors">ROS X</span>
            </div>
          )}

          {/* ROS X Right Label (Portrait) */}
          {isPortrait && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-sm font-black tracking-tighter text-white/20">ROS X</span>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-3xl border-x border-b border-white/10 rounded-b-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-2 max-h-[400px] overflow-auto">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onOpenApp(app.id);
                        setIsSearchOpen(false);
                        setQuery('');
                      }}
                      className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-accent/10 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-all">
                        <app.icon className="w-5 h-5 text-white group-hover:text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">{app.name}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">System Application</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/20 text-sm font-medium italic">
                    No apps found matching "{query}"
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Dynamic Search Active</span>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[10px] text-accent hover:text-accent/80 font-bold uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
