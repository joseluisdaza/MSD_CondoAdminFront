// src/hooks/useUserRole.ts
import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'super' | 'director' | 'habitante' | 'auxiliar' | 'seguridad';

interface UserInfo {
  id: number;
  userName: string;
  roles: UserRole[];
}

interface UseUserRoleReturn {
  userRoles: UserRole[];
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useUserRole = (token: string): UseUserRoleReturn => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('Processing token:', token.substring(0, 50) + '...');
      
      // Decode JWT token to get user information
      const tokenPayload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenPayload));
      
      console.log('Decoded token:', decodedToken);
      
      // Get user info from token claims
      const userId = parseInt(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '0');
      const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';
      
      // Get roles from token - could be single role or array
      let tokenRoles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Raw token roles:', tokenRoles);
      
      if (typeof tokenRoles === 'string') {
        tokenRoles = [tokenRoles];
      }
      
      console.log('Processed token roles:', tokenRoles);
      
      // Map and normalize roles
      const mappedRoles = (tokenRoles || []).map(mapRoleToEnum).filter(Boolean);
      
      console.log('Mapped roles:', mappedRoles);
      
      const userInfo: UserInfo = {
        id: userId,
        userName: userName,
        roles: mappedRoles
      };

      setUserInfo(userInfo);
      setUserRoles(mappedRoles);
      setError(null);
    } catch (error) {
      console.error('Error parsing token:', error);
      setError('Error loading user information');
      // Set default to habitante for security
      setUserRoles(['habitante']);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Map role names to enum values
  const mapRoleToEnum = (roleName: string): UserRole => {
    const roleMap: { [key: string]: UserRole } = {
      'admin': 'admin',
      'administrator': 'admin',
      'super': 'super',
      'superadmin': 'super',
      'director': 'director',
      'habitante': 'habitante',
      'resident': 'habitante',
      'auxiliar': 'auxiliar',
      'auxiliary': 'auxiliar',
      'seguridad': 'seguridad',
      'security': 'seguridad'
    };

    const normalizedRole = roleName?.toLowerCase() || '';
    return roleMap[normalizedRole] as UserRole;
  };

  // Helper function to check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  return {
    userRoles,
    userInfo,
    loading,
    error,
    hasRole,
    hasAnyRole
  };
};

// Permission checker functions
export const canViewModule = (userRoles: UserRole[], module: string): boolean => {
  if (!userRoles || userRoles.length === 0) return false;

  const permissions: { [key in UserRole]: string[] } = {
    admin: [
      'inicio', 'expensas', 'pagos', 'categorias-expensas', 
      'expensas-servicio', 'pagos-servicio', 'tipos-servicio',
      'propiedades', 'tipo-propiedades', 'usuario', 'usuarios', 
      'duenos-propiedades', 'roles', 'reportes'
    ],
    super: [
      'inicio', 'expensas', 'pagos', 'categorias-expensas', 
      'expensas-servicio', 'pagos-servicio', 'tipos-servicio',
      'propiedades', 'tipo-propiedades', 'usuario', 'usuarios', 
      'duenos-propiedades', 'roles', 'reportes'
    ],
    director: [
      'inicio', 'expensas', 'pagos', 'expensas-servicio', 
      'propiedades', 'usuario', 'reportes'
    ],
    habitante: [
      'inicio', 'pagos', 'propiedades', 'usuario'
    ],
    auxiliar: [
      'inicio', 'expensas', 'pagos', 'categorias-expensas', 
      'expensas-servicio', 'propiedades', 'tipo-propiedades', 
      'usuario', 'usuarios', 'duenos-propiedades', 'reportes'
    ],
    seguridad: [
      'inicio', 'usuario'
    ]
  };

  // Check if any of the user's roles has permission for this module
  return userRoles.some(role => permissions[role]?.includes(module));
};