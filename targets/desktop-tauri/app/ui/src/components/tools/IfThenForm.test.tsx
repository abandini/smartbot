import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IfThenForm from './IfThenForm';

describe('IfThenForm', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders If-Then planning form', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/If-Then Planning/)).toBeInTheDocument();
    expect(screen.getByText(/How If-Then Planning Works/)).toBeInTheDocument();
    expect(screen.getByText(/No If-Then plans created yet/)).toBeInTheDocument();
  });

  it('creates a new plan when button clicked', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    const createButton = screen.getByText('Create Your First Plan');
    fireEvent.click(createButton);
    
    expect(screen.getByText(/What situation or trigger might occur/)).toBeInTheDocument();
    expect(screen.getByText(/What will you do in response/)).toBeInTheDocument();
  });

  it('adds multiple plans', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    // Create first plan
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    // Add second plan
    fireEvent.click(screen.getByText('+ Add Another Plan'));
    
    const planHeaders = screen.getAllByText('If-Then Plan');
    expect(planHeaders).toHaveLength(2);
  });

  it('removes plans when delete button clicked', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    // Create a plan
    fireEvent.click(screen.getByText('Create Your First Plan'));
    expect(screen.getByText('If-Then Plan')).toBeInTheDocument();
    
    // Remove the plan
    const removeButton = screen.getByText('✕');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('If-Then Plan')).not.toBeInTheDocument();
  });

  it('updates plan fields correctly', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    const situationTextarea = screen.getByPlaceholderText(/Describe a specific high-risk situation/);
    const responseTextarea = screen.getByPlaceholderText(/Describe your specific coping response/);
    
    fireEvent.change(situationTextarea, { target: { value: 'I feel stressed' } });
    fireEvent.change(responseTextarea, { target: { value: 'I will take deep breaths' } });
    
    expect(situationTextarea).toHaveValue('I feel stressed');
    expect(responseTextarea).toHaveValue('I will take deep breaths');
  });

  it('shows If-Then statement preview when both fields filled', async () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    fireEvent.change(screen.getByPlaceholderText(/Describe a specific high-risk situation/), {
      target: { value: 'I feel overwhelmed' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Describe your specific coping response/), {
      target: { value: 'call my support person' }
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Your If-Then Statement/)).toBeInTheDocument();
      expect(screen.getByText(/If i feel overwhelmed, then i will call my support person/)).toBeInTheDocument();
    });
  });

  it('uses common situation prompts', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    const situationButton = screen.getByText('I feel a strong urge to use');
    fireEvent.click(situationButton);
    
    const situationTextarea = screen.getByPlaceholderText(/Describe a specific high-risk situation/);
    expect(situationTextarea).toHaveValue('I feel a strong urge to use');
  });

  it('uses common response prompts', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    const responseButton = screen.getByText('call my sponsor or support person');
    fireEvent.click(responseButton);
    
    const responseTextarea = screen.getByPlaceholderText(/Describe your specific coping response/);
    expect(responseTextarea).toHaveValue('call my sponsor or support person');
  });

  it('updates confidence rating', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    const confidenceSlider = screen.getByRole('slider');
    fireEvent.change(confidenceSlider, { target: { value: '4' } });
    
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });

  it('shows plans summary when plans exist', async () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    fireEvent.change(screen.getByPlaceholderText(/Describe a specific high-risk situation/), {
      target: { value: 'I feel triggered' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Describe your specific coping response/), {
      target: { value: 'I will leave the situation' }
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Your If-Then Plans Summary/)).toBeInTheDocument();
      expect(screen.getByText(/Plan 1/)).toBeInTheDocument();
    });
  });

  it('requires at least one complete plan to submit', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    // Try to submit without plans
    fireEvent.click(screen.getByText('Complete If-Then Planning'));
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    // Create incomplete plan
    fireEvent.click(screen.getByText('Create Your First Plan'));
    fireEvent.change(screen.getByPlaceholderText(/Describe a specific high-risk situation/), {
      target: { value: 'Situation only' }
    });
    
    // Try to submit with incomplete plan
    fireEvent.click(screen.getByText('Complete If-Then Planning'));
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('completes with valid plans', async () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Create Your First Plan'));
    
    fireEvent.change(screen.getByPlaceholderText(/Describe a specific high-risk situation/), {
      target: { value: 'Complete situation' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Describe your specific coping response/), {
      target: { value: 'Complete response' }
    });
    
    fireEvent.click(screen.getByText('Complete If-Then Planning'));
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
        action: 'IFTHENT',
        completed: true,
        pre_suds: expect.any(Number),
        post_suds: expect.any(Number)
      }));
    });
  });

  it('shows SUDS improvement message', () => {
    render(<IfThenForm onComplete={mockOnComplete} />);
    
    // Set pre-SUDS high
    const preSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(preSlider, { target: { value: '8' } });
    
    // Set post-SUDS lower
    const postSlider = screen.getAllByRole('slider')[1];
    fireEvent.change(postSlider, { target: { value: '4' } });
    
    expect(screen.getByText(/Your anxiety about future challenges decreased by 4 points/)).toBeInTheDocument();
  });
});