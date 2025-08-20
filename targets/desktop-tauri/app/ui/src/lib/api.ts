import { ChooseResponse, LearnRequest } from './types';

const API_BASE_URL = 'http://localhost:8000';

export async function choose(features: number[]): Promise<ChooseResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/choose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get action recommendation:', error);
    
    // Fallback recommendation if API is unavailable
    return {
      action: 'JOURNAL',
      ui_mode: 'Growth',
      confidence: 0.5,
      rationale: 'Default recommendation (API unavailable)'
    };
  }
}

export async function learn(request: LearnRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Feedback sent successfully:', result);
  } catch (error) {
    console.error('Failed to send feedback:', error);
    // Continue gracefully - feedback is important but not critical for user experience
  }
}

export async function getStats(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get stats:', error);
    return null;
  }
}