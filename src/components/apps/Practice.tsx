import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { cn } from '../../lib/utils';

interface PracticeItem {
  id: string;
  text: string;
  done: boolean;
}

export default function Practice() {
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'users', auth.currentUser.uid, 'apps', 'practice');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setItems(docSnap.data().items || []);
      } else {
        // Initial data
        const initialItems = [
          { id: '1', text: 'Morning Meditation', done: true },
          { id: '2', text: 'Coding Challenge', done: false },
          { id: '3', text: 'Reading 20 Pages', done: false },
          { id: '4', text: 'Workout Session', done: true },
        ];
        setItems(initialItems);
        setDoc(docRef, { items: initialItems });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveItems = async (newItems: PracticeItem[]) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'apps', 'practice'), {
        items: newItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving practice data:', error);
    }
  };

  const toggleDone = (id: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setItems(newItems);
    saveItems(newItems);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const item: PracticeItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newItem.trim(),
      done: false
    };
    const newItems = [...items, item];
    setItems(newItems);
    saveItems(newItems);
    setNewItem('');
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveItems(newItems);
  };

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 flex flex-col overflow-hidden">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">PRACTICE</h1>
        <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Daily Discipline</p>
      </div>

      <form onSubmit={addItem} className="mb-6 flex space-x-2">
        <input 
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new discipline..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
        />
        <button 
          type="submit"
          className="p-2 bg-accent text-black rounded-xl hover:bg-accent/80 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-32 opacity-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 opacity-20 text-center">
            <Target className="w-12 h-12 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No disciplines yet</p>
          </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group"
            >
              <div 
                onClick={() => toggleDone(item.id)}
                className="flex-1 flex items-center space-x-4 cursor-pointer"
              >
                {item.done ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent" /> : <Circle className="w-5 h-5 md:w-6 md:h-6 text-white/20 group-hover:text-accent/50 transition-colors" />}
                <span className={cn(
                  "text-sm md:text-base transition-all",
                  item.done ? "line-through opacity-20" : "group-hover:text-accent"
                )}>
                  {item.text}
                </span>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
