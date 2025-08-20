import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ABCDForm from './ABCDForm';

describe('ABCDForm', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('renders all ABCD sections', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/ABCD Worksheet/)).toBeInTheDocument();
    expect(screen.getByText(/Adversity: What happened?/)).toBeInTheDocument();
    expect(screen.getByText(/Beliefs: What thoughts did you have?/)).toBeInTheDocument();
    expect(screen.getByText(/Consequences: How did you feel and behave?/)).toBeInTheDocument();
    expect(screen.getByText(/Disputation: How can you challenge these thoughts?/)).toBeInTheDocument();
    expect(screen.getByText(/Effective New Beliefs/)).toBeInTheDocument();
  });

  it('requires adversity, beliefs, and consequences fields', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    const submitButton = screen.getByRole('button', { name: /Complete ABCD Worksheet/ });
    fireEvent.click(submitButton);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('adds belief prompts when clicked', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    const beliefsTextarea = screen.getByPlaceholderText(/What went through your mind/);
    const promptButton = screen.getByText('I always mess things up');
    
    fireEvent.click(promptButton);
    
    expect(beliefsTextarea).toHaveValue('"I always mess things up"\n');
  });

  it('adds disputation questions when clicked', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    const disputationTextarea = screen.getByPlaceholderText(/Question your beliefs/);
    const questionButton = screen.getByText(/Is this thought realistic and helpful?/);
    
    fireEvent.click(questionButton);
    
    expect(disputationTextarea).toHaveValue('Is this thought realistic and helpful?\n');
  });

  it('shows thought transformation summary when content exists', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    // Fill beliefs and disputation
    fireEvent.change(screen.getByPlaceholderText(/What went through your mind/), {
      target: { value: 'I am terrible at everything' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Question your beliefs/), {
      target: { value: 'Is this realistic? What evidence contradicts this?' }
    });
    
    expect(screen.getByText(/Thought Transformation Summary/)).toBeInTheDocument();
    expect(screen.getByText(/Original Thought:/)).toBeInTheDocument();
  });

  it('displays SUDS improvement when post is lower than pre', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    // Set pre-SUDS to 8
    const preSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(preSlider, { target: { value: '8' } });
    
    // Set post-SUDS to 5  
    const postSlider = screen.getAllByRole('slider')[1];
    fireEvent.change(postSlider, { target: { value: '5' } });
    
    expect(screen.getByText(/Your emotional intensity decreased by 3 points/)).toBeInTheDocument();
  });

  it('completes ABCD with all required fields', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText(/Describe the situation/), {
      target: { value: 'I made a mistake at work' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/What went through your mind/), {
      target: { value: 'I am incompetent and will get fired' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/What emotions did you experience/), {
      target: { value: 'Felt anxious and wanted to hide' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Complete ABCD Worksheet'));
    
    expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
      action: 'ABCD',
      completed: true,
      pre_suds: expect.any(Number),
      post_suds: expect.any(Number)
    }));
  });

  it('updates SUDS ratings correctly', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    const preSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(preSlider, { target: { value: '7' } });
    
    expect(screen.getByDisplayValue('7')).toBeInTheDocument();
  });

  it('allows optional fields to remain empty', () => {
    render(<ABCDForm onComplete={mockOnComplete} />);
    
    // Fill only required fields
    fireEvent.change(screen.getByPlaceholderText(/Describe the situation/), {
      target: { value: 'Bad situation happened' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/What went through your mind/), {
      target: { value: 'Negative thoughts' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/What emotions did you experience/), {
      target: { value: 'Felt terrible' }
    });
    
    // Leave disputation and alternative beliefs empty
    fireEvent.click(screen.getByText('Complete ABCD Worksheet'));
    
    expect(mockOnComplete).toHaveBeenCalled();
  });
});