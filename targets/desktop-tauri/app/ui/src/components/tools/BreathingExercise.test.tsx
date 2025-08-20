import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BreathingExercise from './BreathingExercise';

// Mock timers
vi.useFakeTimers();

describe('BreathingExercise', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('renders breathing exercise interface', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/4-7-8 Breathing Exercise/)).toBeInTheDocument();
    expect(screen.getByText(/Current stress\/anxiety level/)).toBeInTheDocument();
    expect(screen.getByText(/Start Breathing Exercise/)).toBeInTheDocument();
  });

  it('allows setting target cycles', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    const cycleSelect = screen.getByRole('combobox');
    fireEvent.change(cycleSelect, { target: { value: '6' } });
    
    expect(cycleSelect).toHaveValue('6');
  });

  it('starts breathing exercise when button clicked', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    const startButton = screen.getByText('Start Breathing Exercise');
    fireEvent.click(startButton);
    
    expect(screen.getByText('Stop Exercise')).toBeInTheDocument();
    expect(screen.getByText(/Breathe in slowly through your nose/)).toBeInTheDocument();
  });

  it('shows correct phase instructions', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    
    // Should start with inhale phase
    expect(screen.getByText(/Breathe in slowly through your nose/)).toBeInTheDocument();
    expect(screen.getByText('INHALE')).toBeInTheDocument();
  });

  it('advances through breathing phases with timer', async () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    
    // Start with inhale (4 seconds)
    expect(screen.getByText('INHALE')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Advance 4 seconds to move to hold phase
    vi.advanceTimersByTime(4000);
    
    await waitFor(() => {
      expect(screen.getByText('HOLD')).toBeInTheDocument();
    });
  });

  it('stops exercise when stop button clicked', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    expect(screen.getByText('Stop Exercise')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Stop Exercise'));
    expect(screen.queryByText('Stop Exercise')).not.toBeInTheDocument();
  });

  it('shows progress bar during exercise', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    
    expect(screen.getByText(/Cycle 1 of 4/)).toBeInTheDocument();
    expect(screen.getByText(/0\/4 cycles complete/)).toBeInTheDocument();
  });

  it('shows completion when cycles finished', async () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    // Set to 1 cycle for faster testing
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    
    // Fast forward through multiple breathing cycles
    // Each cycle is 4+7+8+2 = 21 seconds
    vi.advanceTimersByTime(21000 * 2 + 1000); // 2 cycles plus buffer
    
    await waitFor(() => {
      expect(screen.getByText(/Exercise Complete!/)).toBeInTheDocument();
    });
  });

  it('allows rating post-exercise SUDS', async () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    // Set to 2 cycles and complete exercise
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    
    // Complete the exercise by advancing time
    vi.advanceTimersByTime(50000);
    
    await waitFor(() => {
      expect(screen.getByText(/stress\/anxiety level after breathing/)).toBeInTheDocument();
    });
    
    // Change post-SUDS rating
    const postSlider = screen.getAllByRole('slider')[1];
    fireEvent.change(postSlider, { target: { value: '3' } });
    
    expect(postSlider).toHaveValue('3');
  });

  it('shows SUDS improvement message', async () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    // Set high pre-SUDS
    const preSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(preSlider, { target: { value: '8' } });
    
    // Complete exercise quickly
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    vi.advanceTimersByTime(50000);
    
    await waitFor(() => {
      const postSlider = screen.getAllByRole('slider')[1];
      fireEvent.change(postSlider, { target: { value: '4' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Your stress level decreased by 4 points/)).toBeInTheDocument();
    });
  });

  it('completes exercise with tool data', async () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    // Complete exercise
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    vi.advanceTimersByTime(50000);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Complete Breathing Session'));
    });
    
    expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
      action: 'BREATH',
      completed: true,
      pre_suds: expect.any(Number),
      post_suds: expect.any(Number)
    }));
  });

  it('shows continue option after stopping mid-exercise', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Start Breathing Exercise'));
    fireEvent.click(screen.getByText('Stop Exercise'));
    
    expect(screen.getByText('Continue Exercise')).toBeInTheDocument();
  });

  it('displays educational information', () => {
    render(<BreathingExercise onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/Why 4-7-8 Breathing Works/)).toBeInTheDocument();
    expect(screen.getByText(/Tips for Best Results/)).toBeInTheDocument();
    expect(screen.getByText(/4 seconds inhale/)).toBeInTheDocument();
  });
});