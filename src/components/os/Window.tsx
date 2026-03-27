import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Minus, Square, Copy, MoreHorizontal } from 'lucide-react';
import { WindowState } from '../../types/os';
import { cn } from '../../lib/utils';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}

export default function Window({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  children,
}: WindowProps) {
  const [isResizing, setIsResizing] = useState(false);
  const controls = useDragControls();

  return (
    <motion.div
      drag={!win.isMaximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        zIndex: win.zIndex,
        width: win.isMaximized ? '100%' : (window.innerWidth < 768 ? '95%' : win.size.width),
        height: win.isMaximized ? 'calc(100% - 56px)' : (window.innerWidth < 768 ? '80%' : win.size.height),
        top: win.isMaximized ? 0 : (window.innerWidth < 768 ? '5%' : win.position.y),
        left: win.isMaximized ? 0 : (window.innerWidth < 768 ? '2.5%' : win.position.x),
      }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      onPointerDown={onFocus}
      className={cn(
        "absolute flex flex-col bg-black rounded-xl overflow-hidden shadow-2xl border transition-all duration-300",
        isActive ? "border-accent/40 ring-1 ring-accent/10" : "border-white/5 opacity-90",
        win.isMaximized ? "rounded-none" : ""
      )}
    >
      {/* Title Bar */}
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="h-10 bg-[#111] flex items-center justify-between px-4 cursor-default select-none group"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-white/10 hover:bg-red-500 transition-colors flex items-center justify-center group/btn">
              <X className="w-2 h-2 text-black/40 opacity-0 group-hover/btn:opacity-100" />
            </button>
            <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-white/10 hover:bg-yellow-500 transition-colors flex items-center justify-center group/btn">
              <Minus className="w-2 h-2 text-black/40 opacity-0 group-hover/btn:opacity-100" />
            </button>
            <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-white/10 hover:bg-accent transition-colors flex items-center justify-center group/btn">
              <Square className="w-1.5 h-1.5 text-black/40 opacity-0 group-hover/btn:opacity-100" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2 group-hover:text-accent transition-colors">{win.title}</span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-white/20 text-[9px] font-bold uppercase tracking-tighter">
            <span className="hover:text-accent cursor-pointer">File</span>
            <span className="hover:text-accent cursor-pointer">Edit</span>
            <span className="hover:text-accent cursor-pointer">View</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-[#080808] border-b border-white/5 flex items-center px-4 space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-accent/20 hover:text-accent cursor-pointer transition-colors">
            <Copy className="w-3 h-3 text-white/20" />
          </div>
        </div>
        <div className="flex-1 h-6 bg-black/40 rounded-lg border border-white/5 flex items-center px-3 text-[9px] text-white/20 font-mono overflow-hidden whitespace-nowrap">
          ros-x://{win.appId}/main
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative bg-black scrollable-layout">
        {children}
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize active:bg-blue-500/20 transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />
      )}
    </motion.div>
  );
}

import { LayoutGrid } from 'lucide-react';
