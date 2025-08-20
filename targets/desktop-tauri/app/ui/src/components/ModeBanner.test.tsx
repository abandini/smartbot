import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModeBanner from './ModeBanner';

describe('ModeBanner', () => {
  it('renders Crisis mode correctly', () => {
    render(<ModeBanner mode="Crisis" />);
    
    expect(screen.getByText('Crisis Support Mode')).toBeInTheDocument();
    expect(screen.getByText('Immediate tools and support available')).toBeInTheDocument();
    expect(screen.getByText('🚨')).toBeInTheDocument();
  });

  it('renders Growth mode correctly', () => {
    render(<ModeBanner mode="Growth" />);
    
    expect(screen.getByText('Growth & Learning Mode')).toBeInTheDocument();
    expect(screen.getByText('Full toolkit for skill development')).toBeInTheDocument();
    expect(screen.getByText('🌱')).toBeInTheDocument();
  });

  it('renders Flow mode correctly', () => {
    render(<ModeBanner mode="Flow" />);
    
    expect(screen.getByText('Flow & Maintenance Mode')).toBeInTheDocument();
    expect(screen.getByText('Gentle support for continued progress')).toBeInTheDocument();
    expect(screen.getByText('✨')).toBeInTheDocument();
  });

  it('displays rationale when provided', () => {
    const rationale = 'High stress detected, switching to crisis mode';
    render(<ModeBanner mode="Crisis" rationale={rationale} />);
    
    expect(screen.getByText(rationale)).toBeInTheDocument();
  });

  it('applies correct CSS classes for each mode', () => {
    const { rerender } = render(<ModeBanner mode="Crisis" />);
    let banner = screen.getByRole('heading', { name: /Crisis Support Mode/ }).closest('div')?.parentElement;
    expect(banner).toHaveClass('bg-danger-100', 'border-danger-300');

    rerender(<ModeBanner mode="Growth" />);
    banner = screen.getByRole('heading', { name: /Growth & Learning Mode/ }).closest('div')?.parentElement;
    expect(banner).toHaveClass('bg-primary-100', 'border-primary-300');

    rerender(<ModeBanner mode="Flow" />);
    banner = screen.getByRole('heading', { name: /Flow & Maintenance Mode/ }).closest('div')?.parentElement;
    expect(banner).toHaveClass('bg-success-100', 'border-success-300');
  });
});