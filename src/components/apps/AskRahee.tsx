import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, HelpCircle, Trash2, Plus, Settings, X, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { cn } from '../../lib/utils';

// Initialize AI outside component to avoid re-initialization
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

interface Persona {
  id: string;
  name: string;
  prompt: string;
  isDefault?: boolean;
}

const DEFAULT_PERSONAS: Persona[] = [
  { id: 'rahee', name: 'Rahee', prompt: "You are Rahee, a wise and helpful AI assistant. You provide deep insights and practical advice. Keep your tone professional yet inspiring.", isDefault: true },
  { id: 'aiza', name: 'Aiza', prompt: "You are Aiza, a friendly and knowledgeable AI assistant. You are empathetic and provide detailed information with a warm tone. You focus on emotional support and clear explanations.", isDefault: true },
];

export default function AskRahee() {
  const [messages, setMessages] = useState<{ id?: string; role: 'user' | 'bot'; content: string; character?: string }[]>([]);
  const [input, setInput] = useState('');
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [newPersona, setNewPersona] = useState({ name: '', prompt: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const questions = ['What', 'Why', 'When', 'How', 'Until'];

  const selectedPersona = selectedPersonaId ? (personas.find(p => p.id === selectedPersonaId) || DEFAULT_PERSONAS[0]) : null;

  useEffect(() => {
    if (!auth.currentUser) return;

    // Load messages
    const messagesPath = `users/${auth.currentUser.uid}/askrahee_messages`;
    const qMessages = query(collection(db, messagesPath), orderBy('timestamp', 'asc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setMessages(msgs);
    }, (error) => handleFirestoreError(error, OperationType.GET, messagesPath));

    // Load custom personas
    const personasPath = `users/${auth.currentUser.uid}/askrahee_personas`;
    const unsubscribePersonas = onSnapshot(collection(db, personasPath), (snapshot) => {
      const customPersonas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Persona[];
      setPersonas([...DEFAULT_PERSONAS, ...customPersonas]);
    }, (error) => handleFirestoreError(error, OperationType.GET, personasPath));

    return () => {
      unsubscribeMessages();
      unsubscribePersonas();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedPersonaId]);

  const handleSend = async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading || !auth.currentUser || !selectedPersona) return;

    const userMessage = { 
      role: 'user' as const, 
      content: trimmedText,
      timestamp: serverTimestamp()
    };
    
    setInput('');
    setLoading(true);

    const path = `users/${auth.currentUser.uid}/askrahee_messages`;
    try {
      await addDoc(collection(db, path), userMessage);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: trimmedText,
        config: {
          systemInstruction: selectedPersona.prompt
        }
      });

      const botMessage = { 
        role: 'bot' as const, 
        content: response.text || "I'm sorry, I couldn't process that.", 
        character: selectedPersona.name,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, path), botMessage);
    } catch (error) {
      if (error instanceof Error && error.message.includes('{"error"')) throw error;
      console.error('Chat error:', error);
      if (error?.code === 'permission-denied') handleFirestoreError(error, OperationType.WRITE, path);

      const errorMessage = { 
        role: 'bot' as const, 
        content: "Error: Could not connect to the AI service. Please check your API key.", 
        character: 'System',
        timestamp: serverTimestamp()
      };
      try {
        await addDoc(collection(db, path), errorMessage);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/askrahee_messages`;
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleAddPersona = async () => {
    if (!newPersona.name.trim() || !newPersona.prompt.trim() || !auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/askrahee_personas`;
    try {
      const personaId = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, path, personaId), {
        name: newPersona.name.trim(),
        prompt: newPersona.prompt.trim(),
        isDefault: false
      });
      setNewPersona({ name: '', prompt: '' });
      setShowPersonaModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deletePersona = async (id: string) => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/askrahee_personas`;
    try {
      await deleteDoc(doc(db, path, id));
      if (selectedPersonaId === id) setSelectedPersonaId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white font-sans overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pr-4">
          <button 
            onClick={() => setSelectedPersonaId(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
              selectedPersonaId === null ? "bg-accent border-accent text-black" : "bg-transparent border-white/20 text-white/40 hover:border-white/40"
            )}
          >
            SELECT MODEL
          </button>
          {personas.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedPersonaId(p.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
                selectedPersonaId === p.id ? "bg-accent border-accent text-black" : "bg-transparent border-white/20 text-white/40 hover:border-white/40"
              )}
            >
              {p.name.toUpperCase()}
            </button>
          ))}
          <button 
            onClick={() => setShowPersonaModal(true)}
            className="p-1.5 rounded-full bg-white/5 border border-white/20 text-white/40 hover:text-accent hover:border-accent transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!selectedPersonaId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-accent">CHOOSE YOUR AI</h2>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Select a persona to start chatting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {personas.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-accent/10 hover:border-accent/30 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/20">{p.isDefault ? 'System' : 'Custom'}</div>
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-2 group-hover:text-accent transition-colors">{p.name}</h3>
                <p className="text-xs text-white/40 line-clamp-2 italic">"{p.prompt.substring(0, 100)}..."</p>
              </button>
            ))}
            <button
              onClick={() => setShowPersonaModal(true)}
              className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 border-dashed hover:bg-white/10 hover:border-accent/30 transition-all flex flex-col items-center justify-center text-center space-y-4 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Plus className="w-6 h-6 text-white/20 group-hover:text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest group-hover:text-accent transition-colors">Create New Model</h3>
                <p className="text-[10px] text-white/20 mt-1">Build your own custom AI persona</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Questions */}
          <div className="px-4 py-2 border-b border-white/5 flex space-x-2 overflow-x-auto no-scrollbar bg-black/30">
            {questions.map(q => (
              <button 
                key={q}
                onClick={() => handleSend(`${q} `)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/40 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollable-layout custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                <HelpCircle className="w-16 h-16 text-accent" />
                <div className="max-w-xs">
                  <p className="text-sm font-bold uppercase tracking-widest">Ask anything to {selectedPersona?.name}</p>
                  <p className="text-xs mt-2">Use the question prompts above or type your own message.</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={m.id || i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[90%] md:max-w-[80%] p-4 rounded-2xl flex space-x-4",
                  m.role === 'user' ? "bg-accent/10 border border-accent/30" : "bg-white/5 border border-white/10"
                )}>
                  <div className="flex-shrink-0">
                    {m.role === 'user' ? <User className="w-5 h-5 text-accent" /> : <Bot className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      {m.role === 'user' ? 'You' : m.character}
                    </div>
                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none break-words">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-black border-t border-white/10 sticky bottom-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${selectedPersona?.name}...`}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:border-accent/50 transition-all text-sm text-white"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent hover:bg-accent/80 disabled:bg-white/10 disabled:text-white/20 rounded-lg flex items-center justify-center transition-all text-black"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}

      {/* Persona Modal */}
      <AnimatePresence>
        {showPersonaModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tighter text-accent uppercase">Manage Personas</h2>
                <button onClick={() => setShowPersonaModal(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                {/* Existing Personas */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Current Models</h3>
                  {personas.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{p.name}</div>
                          <div className="text-[8px] text-white/40 uppercase tracking-widest">{p.isDefault ? 'System' : 'Custom'}</div>
                        </div>
                      </div>
                      {!p.isDefault && (
                        <button 
                          onClick={() => deletePersona(p.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Create New Model</h3>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Persona Name (e.g. Mentor)"
                      value={newPersona.name}
                      onChange={(e) => setNewPersona(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent/50"
                    />
                    <textarea 
                      placeholder="System Prompt (Define how the AI should behave...)"
                      value={newPersona.prompt}
                      onChange={(e) => setNewPersona(prev => ({ ...prev, prompt: e.target.value }))}
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent/50 resize-none"
                    />
                    <button 
                      onClick={handleAddPersona}
                      disabled={!newPersona.name.trim() || !newPersona.prompt.trim()}
                      className="w-full bg-accent text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-accent/80 disabled:opacity-20 transition-all flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Create Model</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
