import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CBAForm from './CBAForm';

describe('CBAForm', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders CBA form with all sections', () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/Cost-Benefit Analysis/)).toBeInTheDocument();
    expect(screen.getByText(/What decision are you analyzing/)).toBeInTheDocument();
    expect(screen.getByText(/Pros \(Benefits\)/)).toBeInTheDocument();
    expect(screen.getByText(/Cons \(Costs\)/)).toBeInTheDocument();
  });

  it('adds pros and cons when buttons clicked', () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    const addProButton = screen.getByText('+ Add Pro');
    const addConButton = screen.getByText('+ Add Con');
    
    fireEvent.click(addProButton);
    fireEvent.click(addConButton);
    
    expect(screen.getByPlaceholderText(/What's a benefit or positive aspect/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/What's a cost or negative aspect/)).toBeInTheDocument();
  });

  it('calculates scores correctly', async () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Add a pro
    fireEvent.click(screen.getByText('+ Add Pro'));
    const proTextarea = screen.getByPlaceholderText(/What's a benefit or positive aspect/);
    fireEvent.change(proTextarea, { target: { value: 'Good benefit' } });
    
    // Add a con  
    fireEvent.click(screen.getByText('+ Add Con'));
    const conTextarea = screen.getByPlaceholderText(/What's a cost or negative aspect/);
    fireEvent.change(conTextarea, { target: { value: 'Bad cost' } });
    
    // Check default scores (importance 3 each)
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Pros score
    });
  });

  it('updates importance ratings', async () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Add a pro
    fireEvent.click(screen.getByText('+ Add Pro'));
    const proTextarea = screen.getByPlaceholderText(/What's a benefit or positive aspect/);
    fireEvent.change(proTextarea, { target: { value: 'Important benefit' } });
    
    // Change importance to 5
    const importanceSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(importanceSelect, { target: { value: '5' } });
    
    // Check updated score
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('removes pros and cons', () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Add a pro
    fireEvent.click(screen.getByText('+ Add Pro'));
    expect(screen.getByPlaceholderText(/What's a benefit or positive aspect/)).toBeInTheDocument();
    
    // Remove the pro
    const removeButton = screen.getByText('✕');
    fireEvent.click(removeButton);
    
    expect(screen.queryByPlaceholderText(/What's a benefit or positive aspect/)).not.toBeInTheDocument();
  });

  it('shows analysis results when items exist', async () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Add pro and con
    fireEvent.click(screen.getByText('+ Add Pro'));
    fireEvent.change(screen.getByPlaceholderText(/What's a benefit or positive aspect/), {
      target: { value: 'Big benefit' }
    });
    
    fireEvent.click(screen.getByText('+ Add Con'));
    fireEvent.change(screen.getByPlaceholderText(/What's a cost or negative aspect/), {
      target: { value: 'Small cost' }
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Analysis Results:/)).toBeInTheDocument();
    });
  });

  it('requires decision description and pros/cons', () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Try to submit without decision
    fireEvent.click(screen.getByText('Complete Cost-Benefit Analysis'));
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('completes analysis with all required fields', async () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Fill decision
    const decisionTextarea = screen.getByPlaceholderText(/Describe the decision/);
    fireEvent.change(decisionTextarea, { target: { value: 'Should I change jobs?' } });
    
    // Add pro
    fireEvent.click(screen.getByText('+ Add Pro'));
    fireEvent.change(screen.getByPlaceholderText(/What's a benefit or positive aspect/), {
      target: { value: 'Better salary' }
    });
    
    // Add con
    fireEvent.click(screen.getByText('+ Add Con'));
    fireEvent.change(screen.getByPlaceholderText(/What's a cost or negative aspect/), {
      target: { value: 'Job uncertainty' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Complete Cost-Benefit Analysis'));
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        action: 'CBA',
        completed: true,
        pre_suds: expect.any(Number),
        post_suds: expect.any(Number)
      }));
    });
  });

  it('shows recommendation based on scores', async () => {
    render(<CBAForm onComplete={mockOnComplete} />);
    
    // Add high-importance pro
    fireEvent.click(screen.getByText('+ Add Pro'));
    fireEvent.change(screen.getByPlaceholderText(/What's a benefit or positive aspect/), {
      target: { value: 'Major benefit' }
    });
    const proImportance = screen.getAllByRole('combobox')[0];
    fireEvent.change(proImportance, { target: { value: '5' } });
    
    // Add low-importance con
    fireEvent.click(screen.getByText('+ Add Con'));
    fireEvent.change(screen.getByPlaceholderText(/What's a cost or negative aspect/), {
      target: { value: 'Minor cost' }
    });
    const conImportance = screen.getAllByRole('combobox')[1];
    fireEvent.change(conImportance, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Analysis suggests proceeding may be beneficial/)).toBeInTheDocument();
    });
  });
});