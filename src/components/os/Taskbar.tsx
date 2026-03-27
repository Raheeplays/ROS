import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Sun, Clock as ClockIcon } from 'lucide-react';
import { WindowState } from '../../types/os';
import { APPS } from '../../config/apps';
import { cn } from '../../lib/utils';

interface TaskbarProps {
  userName: string;
  recentApps: string[];
  onOpenApp: (appId: string) => void;
  activeWindowId: string | null;
  windows: WindowState[];
  onFocusWindow: (id: string) => void;
}

export default function Taskbar({
  userName,
  recentApps,
  onOpenApp,
  activeWindowId,
  windows,
  onFocusWindow,
}: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 md:h-16 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center px-4 md:px-6 justify-between z-[9999]">
      {/* Left: User Name */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer group">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent flex items-center justify-center text-[9px] md:text-[10px] font-bold text-black">
            {userName[0].toUpperCase()}
          </div>
          <span className="text-[10px] md:text-sm font-medium text-white/80 tracking-tight group-hover:text-accent transition-colors">@{userName}</span>
        </div>
      </div>

      {/* Center: Recent Apps */}
      <div className="flex items-center space-x-2">
        {/* Weather */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mr-2 md:mr-4">
          <Sun className="w-3 h-3 md:w-4 md:h-4 text-accent" />
          <span className="text-[10px] md:text-xs font-bold text-white/80">24°C</span>
        </div>

        <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-[150px] md:max-w-none">
          {recentApps.map((appId) => {
            const app = APPS.find(a => a.id === appId);
            if (!app) return null;
            const isOpen = windows.some(w => w.appId === appId);
            const isActive = windows.find(w => w.appId === appId)?.id === activeWindowId;

            return (
              <motion.button
                key={appId}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const win = windows.find(w => w.appId === appId);
                  if (win) onFocusWindow(win.id);
                  else onOpenApp(appId);
                }}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all relative group",
                  isActive ? "bg-accent/20 shadow-lg shadow-accent/10" : "hover:bg-white/10"
                )}
              >
                <app.icon className={cn("w-4 h-4 md:w-5 md:h-5", isActive ? "text-accent" : "text-white/60")} />
                {isOpen && (
                  <div className={cn(
                    "absolute -bottom-1 w-1 h-1 rounded-full transition-all",
                    isActive ? "bg-accent w-3" : "bg-white/40"
                  )} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right: Date/Time */}
      <div className="flex items-center space-x-2 md:space-x-4 text-right">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] md:text-sm font-bold text-white tracking-tighter">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="hidden md:block text-[10px] font-medium text-white/40 uppercase tracking-widest">
            {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
