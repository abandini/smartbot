import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckIn from './CheckIn';
import { UserState } from '../lib/types';

describe('CheckIn', () => {
  const mockOnComplete = vi.fn();
  
  const defaultState: UserState = {
    mood: 0.5,
    stress: 0.5,
    urge_level: 0.3,
    energy: 0.6,
    sleep_quality: 0.7,
    workload: 0.4,
    social_support: 0.8,
    streak_days: 7,
    time_of_day: 0.5,
    day_of_week: 1
  };

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders check-in form with all sliders', () => {
    render(<CheckIn onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Daily Check-In')).toBeInTheDocument();
    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Stress Level')).toBeInTheDocument();
    expect(screen.getByText('Urge Level')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText(/Sleep Quality/)).toBeInTheDocument();
  });

  it('uses current state as initial values', () => {
    render(<CheckIn onComplete={mockOnComplete} currentState={defaultState} />);
    
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(5);
    
    // Check that sliders have expected initial values
    expect(sliders[0]).toHaveValue('0.5'); // mood
    expect(sliders[1]).toHaveValue('0.5'); // stress
    expect(sliders[2]).toHaveValue('0.3'); // urge_level
  });

  it('updates slider values when changed', () => {
    render(<CheckIn onComplete={mockOnComplete} />);
    
    const moodSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(moodSlider, { target: { value: '0.8' } });
    
    expect(moodSlider).toHaveValue('0.8');
  });

  it('calls onComplete with updated state when submitted', () => {
    render(<CheckIn onComplete={mockOnComplete} />);
    
    // Change some values
    const moodSlider = screen.getAllByRole('slider')[0];
    const stressSlider = screen.getAllByRole('slider')[1];
    
    fireEvent.change(moodSlider, { target: { value: '0.8' } });
    fireEvent.change(stressSlider, { target: { value: '0.3' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Complete Check-In'));
    
    expect(mockOnComplete).toHaveBeenCalledWith({
      mood: 0.8,
      stress: 0.3,
      urge_level: 0.3,
      energy: 0.6,
      sleep_quality: 0.7
    });
  });

  it('displays correct mood descriptions', () => {
    render(<CheckIn onComplete={mockOnComplete} />);
    
    const moodSlider = screen.getAllByRole('slider')[0];
    
    fireEvent.change(moodSlider, { target: { value: '0.1' } });
    expect(screen.getByText('Very Low')).toBeInTheDocument();
    
    fireEvent.change(moodSlider, { target: { value: '0.9' } });
    expect(screen.getByText('Great')).toBeInTheDocument();
  });
});