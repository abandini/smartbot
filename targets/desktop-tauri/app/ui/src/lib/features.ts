import { UserState, ToolCompletionData } from './types';

/**
 * Enhanced feature vector for Phase 2 contextual bandit learning.
 * Includes derived patterns, trends, and contextual signals.
 */
export function buildFeatures(userState: UserState, toolHistory?: ToolCompletionData[]): number[] {
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
  
  // Recovery progress features
  const streakNormalized = Math.min(userState.streak_days / 365, 1); // Cap at 1 year
  const streakMomentum = getStreakMomentum(userState.streak_days);
  
  // Derived pattern features
  const emotionalVolatility = getEmotionalVolatility(mood, stress, urgeLevel);
  const coreBalance = getCoreBalance(mood, stress, energy);
  const contextualRisk = getContextualRisk(stress, urgeLevel, workload, socialSupport);
  
  // Tool usage patterns (if history provided)
  let recentToolEffectiveness = 0.5;
  let toolDiversityScore = 0.5;
  
  if (toolHistory && toolHistory.length > 0) {
    recentToolEffectiveness = calculateRecentToolEffectiveness(toolHistory);
    toolDiversityScore = calculateToolDiversityScore(toolHistory);
  }
  
  return [
    // Core state (4 features)
    mood,
    stress,
    urgeLevel,
    energy,
    
    // Context (3 features) 
    sleepQuality,
    workload,
    socialSupport,
    
    // Temporal (2 features)
    timeOfDay,
    dayOfWeek,
    
    // Recovery progress (2 features)
    streakNormalized,
    streakMomentum,
    
    // Derived patterns (3 features)
    emotionalVolatility,
    coreBalance,
    contextualRisk,
    
    // Tool usage patterns (2 features)
    recentToolEffectiveness,
    toolDiversityScore
  ];
}

/**
 * Calculate streak momentum - higher for recent progress, lower for plateaus
 */
function getStreakMomentum(streakDays: number): number {
  if (streakDays <= 3) return 1.0; // High momentum in early days
  if (streakDays <= 14) return 0.8; // Good momentum in first two weeks
  if (streakDays <= 30) return 0.6; // Moderate momentum in first month
  if (streakDays <= 90) return 0.4; // Steady momentum in first quarter
  return 0.3; // Maintenance momentum for long streaks
}

/**
 * Calculate emotional volatility from mood, stress, and urges
 */
function getEmotionalVolatility(mood: number, stress: number, urge: number): number {
  const moodDistance = Math.abs(mood - 0.5);
  const stressDistance = Math.abs(stress - 0.3); // 0.3 is "optimal" stress
  const urgeDistance = Math.abs(urge - 0.1); // 0.1 is "minimal" urges
  
  return clamp((moodDistance + stressDistance + urgeDistance) / 3, 0, 1);
}

/**
 * Calculate overall balance between core emotional states
 */
function getCoreBalance(mood: number, stress: number, energy: number): number {
  // Ideal balance: moderate mood (0.6-0.8), low stress (0.1-0.3), good energy (0.6-0.8)
  const moodBalance = 1 - Math.abs(mood - 0.7);
  const stressBalance = 1 - Math.abs(stress - 0.2);
  const energyBalance = 1 - Math.abs(energy - 0.7);
  
  return clamp((moodBalance + stressBalance + energyBalance) / 3, 0, 1);
}

/**
 * Calculate contextual risk factors
 */
function getContextualRisk(stress: number, urge: number, workload: number, socialSupport: number): number {
  const stressRisk = stress > 0.7 ? 1.0 : stress / 0.7;
  const urgeRisk = urge > 0.5 ? 1.0 : urge / 0.5;
  const workloadRisk = workload > 0.8 ? 1.0 : workload / 0.8;
  const supportRisk = socialSupport < 0.3 ? 1.0 : (0.3 - socialSupport) / 0.3;
  
  return clamp((stressRisk + urgeRisk + workloadRisk + supportRisk) / 4, 0, 1);
}

/**
 * Calculate effectiveness of recently used tools
 */
function calculateRecentToolEffectiveness(toolHistory: ToolCompletionData[]): number {
  const recentTools = toolHistory.slice(-5); // Last 5 tool uses
  if (recentTools.length === 0) return 0.5;
  
  const totalEffectiveness = recentTools.reduce((sum, tool) => {
    const sudsImprovement = tool.pre_suds - tool.post_suds;
    const completionBonus = tool.completed ? 0.1 : -0.1;
    const regretPenalty = tool.regret ? -0.2 : 0;
    
    return sum + clamp((sudsImprovement / 10) + completionBonus + regretPenalty, 0, 1);
  }, 0);
  
  return clamp(totalEffectiveness / recentTools.length, 0, 1);
}

/**
 * Calculate tool diversity score - higher when user tries different tools
 */
function calculateToolDiversityScore(toolHistory: ToolCompletionData[]): number {
  const recentTools = toolHistory.slice(-10); // Last 10 tool uses
  if (recentTools.length === 0) return 0.5;
  
  const uniqueTools = new Set(recentTools.map(tool => tool.action));
  const totalTools = 7; // Total number of available tools
  
  return Math.min(uniqueTools.size / totalTools, 1);
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