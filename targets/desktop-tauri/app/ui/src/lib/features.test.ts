import { describe, it, expect } from 'vitest';
import { buildFeatures, getCurrentUserState, getMoodDescription, getStressDescription, getUrgeDescription } from './features';
import { UserState } from './types';

describe('buildFeatures', () => {
  it('should build feature vector with correct length', () => {
    const userState: UserState = {
      mood: 0.5,
      stress: 0.3,
      urge_level: 0.2,
      energy: 0.7,
      sleep_quality: 0.8,
      workload: 0.4,
      social_support: 0.9,
      streak_days: 14,
      time_of_day: 0.5,
      day_of_week: 1
    };

    const features = buildFeatures(userState);
    expect(features).toHaveLength(10);
  });

  it('should normalize all features to [0,1] range', () => {
    const userState: UserState = {
      mood: 1.5, // Out of range
      stress: -0.2, // Out of range
      urge_level: 0.5,
      energy: 0.8,
      sleep_quality: 0.6,
      workload: 2.0, // Out of range
      social_support: 0.7,
      streak_days: 1000, // Large value
      time_of_day: 0.75,
      day_of_week: 6
    };

    const features = buildFeatures(userState);
    
    features.forEach(feature => {
      expect(feature).toBeGreaterThanOrEqual(0);
      expect(feature).toBeLessThanOrEqual(1);
    });
  });

  it('should handle streak days normalization correctly', () => {
    const userState: UserState = {
      mood: 0.5,
      stress: 0.3,
      urge_level: 0.2,
      energy: 0.7,
      sleep_quality: 0.8,
      workload: 0.4,
      social_support: 0.9,
      streak_days: 365, // One year
      time_of_day: 0.5,
      day_of_week: 1
    };

    const features = buildFeatures(userState);
    expect(features[9]).toBe(1.0); // Streak should be normalized to 1.0
  });
});

describe('getCurrentUserState', () => {
  it('should return valid user state', () => {
    const state = getCurrentUserState();
    
    expect(typeof state.mood).toBe('number');
    expect(typeof state.stress).toBe('number');
    expect(typeof state.urge_level).toBe('number');
    expect(state.time_of_day).toBeGreaterThanOrEqual(0);
    expect(state.time_of_day).toBeLessThanOrEqual(1);
    expect(state.day_of_week).toBeGreaterThanOrEqual(0);
    expect(state.day_of_week).toBeLessThanOrEqual(6);
  });
});

describe('description functions', () => {
  it('should return correct mood descriptions', () => {
    expect(getMoodDescription(0.1)).toBe('Very Low');
    expect(getMoodDescription(0.3)).toBe('Low');
    expect(getMoodDescription(0.5)).toBe('Moderate');
    expect(getMoodDescription(0.7)).toBe('Good');
    expect(getMoodDescription(0.9)).toBe('Great');
  });

  it('should return correct stress descriptions', () => {
    expect(getStressDescription(0.1)).toBe('Very Relaxed');
    expect(getStressDescription(0.3)).toBe('Calm');
    expect(getStressDescription(0.5)).toBe('Moderate');
    expect(getStressDescription(0.7)).toBe('Stressed');
    expect(getStressDescription(0.9)).toBe('Very Stressed');
  });

  it('should return correct urge descriptions', () => {
    expect(getUrgeDescription(0.1)).toBe('None');
    expect(getUrgeDescription(0.3)).toBe('Mild');
    expect(getUrgeDescription(0.5)).toBe('Moderate');
    expect(getUrgeDescription(0.7)).toBe('Strong');
    expect(getUrgeDescription(0.9)).toBe('Very Strong');
  });
});