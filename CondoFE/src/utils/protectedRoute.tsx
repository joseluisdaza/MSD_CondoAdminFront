import React from 'react';
import type { UserRole } from '../hooks/useUserRole';
import { canViewModule } from '../hooks/useUserRole';
import AccessDeniedPage from '../pages/AccessDeniedPage';

interface RouteGuardProps {
  module: string;
  userRoles: UserRole[];
  component: React.ComponentType<any>;
  componentProps?: any;
}

/**
 * Componente que actúa como guardián de ruta
 * Verifica permisos y muestra AccessDeniedPage si no tiene acceso
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  module,
  userRoles,
  component: Component,
  componentProps,
}) => {
  // Si el usuario no tiene permiso para este módulo, mostrar acceso denegado
  if (!canViewModule(userRoles, module)) {
    return <AccessDeniedPage />;
  }

  // Si tiene permiso, mostrar el componente normalmente
  return <Component {...componentProps} />;
};

/**
 * Función helper para crear un elemento protegido
 */
export const protectedElement = (
  Component: React.FC<any>,
  module: string,
  userRoles: UserRole[],
  componentProps?: any
) => {
  return (
    <RouteGuard
      module={module}
      userRoles={userRoles}
      component={Component}
      componentProps={componentProps}
    />
  );
};

