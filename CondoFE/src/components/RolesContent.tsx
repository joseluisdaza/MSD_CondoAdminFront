import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  userName: string;
  lastName: string;
  legalId: string;
  login: string;
}

interface RolesContentProps {
  token: string;
}

const RolesContent: React.FC<RolesContentProps> = ({ token }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [currentUserRoles, setCurrentUserRoles] = useState<Role[]>([]);
  const [loadingUserRoles, setLoadingUserRoles] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(ENDPOINTS.role, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rolesData = await response.json();
      setRoles(rolesData);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar roles');
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      
      const response = await fetch(ENDPOINTS.users, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuarios');
    }
  }, [token]);

  const fetchUserRoles = useCallback(async (userId: number) => {
    try {
      setLoadingUserRoles(true);
      setError(null);
      
      const response = await fetch(`${ENDPOINTS.role}/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const userRolesData = await response.json();
      setCurrentUserRoles(userRolesData);
      
      // Set selected roles based on current user roles
      setSelectedRoles(userRolesData.map((role: Role) => role.id));
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar roles del usuario');
    } finally {
      setLoadingUserRoles(false);
    }
  }, [token]);

  const updateUserRoles = async (userId: number, roleIds: number[]) => {
    try {
      const response = await fetch(`${ENDPOINTS.role}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleIds),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (err) {
      console.error('Error updating user roles:', err);
      throw err;
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUserId) {
      setError('Por favor seleccione un usuario');
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      setSuccessMessage(null);

      // Update user roles with new selection
      await updateUserRoles(selectedUserId, selectedRoles);

      const selectedUser = users.find(u => u.id === selectedUserId);
      const assignedRoleNames = roles
        .filter(r => selectedRoles.includes(r.id))
        .map(r => r.name)
        .join(', ');

      setSuccessMessage(
        selectedRoles.length > 0 
          ? `Roles "${assignedRoleNames}" asignados exitosamente al usuario ${selectedUser?.userName} ${selectedUser?.lastName}`
          : `Se removieron todos los roles del usuario ${selectedUser?.userName} ${selectedUser?.lastName}`
      );
      
      // Refresh current user roles
      if (selectedUserId) {
        await fetchUserRoles(selectedUserId);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar roles');
    } finally {
      setAssigning(false);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
  }, [fetchRoles, fetchUsers]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Gestión de Roles</h2>
        <p>Cargando roles y usuarios...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Gestión de Roles</h2>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ 
          background: '#e8f5e8', 
          color: '#2e7d32', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #4caf50'
        }}>
          {successMessage}
        </div>
      )}
      
      <button 
        onClick={() => {
          fetchRoles();
          fetchUsers();
        }}
        style={{
          background: 'rgb(68,68,68)',
          color: 'rgb(244,228,69)',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Actualizar Datos
      </button>

      {/* Role Assignment Section */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '2px solid rgb(68,68,68)'
      }}>
        <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>
          Asignar Roles a Usuarios
        </h3>
        
        {/* User Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
            Seleccionar Usuario:
          </label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => {
              const userId = e.target.value ? Number(e.target.value) : null;
              setSelectedUserId(userId);
              setSuccessMessage(null);
              setCurrentUserRoles([]);
              setSelectedRoles([]);
              
              if (userId) {
                fetchUserRoles(userId);
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              background: 'white',
              color: 'rgb(68,68,68)'
            }}
          >
            <option value="" style={{ color: 'rgb(68,68,68)', background: 'white' }}>
              -- Seleccione un usuario --
            </option>
            {users.map(user => (
              <option 
                key={user.id} 
                value={user.id}
                style={{ color: 'rgb(68,68,68)', background: 'white' }}
              >
                {user.userName} {user.lastName}
              </option>
            ))}
          </select>
          
          {/* CSS styles for better dropdown visibility */}
          <style>{`
            select option {
              color: rgb(68,68,68) !important;
              background-color: white !important;
            }
            select option:hover {
              background-color: rgb(244,228,69) !important;
              color: rgb(68,68,68) !important;
            }
            select option:checked {
              background-color: rgb(68,68,68) !important;
              color: rgb(244,228,69) !important;
            }
          `}</style>
        </div>

        {/* Current User Roles Display */}
        {selectedUserId && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
              Roles Actuales del Usuario:
            </label>
            
            {loadingUserRoles ? (
              <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                Cargando roles actuales...
              </div>
            ) : currentUserRoles.length > 0 ? (
              <div style={{ 
                padding: '10px', 
                background: '#e8f5e8', 
                borderRadius: '4px', 
                border: '1px solid #4caf50',
                marginBottom: '15px'
              }}>
                <strong style={{ color: '#2e7d32' }}>Roles asignados: </strong>
                <span style={{ color: '#2e7d32' }}>
                  {currentUserRoles.map(role => role.name).join(', ')}
                </span>
              </div>
            ) : (
              <div style={{
                background: '#fff3cd',
                color: '#856404',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                border: '1px solid #ffeaa7'
              }}>
                ⚠️ Este usuario no tiene roles asignados actualmente.
              </div>
            )}
          </div>
        )}

        {/* Role Selection */}
        {selectedUserId && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
              Seleccionar Roles (puede seleccionar múltiples o dejar vacío para remover todos):
            </label>
            
            {selectedRoles.length === 0 && (
              <div style={{
                background: '#fff3cd',
                color: '#856404',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                border: '1px solid #ffeaa7'
              }}>
                ⚠️ Advertencia: No hay roles seleccionados. Esto removerá todos los roles del usuario.
              </div>
            )}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '10px'
            }}>
              {roles.map(role => (
                <label
                  key={role.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    border: selectedRoles.includes(role.id) ? '2px solid rgb(68,68,68)' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: selectedRoles.includes(role.id) ? 'rgb(244,228,69)' : 'white',
                    color: selectedRoles.includes(role.id) ? 'rgb(68,68,68)' : 'inherit',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: selectedRoles.includes(role.id) ? 'bold' : 'normal' }}>
                    {role.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Button */}
        {selectedUserId && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAssignRoles}
              disabled={assigning}
              style={{
                background: assigning ? '#ccc' : 'rgb(68,68,68)',
                color: assigning ? '#666' : 'rgb(244,228,69)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: assigning ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {assigning ? 'Actualizando...' : 
               selectedRoles.length === 0 ? 'Remover Todos los Roles' : 
               `Actualizar Roles (${selectedRoles.length} seleccionado${selectedRoles.length !== 1 ? 's' : ''})`}
            </button>
            
            <button
              onClick={() => {
                setSelectedUserId(null);
                setSelectedRoles([]);
                setCurrentUserRoles([]);
                setSuccessMessage(null);
                setError(null);
              }}
              disabled={assigning}
              style={{
                background: 'transparent',
                color: 'rgb(68,68,68)',
                border: '1px solid rgb(68,68,68)',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: assigning ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Limpiar Selección
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesContent;