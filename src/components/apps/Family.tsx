import React, { useState, useEffect, useRef } from 'react';
import { Users, User, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, getDocs, where } from 'firebase/firestore';
import { cn } from '../../lib/utils';

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  throw error;
}

export default function Family() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id?: string; role: 'user' | 'bot'; content: string; memberId: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const members = [
    { id: 'father', name: 'Father', icon: User, color: 'bg-blue-500', prompt: "You are the user's father. You are supportive, wise, and occasionally tell dad jokes. You care deeply about your family's well-being." },
    { id: 'mother', name: 'Mother', icon: User, color: 'bg-pink-500', prompt: "You are the user's mother. You are nurturing, observant, and always want to make sure everyone is fed and happy. You give great emotional advice." },
    { id: 'brother', name: 'Brother', icon: User, color: 'bg-green-500', prompt: "You are the user's brother. You are protective, a bit competitive, but always have your sibling's back. You like talking about games, sports, and life." },
    { id: 'sister', name: 'Sister', icon: User, color: 'bg-purple-500', prompt: "You are the user's sister. You are creative, insightful, and love sharing gossip or deep thoughts. You are a great listener." },
    { id: 'friend', name: 'Friend', icon: User, color: 'bg-yellow-500', prompt: "You are the user's best friend. You are loyal, fun-loving, and always ready for an adventure. You speak casually and use slang." },
  ];

  useEffect(() => {
    if (!auth.currentUser || !selectedMember) {
      if (!selectedMember) setMessages([]);
      return;
    }

    const path = `users/${auth.currentUser.uid}/family_messages`;
    const q = query(
      collection(db, path),
      where('memberId', '==', selectedMember),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [selectedMember]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedText = input.trim();
    if (!trimmedText || loading || !auth.currentUser || !selectedMember) return;

    const userMessage = { 
      role: 'user' as const, 
      content: trimmedText,
      memberId: selectedMember,
      timestamp: serverTimestamp()
    };
    
    setInput('');
    setLoading(true);

    const path = `users/${auth.currentUser.uid}/family_messages`;
    try {
      await addDoc(collection(db, path), userMessage);

      const member = members.find(m => m.id === selectedMember);
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: trimmedText,
        config: {
          systemInstruction: member?.prompt || "You are a family member."
        }
      });

      const botMessage = { 
        role: 'bot' as const, 
        content: response.text || "...", 
        memberId: selectedMember,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, path), botMessage);
    } catch (error) {
      if (error instanceof Error && error.message.includes('{"error"')) {
        throw error;
      }
      console.error('Family chat error:', error);
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!auth.currentUser || !selectedMember) return;
    const path = `users/${auth.currentUser.uid}/family_messages`;
    try {
      const q = query(
        collection(db, path),
        where('memberId', '==', selectedMember)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col md:flex-row scrollable-layout">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-64 bg-[#080808] border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col space-y-2 transition-all duration-300",
        selectedMember ? "hidden md:flex" : "flex"
      )}>
        <h1 className="text-xl font-black tracking-tighter px-4 py-6 text-accent">VIRTUAL FAMILY</h1>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMember(m.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group",
                selectedMember === m.id ? "bg-accent/10 text-accent border border-accent/20" : "text-white/40 hover:bg-white/5 border border-transparent"
              )}
            >
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", selectedMember === m.id ? "bg-accent text-black" : "bg-white/10")}>
                <m.icon className={cn("w-4 h-4", selectedMember === m.id ? "text-black" : "text-white/40")} />
              </div>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-black",
        !selectedMember ? "hidden md:flex" : "flex"
      )}>
        {selectedMember ? (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#080808]">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="md:hidden p-2 hover:bg-white/5 rounded-lg text-white/40"
                >
                  <Users className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <h2 className="font-bold text-accent">{members.find(m => m.id === selectedMember)?.name}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={clearChat}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Heart className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 p-6 flex flex-col space-y-6 overflow-y-auto custom-scrollbar scrollable-layout">
              {messages.length === 0 && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                  <MessageCircle className="w-16 h-16 mb-4 text-accent" />
                  <p className="text-sm font-bold uppercase tracking-widest">Start a conversation with your {selectedMember}</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={m.id || i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl",
                    m.role === 'user' ? "bg-accent/10 border border-accent/30 text-white" : "bg-white/5 border border-white/10 text-white/80"
                  )}>
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-[#080808] border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50 transition-all text-sm pr-12"
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:bg-accent/10 disabled:opacity-20 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-12">
            <Users className="w-20 h-20 md:w-24 md:h-24 mb-6 text-accent" />
            <h2 className="text-xl md:text-2xl font-bold">Select a family member</h2>
            <p className="text-xs mt-2">Choose someone to start a virtual conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
