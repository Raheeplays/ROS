export interface User {
  name: string;
  key: string;
  wallpaper: string;
  darkMode: boolean;
  isAdmin?: boolean;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface OSState {
  user: User | null;
  windows: WindowState[];
  activeWindowId: string | null;
  recentApps: string[]; // App IDs
  isSearchOpen: boolean;
}
