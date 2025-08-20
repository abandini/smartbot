import { UserState } from './types';

/**
 * Build feature vector from user state for contextual bandit.
 * Features are normalized to [0, 1] range for consistent learning.
 */
export function buildFeatures(userState: UserState): number[] {
  // Core emotional/physical state features
  const mood = clamp(userState.mood, 0, 1);
  const stress = clamp(userState.stress, 0, 1);
  const urgeLevel = clamp(userState.urge_level, 0, 1);
  const energy = clamp(userState.energy, 0, 1);
  
  // Contextual features
  const sleepQuality = clamp(userState.sleep_quality, 0, 1);
  const workload = clamp(userState.workload, 0, 1);
  const socialSupport = clamp(userState.social_support, 0, 1);
  
  // Temporal features
  const timeOfDay = clamp(userState.time_of_day, 0, 1);
  const dayOfWeek = clamp(userState.day_of_week / 6, 0, 1); // Normalize 0-6 to 0-1
  
  // Recovery progress feature
  const streakNormalized = Math.min(userState.streak_days / 365, 1); // Cap at 1 year
  
  return [
    mood,
    stress, 
    urgeLevel,
    energy,
    sleepQuality,
    workload,
    socialSupport,
    timeOfDay,
    dayOfWeek,
    streakNormalized
  ];
}

/**
 * Extract current user state from various inputs.
 * This would typically gather data from check-ins, device sensors, etc.
 */
export function getCurrentUserState(): UserState {
  const now = new Date();
  
  // Default state - in real app this would come from user input/sensors
  return {
    mood: 0.5,
    stress: 0.5,
    urge_level: 0.3,
    energy: 0.6,
    sleep_quality: 0.7,
    workload: 0.4,
    social_support: 0.8,
    streak_days: 7,
    time_of_day: (now.getHours() * 60 + now.getMinutes()) / (24 * 60),
    day_of_week: (now.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
  };
}

/**
 * Update user state based on check-in data.
 */
export function updateUserState(
  currentState: UserState, 
  checkInData: Partial<UserState>
): UserState {
  return {
    ...currentState,
    ...checkInData
  };
}

/**
 * Clamp a value between min and max bounds.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get descriptive text for mood level.
 */
export function getMoodDescription(mood: number): string {
  if (mood < 0.2) return 'Very Low';
  if (mood < 0.4) return 'Low';
  if (mood < 0.6) return 'Moderate';
  if (mood < 0.8) return 'Good';
  return 'Great';
}

/**
 * Get descriptive text for stress level.
 */
export function getStressDescription(stress: number): string {
  if (stress < 0.2) return 'Very Relaxed';
  if (stress < 0.4) return 'Calm';
  if (stress < 0.6) return 'Moderate';
  if (stress < 0.8) return 'Stressed';
  return 'Very Stressed';
}

/**
 * Get descriptive text for urge level.
 */
export function getUrgeDescription(urge: number): string {
  if (urge < 0.2) return 'None';
  if (urge < 0.4) return 'Mild';
  if (urge < 0.6) return 'Moderate';
  if (urge < 0.8) return 'Strong';
  return 'Very Strong';
}