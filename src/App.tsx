import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from './lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { User, WindowState, OSState } from './types/os';
import Login from './components/os/Login';
import Desktop from './components/os/Desktop';
import Taskbar from './components/os/Taskbar';
import { APPS } from './config/apps';

import SplashScreen from './components/os/SplashScreen';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState('https://picsum.photos/seed/rosx/1920/1080');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
          setIsDarkMode(userData.darkMode || false);
          setWallpaper(userData.wallpaper || 'https://picsum.photos/seed/rosx/1920/1080');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (name: string, key: string) => {
    setLoading(true);
    try {
      // For simplicity, we use anonymous auth and store user data by UID
      const { user: firebaseUser } = await signInAnonymously(auth);
      const isAdmin = name.toLowerCase() === 'rahee' && key === '786';
      const userData: User = {
        name,
        key,
        wallpaper: 'https://picsum.photos/seed/rosx/1920/1080',
        darkMode: true, // Default to dark mode for the new theme
        isAdmin,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser(userData);
      setIsDarkMode(true);
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled in Login component via props if we passed it, 
      // but here we'll just log it. The Login component should handle its own local error state.
    } finally {
      setLoading(false);
    }
  };

  const openApp = (appId: string) => {
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      setActiveWindowId(existingWindow.id);
      setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w));
      return;
    }

    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    // Responsive window sizing
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? window.innerWidth * 0.95 : 800;
    const height = isMobile ? window.innerHeight * 0.7 : 600;
    const x = isMobile ? (window.innerWidth - width) / 2 : 100 + windows.length * 20;
    const y = isMobile ? 20 : 100 + windows.length * 20;

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: app.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile, // Maximize by default on mobile
      zIndex: windows.length + 100, // Base z-index 100
      position: { x, y },
      size: { width, height },
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setRecentApps(prev => [appId, ...prev.filter(id => id !== appId)].slice(0, 5));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(100, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  };

  if (isBooting) {
    return <SplashScreen onComplete={() => setIsBooting(false)} />;
  }

  if (loading) {
    return null; // SplashScreen handles the first 3 seconds
  }

  return (
    <div className={cn("h-screen w-screen overflow-hidden select-none", isDarkMode ? "dark" : "")}>
      <AnimatePresence mode="wait">
        {!user ? (
          <Login key="login" onLogin={handleLogin} />
        ) : (
          <div key="desktop" className="h-full w-full relative bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            <Desktop 
              windows={windows}
              activeWindowId={activeWindowId}
              onOpenApp={openApp}
              onFocusWindow={focusWindow}
              onCloseWindow={closeWindow}
              onMinimizeWindow={toggleMinimize}
              onMaximizeWindow={toggleMaximize}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />

            <Taskbar 
              userName={user.name}
              recentApps={recentApps}
              onOpenApp={openApp}
              activeWindowId={activeWindowId}
              windows={windows}
              onFocusWindow={focusWindow}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Utility for cn
import { cn } from './lib/utils';
