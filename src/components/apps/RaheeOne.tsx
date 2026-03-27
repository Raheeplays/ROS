import React from 'react';
import { Box, Star, TrendingUp, Zap, Shield, Globe, Cpu, Layout, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const HUB_ITEMS = [
  { icon: MessageSquare, label: 'Ask Rahee', desc: 'AI Assistant', color: 'text-blue-400' },
  { icon: Globe, label: 'Universe', desc: 'Explore Worlds', color: 'text-purple-400' },
  { icon: Cpu, label: 'Manager', desc: 'System Control', color: 'text-green-400' },
  { icon: Shield, label: 'Security', desc: 'Privacy First', color: 'text-red-400' },
  { icon: Zap, label: 'Skills', desc: 'Mastery Path', color: 'text-yellow-400' },
  { icon: Layout, label: 'Step One', desc: 'Begin Journey', color: 'text-accent' },
];

export default function RaheeOne() {
  return (
    <div className="h-full bg-black text-white p-6 md:p-12 overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-accent/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/10">
            <Box className="w-12 h-12 text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">RAHEE ONE</h1>
            <p className="text-accent text-xs font-bold uppercase tracking-[0.5em]">The Ultimate Ecosystem</p>
          </div>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Welcome to the heart of ROS X. Manage your AI personas, explore virtual universes, and track your growth in one unified interface.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-black">4.9</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">User Rating</div>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-black">1.2M</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Nodes</div>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-black">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Uptime</div>
            </div>
          </div>
        </div>

        {/* Hub Grid */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 px-2">Ecosystem Apps</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HUB_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-white/10 transition-all group text-left"
              >
                <item.icon className={cn("w-8 h-8 mb-4 group-hover:scale-110 transition-transform", item.color)} />
                <div className="text-lg font-bold group-hover:text-accent transition-colors">{item.label}</div>
                <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest mt-1">{item.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <div className="text-[10px] font-bold uppercase tracking-widest">ROS X Version 1.0.4</div>
          <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Support</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
