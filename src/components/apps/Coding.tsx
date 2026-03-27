import React, { useState, useEffect } from 'react';
import { Save, Play, FileText, Settings, Search, CheckCircle2 } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { cn } from '../../lib/utils';

export default function Coding() {
  const [code, setCode] = useState('// Welcome to ROS X Coding\n\nfunction hello() {\n  console.log("Hello Rahee!");\n}\n\nhello();');
  const [fileName, setFileName] = useState('main.js');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'apps', 'coding');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.code) setCode(data.code);
          if (data.fileName) setFileName(data.fileName);
        }
      } catch (error) {
        console.error('Error loading coding data:', error);
      }
    };
    loadData();
  }, []);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code && auth.currentUser) {
        handleSave();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [code, fileName]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'apps', 'coding'), {
        code,
        fileName,
        updatedAt: new Date()
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving coding data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white font-mono scrollable-layout">
      {/* Toolbar */}
      <div className="h-10 bg-[#080808] border-b border-white/5 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <FileText className="w-3 h-3 text-accent" />
            <span>{fileName}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 hover:bg-accent/10 rounded transition-colors group disabled:opacity-50" 
              title="Save"
            >
              <Save className={cn("w-4 h-4 text-white/20 group-hover:text-accent", isSaving && "animate-pulse")} />
            </button>
            <button className="p-1 hover:bg-accent/20 rounded transition-colors group" title="Run">
              <Play className="w-4 h-4 text-accent" />
            </button>
          </div>
          {lastSaved && (
            <div className="flex items-center space-x-1 text-[8px] text-white/20 uppercase tracking-widest">
              <CheckCircle2 className="w-2 h-2" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-4 h-4 text-white/20 hover:text-accent cursor-pointer transition-colors" />
          <Settings className="w-4 h-4 text-white/20 hover:text-accent cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="w-10 md:w-12 bg-black border-r border-white/5 py-4 flex flex-col items-center text-[10px] text-white/10 select-none no-scrollbar overflow-y-auto">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent p-4 resize-none focus:outline-none text-xs md:text-sm leading-6 text-accent selection:bg-accent/30 no-scrollbar overflow-y-auto"
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-accent flex items-center px-4 justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black">
        <div className="flex items-center space-x-4">
          <span>SYSTEM READY</span>
          <span className="hidden md:inline">UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>JAVASCRIPT</span>
          <span className="hidden md:inline">Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
}
