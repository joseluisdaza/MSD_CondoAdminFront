import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import InicioContent from '../components/InicioContent';

describe('InicioContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    const { container } = render(<InicioContent />);
    expect(container).toBeInTheDocument();
  });

  it('renders as a DOM element', () => {
    const { container } = render(<InicioContent />);
    const element = container.firstChild;
    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('does not throw error on mount', () => {
    expect(() => {
      render(<InicioContent />);
    }).not.toThrow();
  });
});
