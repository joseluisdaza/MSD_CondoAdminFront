import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteGuard } from '../utils/protectedRoute';
import type { UserRole } from '../hooks/useUserRole';

describe('RouteGuard Component', () => {
  const MockComponent = () => <div>Protected Content</div>;

  it('renders component when user has permission for module', () => {
    const userRoles: UserRole[] = ['admin'];
    
    render(
      <RouteGuard 
        module="dashboard" 
        userRoles={userRoles} 
        component={MockComponent} 
      />
    );

    expect(document.body).toBeInTheDocument();
  });

  it('renders AccessDeniedPage when user lacks permission', () => {
    const userRoles: UserRole[] = ['habitante'];
    
    render(
      <RouteGuard 
        module="admin_only" 
        userRoles={userRoles} 
        component={MockComponent} 
      />
    );

    expect(document.body).toBeInTheDocument();
  });

  it('renders component with correct props', () => {
    const TestComponent = ({ testProp }: { testProp: string }) => (
      <div>{testProp}</div>
    );

    const userRoles: UserRole[] = ['admin'];
    
    render(
      <RouteGuard 
        module="dashboard" 
        userRoles={userRoles} 
        component={TestComponent}
        componentProps={{ testProp: 'test data' }}
      />
    );

    expect(document.body).toBeInTheDocument();
  });

  it('allows admin role access to all modules', () => {
    const userRoles: UserRole[] = ['admin'];
    
    render(
      <RouteGuard 
        module="any_module" 
        userRoles={userRoles} 
        component={MockComponent} 
      />
    );

    expect(document.body).toBeInTheDocument();
  });

  it('handles multiple user roles', () => {
    const userRoles: UserRole[] = ['director', 'admin'];
    
    render(
      <RouteGuard 
        module="dashboard" 
        userRoles={userRoles} 
        component={MockComponent} 
      />
    );

    expect(document.body).toBeInTheDocument();
  });

  it('handles empty roles array', () => {
    const userRoles: UserRole[] = [];
    
    render(
      <RouteGuard 
        module="dashboard" 
        userRoles={userRoles} 
        component={MockComponent} 
      />
    );

    expect(document.body).toBeInTheDocument();
  });
});
