import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserRole, type UserRole } from '../hooks/useUserRole';

// Helper function to create a mock JWT token
function createMockJWT(payload: Record<string, any>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = 'mock-signature';
  return `${header}.${body}.${signature}`;
}

describe('useUserRole Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty state when no token provided', () => {
    const { result } = renderHook(() => useUserRole(''));

    expect(result.current.loading).toBe(false);
    expect(result.current.userRoles).toEqual([]);
    expect(result.current.userInfo).toBeNull();
  });

  it('handles invalid token gracefully', async () => {
    // Pass an invalid token that cannot be decoded
    const { result } = renderHook(() => useUserRole('invalid-token-format'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have error and default role
    expect(result.current.error).not.toBeNull();
    expect(result.current.userRoles).toContain('habitante');
  });

  it('decodes and processes valid JWT token', async () => {
    const mockPayload = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'testuser',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['admin', 'super'],
    };

    const mockToken = createMockJWT(mockPayload);

    const { result } = renderHook(() => useUserRole(mockToken));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userInfo?.userName).toBe('testuser');
    expect(result.current.userInfo?.id).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('handles single role in JWT token', async () => {
    const mockPayload = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '2',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'directoruser',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'director',
    };

    const mockToken = createMockJWT(mockPayload);

    const { result } = renderHook(() => useUserRole(mockToken));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRoles).toContain('director');
  });

  it('hasRole function works correctly', async () => {
    const mockPayload = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'testuser',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['admin', 'director'],
    };

    const mockToken = createMockJWT(mockPayload);

    const { result } = renderHook(() => useUserRole(mockToken));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('director')).toBe(true);
    expect(result.current.hasRole('habitante')).toBe(false);
  });

  it('hasAnyRole function works correctly', async () => {
    const mockPayload = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'testuser',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'admin',
    };

    const mockToken = createMockJWT(mockPayload);

    const { result } = renderHook(() => useUserRole(mockToken));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasAnyRole(['admin', 'director'])).toBe(true);
    expect(result.current.hasAnyRole(['habitante', 'seguridad'])).toBe(false);
    expect(result.current.hasAnyRole(['admin'])).toBe(true);
  });

  it('updates when token changes', async () => {
    const mockPayload1 = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'user1',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'admin',
    };

    const mockPayload2 = {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '2',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'user2',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'habitante',
    };

    const mockToken1 = createMockJWT(mockPayload1);
    const mockToken2 = createMockJWT(mockPayload2);

    const { result, rerender } = renderHook(
      ({ token }) => useUserRole(token),
      { initialProps: { token: mockToken1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userInfo?.userName).toBe('user1');

    // Update token
    rerender({ token: mockToken2 });

    await waitFor(() => {
      expect(result.current.userInfo?.userName).toBe('user2');
    });
  });
});
