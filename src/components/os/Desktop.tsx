import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Maximize2, Minimize2, Square, LayoutGrid } from 'lucide-react';
import { WindowState } from '../../types/os';
import { APPS } from '../../config/apps';
import Window from './Window';
import SearchBar from './SearchBar';
import { cn } from '../../lib/utils';

interface DesktopProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onOpenApp: (appId: string) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export default function Desktop({
  windows,
  activeWindowId,
  onOpenApp,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  isSearchOpen,
  setIsSearchOpen,
}: DesktopProps) {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasMaximizedWindow = windows.some(w => w.isMaximized && !w.isMinimized);

  return (
    <div className="h-full w-full relative p-4 flex flex-col items-center">
      {/* Search Bar */}
      <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} onOpenApp={onOpenApp} isPortrait={isPortrait} />

      {/* Date/Time Widget (Mobile/Portrait) */}
      {isPortrait && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center text-white drop-shadow-lg"
        >
          <div className="text-6xl font-light">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-xl opacity-80">{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <span className="text-2xl">☀️</span>
            <span className="text-2xl font-medium">24°C</span>
          </div>
        </motion.div>
      )}

      {/* App Grid */}
      <div className={cn(
        "grid gap-4 md:gap-6 mt-8 md:mt-12 transition-all duration-500 overflow-y-auto max-h-[calc(100vh-200px)] p-4 no-scrollbar",
        isPortrait ? "grid-cols-4" : "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
      )}>
        {APPS.map((app) => (
          <motion.button
            key={app.id}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center justify-center p-2 md:p-3 rounded-2xl transition-colors group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:border-accent/50 transition-all">
              <app.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[9px] md:text-[10px] mt-2 text-white font-medium text-center drop-shadow-md max-w-[60px] md:max-w-[70px] leading-tight opacity-80 group-hover:opacity-100">
              {app.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => {
          const app = APPS.find(a => a.id === window.appId);
          if (!app) return null;
          
          return !window.isMinimized && (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindowId === window.id}
              onFocus={() => onFocusWindow(window.id)}
              onClose={() => onCloseWindow(window.id)}
              onMinimize={() => onMinimizeWindow(window.id)}
              onMaximize={() => onMaximizeWindow(window.id)}
            >
              <React.Suspense fallback={<div className="h-full w-full flex items-center justify-center text-white/20">Loading App...</div>}>
                <app.component />
              </React.Suspense>
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
