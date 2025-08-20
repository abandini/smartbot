import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { choose, learn, getStats } from './api';
import { LearnRequest } from './types';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('choose', () => {
    it('makes correct API call and returns response', async () => {
      const mockResponse = {
        action: 'JOURNAL',
        ui_mode: 'Growth',
        confidence: 0.75,
        rationale: 'Good time for reflection'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const features = [0.5, 0.3, 0.2, 0.8];
      const result = await choose(features);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/choose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      expect(result).toEqual(mockResponse);
    });

    it('returns fallback recommendation on API error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const features = [0.5, 0.3, 0.2, 0.8];
      const result = await choose(features);

      expect(result).toEqual({
        action: 'JOURNAL',
        ui_mode: 'Growth', 
        confidence: 0.5,
        rationale: 'Default recommendation (API unavailable)'
      });
    });

    it('handles HTTP errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const result = await choose([0.5]);
      
      expect(result.action).toBe('JOURNAL');
      expect(result.rationale).toContain('API unavailable');
    });
  });

  describe('learn', () => {
    it('sends correct learning request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Feedback received' })
      });

      const learnRequest: LearnRequest = {
        features: [0.5, 0.3, 0.2],
        action: 'JOURNAL',
        delta_suds: -2,
        completed: true,
        regret: false
      };

      await learn(learnRequest);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(learnRequest)
      });
    });

    it('handles learn API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const learnRequest: LearnRequest = {
        features: [0.5],
        action: 'JOURNAL',
        delta_suds: 0,
        completed: true
      };

      // Should not throw error
      await expect(learn(learnRequest)).resolves.toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('fetches stats successfully', async () => {
      const mockStats = {
        actions: ['JOURNAL', 'VACI'],
        n_features: 10,
        alpha: 1.0,
        total_interactions: 25
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats)
      });

      const result = await getStats();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/stats');
      expect(result).toEqual(mockStats);
    });

    it('returns null on stats API error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getStats();
      expect(result).toBeNull();
    });
  });
});