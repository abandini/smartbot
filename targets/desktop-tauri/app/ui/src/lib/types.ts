// Core types for Smartbot Desktop

export type ActionType = 'CBA' | 'ABCD' | 'VACI' | 'IFTHENT' | 'BREATH' | 'JOURNAL' | 'URGELOG';

export type UIModeType = 'Crisis' | 'Growth' | 'Flow';

export interface ChooseResponse {
  action: ActionType;
  ui_mode: UIModeType;
  confidence: number;
  rationale: string;
}

export interface LearnRequest {
  features: number[];
  action: ActionType;
  delta_suds: number;
  completed: boolean;
  regret?: boolean;
}

export interface UserState {
  mood: number;           // 0-1 scale
  stress: number;         // 0-1 scale  
  urge_level: number;     // 0-1 scale
  energy: number;         // 0-1 scale
  sleep_quality: number;  // 0-1 scale
  workload: number;       // 0-1 scale
  social_support: number; // 0-1 scale
  streak_days: number;    // Days since last relapse
  time_of_day: number;    // 0-1 (0=midnight, 0.5=noon)
  day_of_week: number;    // 0-6 (0=Monday)
}

export interface ToolCompletionData {
  action: ActionType;
  pre_suds: number;
  post_suds: number;
  completed: boolean;
  regret?: boolean;
  duration_minutes: number;
  notes?: string;
}