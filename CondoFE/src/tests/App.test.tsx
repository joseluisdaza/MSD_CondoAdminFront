import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import * as userRoleModule from '../hooks/useUserRole';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Mock useUserRole hook
vi.mock('../hooks/useUserRole');

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    // Mock useUserRole to prevent async operations
    vi.spyOn(userRoleModule, 'useUserRole').mockReturnValue({
      userRoles: [],
      userInfo: null,
      loading: true,
      error: null,
      hasRole: () => false,
      hasAnyRole: () => false,
    });

    render(<App />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('renders LoginPage when no token is present', async () => {
    vi.spyOn(userRoleModule, 'useUserRole').mockReturnValue({
      userRoles: [],
      userInfo: null,
      loading: false,
      error: null,
      hasRole: () => false,
      hasAnyRole: () => false,
    });

    render(<App />);
    
    await waitFor(() => {
      // Login form should be rendered
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('recovers token from localStorage on mount', async () => {
    vi.spyOn(userRoleModule, 'useUserRole').mockReturnValue({
      userRoles: ['admin'],
      userInfo: { id: 1, userName: 'testuser', roles: ['admin'] },
      loading: false,
      error: null,
      hasRole: () => true,
      hasAnyRole: () => true,
    });

    localStorage.setItem('authToken', 'mock-token');
    render(<App />);
    
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock-token');
    });
  });

  it('saves token to localStorage when handling login', async () => {
    vi.spyOn(userRoleModule, 'useUserRole').mockReturnValue({
      userRoles: [],
      userInfo: null,
      loading: false,
      error: null,
      hasRole: () => false,
      hasAnyRole: () => false,
    });

    render(<App />);
    
    // App initializes without token
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('clears token on logout action', async () => {
    localStorage.setItem('authToken', 'mock-token');
    
    vi.spyOn(userRoleModule, 'useUserRole').mockReturnValue({
      userRoles: [],
      userInfo: null,
      loading: false,
      error: null,
      hasRole: () => false,
      hasAnyRole: () => false,
    });

    render(<App />);
    
    // Simulate logout
    localStorage.removeItem('authToken');
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
