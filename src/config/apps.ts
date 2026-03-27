import { 
  MessageSquare, 
  Code, 
  Globe, 
  BookOpen, 
  Map, 
  Activity, 
  Box, 
  Target, 
  Trophy, 
  Zap, 
  Clock, 
  Moon, 
  Settings, 
  Footprints, 
  BarChart, 
  Users 
} from 'lucide-react';
import React from 'react';

export interface AppConfig {
  id: string;
  name: string;
  icon: any;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const APPS: AppConfig[] = [
  { id: 'ask-rahee', name: 'Ask Rahee', icon: MessageSquare, component: React.lazy(() => import('../components/apps/AskRahee')) },
  { id: 'coding', name: 'Coding', icon: Code, component: React.lazy(() => import('../components/apps/Coding')) },
  { id: 'universe', name: 'Connect To Universe', icon: Globe, component: React.lazy(() => import('../components/apps/Universe')) },
  { id: 'lsrw', name: 'LSRW', icon: BookOpen, component: React.lazy(() => import('../components/apps/LSRW')) },
  { id: 'mind-mapping', name: 'Mind Mapping', icon: Map, component: React.lazy(() => import('../components/apps/MindMapping')) },
  { id: 'mpes', name: 'MPES', icon: Activity, component: React.lazy(() => import('../components/apps/MPES')) },
  { id: 'rahee-one', name: 'Rahee One', icon: Box, component: React.lazy(() => import('../components/apps/RaheeOne')) },
  { id: 'practice', name: 'Practice', icon: Target, component: React.lazy(() => import('../components/apps/Practice')) },
  { id: 'challenges', name: 'Rahee Challenges', icon: Trophy, component: React.lazy(() => import('../components/apps/Challenges')) },
  { id: 'skills', name: 'Rahee Skills', icon: Zap, component: React.lazy(() => import('../components/apps/Skills')) },
  { id: 'times', name: 'Rahee Times', icon: Clock, component: React.lazy(() => import('../components/apps/Times')) },
  { id: 'dreaming', name: 'Smart Dreaming', icon: Moon, component: React.lazy(() => import('../components/apps/Dreaming')) },
  { id: 'manager', name: 'Smart Manager', icon: Settings, component: React.lazy(() => import('../components/apps/Manager')) },
  { id: 'step-one', name: 'Step One', icon: Footprints, component: React.lazy(() => import('../components/apps/StepOne')) },
  { id: 'tracking', name: 'Tracking', icon: BarChart, component: React.lazy(() => import('../components/apps/Tracking')) },
  { id: 'family', name: 'Virtual Family', icon: Users, component: React.lazy(() => import('../components/apps/Family')) },
];
