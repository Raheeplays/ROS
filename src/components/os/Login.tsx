import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoginProps {
  onLogin: (name: string, key: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && key) {
      onLogin(name, key);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-accent/40 flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-black text-black tracking-tighter">X</span>
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">ROS X</h1>
          <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Universe Operating System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Identity</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-4">Access Key</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter Key"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-lg"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-black font-black py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all mt-4 text-lg"
          >
            INITIALIZE SYSTEM
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
            Secure Connection Established • v1.0.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
