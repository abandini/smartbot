import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VACIForm from './VACIForm';

describe('VACIForm', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders all VACI sections', () => {
    render(<VACIForm onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/VACI Planner/)).toBeInTheDocument();
    expect(screen.getByText(/Values: What matters most to you?/)).toBeInTheDocument();
    expect(screen.getByText(/Actions: What specific actions align/)).toBeInTheDocument();
    expect(screen.getByText(/Commitment: What are you willing/)).toBeInTheDocument();
    expect(screen.getByText(/Implementation: How will you make/)).toBeInTheDocument();
  });

  it('requires values and actions fields', () => {
    render(<VACIForm onComplete={mockOnComplete} />);
    
    const submitButton = screen.getByRole('button', { name: /Complete VACI Plan/ });
    fireEvent.click(submitButton);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('calls onComplete when form is properly filled', () => {
    render(<VACIForm onComplete={mockOnComplete} />);
    
    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/What do you value most/), {
      target: { value: 'Health and family' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/List specific actions/), {
      target: { value: 'Exercise daily, call family weekly' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Complete VACI Plan/ }));
    
    expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
      action: 'VACI',
      completed: true,
      pre_suds: expect.any(Number),
      post_suds: expect.any(Number)
    }));
  });

  it('updates SUDS ratings correctly', () => {
    render(<VACIForm onComplete={mockOnComplete} />);
    
    const preSlider = screen.getByDisplayValue('5');
    fireEvent.change(preSlider, { target: { value: '3' } });
    
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  it('adds value prompts when clicked', () => {
    render(<VACIForm onComplete={mockOnComplete} />);
    
    const valuesTextarea = screen.getByPlaceholderText(/What do you value most/);
    const healthButton = screen.getByText('Health and physical well-being');
    
    fireEvent.click(healthButton);
    
    expect(valuesTextarea).toHaveValue('Health and physical well-being');
  });
});