import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Trash2, X } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { cn } from '../../lib/utils';

interface ScheduleItem {
  id: string;
  time: string;
  task: string;
}

export default function Times() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'users', auth.currentUser.uid, 'apps', 'times');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSchedule(docSnap.data().items || []);
      } else {
        const initialSchedule = [
          { id: '1', time: '08:00 AM', task: 'Morning Routine' },
          { id: '2', time: '09:30 AM', task: 'Deep Work Session' },
          { id: '3', time: '01:00 PM', task: 'Lunch & Rest' },
          { id: '4', time: '02:30 PM', task: 'Skill Learning' },
          { id: '5', time: '06:00 PM', task: 'Exercise' },
        ];
        setSchedule(initialSchedule);
        setDoc(docRef, { items: initialSchedule });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveSchedule = async (newItems: ScheduleItem[]) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'apps', 'times'), {
        items: newItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving times data:', error);
    }
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTask) return;
    const item: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      task: newTask
    };
    const newSchedule = [...schedule, item].sort((a, b) => a.time.localeCompare(b.time));
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
    setNewTime('');
    setNewTask('');
    setShowAddModal(false);
  };

  const removeItem = (id: string) => {
    const newSchedule = schedule.filter(item => item.id !== id);
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
  };

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-accent">RAHEE TIMES</h1>
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Schedule & Timetable</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 md:p-3 bg-accent text-black rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-32 opacity-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 opacity-20 text-center">
            <Clock className="w-12 h-12 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No schedule items</p>
          </div>
        ) : (
          schedule.map((s) => (
            <div key={s.id} className="flex items-center space-x-4 md:space-x-6 p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
              <div className="w-20 md:w-24 text-xs md:text-sm font-black text-accent">{s.time}</div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex-1 text-base md:text-lg font-medium group-hover:text-accent transition-colors">{s.task}</div>
              <button 
                onClick={() => removeItem(s.id)}
                className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-tighter text-accent">ADD SCHEDULE</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Time</label>
                <input 
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Task</label>
                <input 
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Morning Routine"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest rounded-xl hover:bg-accent/80 transition-all active:scale-95 mt-4"
              >
                Add to Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
