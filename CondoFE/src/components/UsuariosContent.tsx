import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface User {
  id: number;
  userName: string;
  lastName: string;
  legalId: string;
  login: string;
}

interface UserFormData {
  userName: string;
  lastName: string;
  legalId: string;
  login: string;
  password: string;
}

interface UsuariosContentProps {
  token: string;
}

const UsuariosContent: React.FC<UsuariosContentProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    userName: '',
    lastName: '',
    legalId: '',
    login: '',
    password: ''
  });
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
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

      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateUser = async (userId: number, userData: UserFormData) => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await fetch(`${ENDPOINTS.users}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh the users list after successful update
      await fetchUsers();
      setEditingUser(null);
      resetForm();
      
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar usuario');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      lastName: user.lastName,
      legalId: user.legalId,
      login: user.login,
      password: '' // Password field starts empty for security
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      userName: '',
      lastName: '',
      legalId: '',
      login: '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Usuarios</h2>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Gestión de Usuarios</h2>
      
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
      
      <button 
        onClick={fetchUsers}
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
        Actualizar Lista
      </button>

      {/* Users Table */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>Lista de Usuarios</h3>
        {users.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ background: 'rgb(68,68,68)', color: 'rgb(244,228,69)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Apellido</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cédula</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Login</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={{
                  background: index % 2 === 0 ? '#f8f9fa' : 'white',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{user.id}</td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{user.userName}</td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{user.lastName}</td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{user.legalId}</td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{user.login}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleEditUser(user)}
                      style={{
                        background: 'rgb(68,68,68)',
                        color: 'rgb(244,228,69)',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Form */}
      {editingUser && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid rgb(68,68,68)'
        }}>
          <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>
            Editar Usuario: {editingUser.userName}
          </h3>
          
          <form onSubmit={handleSubmitEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Nombre:
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Apellido:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Cédula:
                </label>
                <input
                  type="text"
                  name="legalId"
                  value={formData.legalId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Login:
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Nueva Contraseña (opcional):
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Dejar vacío para mantener la contraseña actual"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={updating}
                style={{
                  background: updating ? '#ccc' : 'rgb(68,68,68)',
                  color: updating ? '#666' : 'rgb(244,228,69)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                {updating ? 'Actualizando...' : 'Guardar Cambios'}
              </button>
              
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updating}
                style={{
                  background: 'transparent',
                  color: 'rgb(68,68,68)',
                  border: '1px solid rgb(68,68,68)',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsuariosContent;
