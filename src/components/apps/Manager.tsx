import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Monitor, 
  HardDrive, 
  Cpu, 
  Wifi, 
  Smartphone, 
  Volume2, 
  Bell, 
  Battery, 
  User, 
  Info, 
  Maximize,
  Palette,
  Clock,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Manager() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const settings = [
    { id: 'system', name: 'System', icon: Monitor },
    { id: 'datetime', name: 'Date & Time', icon: Clock },
    { id: 'connections', name: 'Connections', icon: Wifi },
    { id: 'devices', name: 'Connected Devices', icon: Smartphone },
    { id: 'display', name: 'Display & Sound', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'battery', name: 'Battery', icon: Battery },
    { id: 'accounts', name: 'Accounts', icon: User },
    { id: 'about', name: 'About Device', icon: Info },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'system':
        return (
          <div className="space-y-8 max-w-2xl">
            <section>
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center space-x-2 uppercase tracking-widest text-white/40">
                <Monitor className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                <span>Quick Controls</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3 hover:bg-accent/10 hover:border-accent/30 transition-all group"
                >
                  {isDark ? <Moon className="w-6 h-6 md:w-8 md:h-8 text-accent" /> : <Sun className="w-6 h-6 md:w-8 md:h-8 text-accent" />}
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-accent">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3 hover:bg-accent/10 hover:border-accent/30 transition-all group"
                >
                  <Maximize className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-accent">
                    {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                  </span>
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center space-x-2 uppercase tracking-widest text-white/40">
                <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                <span>Resource Monitor</span>
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span>Storage</span>
                    <span>42.5 GB / 128 GB</span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[33%] rounded-full shadow-[0_0_10px_rgba(50,190,250,0.5)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span>RAM Usage</span>
                    <span>3.2 GB / 8 GB</span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[40%] rounded-full shadow-[0_0_10px_rgba(50,190,250,0.5)]" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm md:text-lg font-bold mb-4 flex items-center space-x-2 uppercase tracking-widest text-white/40">
                <Cpu className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                <span>Active Processes</span>
              </h2>
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm">
                    <thead className="bg-white/5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40">
                      <tr>
                        <th className="px-4 py-3">App</th>
                        <th className="px-4 py-3">CPU</th>
                        <th className="px-4 py-3">Memory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 font-medium">ROS X Kernel</td>
                        <td className="px-4 py-3 text-accent">1.2%</td>
                        <td className="px-4 py-3 text-white/60">450 MB</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Smart Manager</td>
                        <td className="px-4 py-3 text-accent">0.8%</td>
                        <td className="px-4 py-3 text-white/60">120 MB</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Ask Rahee</td>
                        <td className="px-4 py-3 text-accent">0.5%</td>
                        <td className="px-4 py-3 text-white/60">85 MB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        );
      case 'datetime':
        return (
          <div className="space-y-8 max-w-2xl">
            <section className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
              <Clock className="w-16 h-16 text-accent mx-auto mb-6" />
              <div className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xl md:text-2xl text-white/40 font-bold uppercase tracking-widest mt-4">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Time Zone</h3>
                <p className="text-sm font-bold text-accent">UTC +05:30 (India Standard Time)</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Time Format</h3>
                <p className="text-sm font-bold text-accent">24-Hour Clock</p>
              </div>
            </section>
          </div>
        );
      case 'about':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/20">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-black">X</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">ROS X</h1>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-sm mt-2">Version 1.0.0 (Stable)</p>
            </div>
            <div className="max-w-md text-xs md:text-sm text-white/60 leading-relaxed px-4">
              ROS X is a next-generation operating system simulation designed for productivity, learning, and personal growth.
            </div>
            <div className="pt-8 border-t border-white/5 w-full max-w-sm flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 px-4">
              <span>Developer: Rahee</span>
              <span>Build: 2026.03.27</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
            <Monitor className="w-20 h-20 mb-6 text-accent" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Select a setting</h2>
            <p className="text-xs mt-2">Configure your ROS X environment</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-black text-white font-sans overflow-hidden relative">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-64 bg-white/5 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col space-y-2 overflow-y-auto no-scrollbar transition-all duration-300",
        activeTab && "hidden"
      )}>
        <div className="px-4 py-6 mb-2 md:mb-4">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-accent">
            SMART MANAGER
          </h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">OS Control Center</p>
        </div>
        
        <div className="flex flex-col space-y-1">
          {settings.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-[10px] md:text-sm font-bold uppercase tracking-widest text-left",
                activeTab === s.id ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <s.icon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar relative",
        !activeTab && "hidden md:block"
      )}>
        {activeTab && (
          <button 
            onClick={() => setActiveTab(null)}
            className="absolute top-4 left-4 p-2 bg-white/5 rounded-full text-accent z-10 hover:bg-accent/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div className={cn(activeTab && "pt-12 md:pt-0")}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
