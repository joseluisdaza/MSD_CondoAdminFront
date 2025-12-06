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
}

interface PasswordChangeData {
  newPassword: string;
  confirmPassword: string;
}

interface UsuarioContentProps {
  token: string;
}

// Helper function to decode JWT token and extract user ID
const getUserIdFromToken = (token: string): number | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = base64.length % 4;
    const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
    
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    console.log('JWT Payload:', payload); // Debug log
    
    // Try different common JWT claims for user ID
    const possibleIdFields = [
      'sub',
      'userId', 
      'id',
      'nameid',
      'nameidentifier',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
      'user_id',
      'uid'
    ];
    
    for (const field of possibleIdFields) {
      if (payload[field] !== undefined && payload[field] !== null) {
        const userId = parseInt(payload[field], 10);
        if (!isNaN(userId)) {
          console.log(`Found user ID ${userId} in field: ${field}`);
          return userId;
        }
      }
    }
    
    console.error('No valid user ID found in token payload:', payload);
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const UsuarioContent: React.FC<UsuarioContentProps> = ({ token }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    userName: '',
    lastName: '',
    legalId: '',
    login: ''
  });
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [manualUserId, setManualUserId] = useState('');

  const fetchUserProfile = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${ENDPOINTS.users}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      setUser(userData);
      setFormData({
        userName: userData.userName,
        lastName: userData.lastName,
        legalId: userData.legalId,
        login: userData.login
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar perfil');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateUser = async (userData: UserFormData) => {
    if (!userId) return;
    
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

      // Refresh the user profile after successful update
      await fetchUserProfile(userId);
      setIsEditing(false);
      
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async (passwordData: PasswordChangeData) => {
    if (!userId) return;
    
    try {
      setUpdatingPassword(true);
      setError(null);
      
      const response = await fetch(`${ENDPOINTS.users}/${userId}/password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Reset password form after successful update
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar contraseña');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data to original values if canceling
      if (user) {
        setFormData({
          userName: user.userName,
          lastName: user.lastName,
          legalId: user.legalId,
          login: user.login
        });
      }
    }
    setIsEditing(!isEditing);
    setShowPasswordForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword === passwordData.confirmPassword) {
      updatePassword(passwordData);
    } else {
      setError('Las contraseñas no coinciden');
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleManualUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(manualUserId, 10);
    if (!isNaN(id) && id > 0) {
      setUserId(id);
      setError(null);
      fetchUserProfile(id);
    } else {
      setError('Por favor ingrese un ID de usuario válido');
    }
  };

  useEffect(() => {
    const id = getUserIdFromToken(token);
    if (id) {
      setUserId(Number(id));
      fetchUserProfile(Number(id));
    } else {
      setError('No se pudo obtener el ID del usuario del token. Por favor, verifique la consola del navegador para más detalles.');
      setLoading(false);
    }
  }, [token, fetchUserProfile]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Mi Perfil</h2>
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Mi Perfil</h2>
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '12px', 
          borderRadius: '4px',
          border: '1px solid #ef5350',
          marginBottom: '20px'
        }}>
          {error || 'No se pudo cargar la información del perfil'}
        </div>
        
        {/* Manual User ID Input */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>Cargar Perfil Manualmente</h3>
          <p style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>
            Si no se puede obtener automáticamente su ID de usuario, puede ingresarlo manualmente:
          </p>
          
          <form onSubmit={handleManualUserIdSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                ID de Usuario:
              </label>
              <input
                type="number"
                value={manualUserId}
                onChange={(e) => setManualUserId(e.target.value)}
                placeholder="Ej: 1, 2, 3..."
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !manualUserId}
              style={{
                background: (loading || !manualUserId) ? '#ccc' : 'rgb(68,68,68)',
                color: (loading || !manualUserId) ? '#666' : 'rgb(244,228,69)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: (loading || !manualUserId) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? 'Cargando...' : 'Cargar Perfil'}
            </button>
          </form>
          
          <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong style={{ color: 'rgb(68,68,68)' }}>Información técnica:</strong>
            <br />
            <small style={{ color: 'rgb(68,68,68)' }}>
              Para desarrolladores: Verifique la consola del navegador (F12) para ver los detalles del token JWT y sus claims.
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'rgb(68,68,68)', margin: 0 }}>Mi Perfil</h2>
        <button
          onClick={handleEditToggle}
          style={{
            background: isEditing ? 'rgb(244,228,69)' : 'rgb(68,68,68)',
            color: isEditing ? 'rgb(68,68,68)' : 'rgb(244,228,69)',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
        </button>
      </div>
      
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

      {/* Profile Information Display/Edit */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        {!isEditing ? (
          // Display Mode
          <div>
            <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Información Personal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  ID de Usuario:
                </label>
                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                  {user.id}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Login:
                </label>
                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                  {user.login}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Nombre:
                </label>
                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                  {user.userName}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Apellido:
                </label>
                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                  {user.lastName}
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Cédula:
                </label>
                <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', color: 'rgb(68,68,68)' }}>
                  {user.legalId}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div>
            <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Editar Información Personal</h3>
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
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                  {updating ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  disabled={updating}
                  style={{
                    background: showPasswordForm ? 'rgb(244,228,69)' : 'transparent',
                    color: showPasswordForm ? 'rgb(68,68,68)' : 'rgb(68,68,68)',
                    border: '1px solid rgb(68,68,68)',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showPasswordForm ? 'Ocultar' : 'Cambiar'} Contraseña
                </button>
              </div>
            </form>
            
            {/* Password Change Form */}
            {showPasswordForm && (
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <h4 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>
                  Cambiar Contraseña
                </h4>
                
                <form onSubmit={handleSubmitPassword}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                        Nueva Contraseña:
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
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
                        Confirmar Contraseña:
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
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
                  
                  {passwordData.newPassword && passwordData.confirmPassword && 
                   passwordData.newPassword !== passwordData.confirmPassword && (
                    <div style={{
                      color: '#c62828',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}>
                      Las contraseñas no coinciden
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={updatingPassword || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword}
                      style={{
                        background: (updatingPassword || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword) ? '#ccc' : 'rgb(68,68,68)',
                        color: (updatingPassword || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword) ? '#666' : 'rgb(244,228,69)',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: (updatingPassword || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword) ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {updatingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        resetPasswordForm();
                        setShowPasswordForm(false);
                      }}
                      disabled={updatingPassword}
                      style={{
                        background: 'transparent',
                        color: 'rgb(68,68,68)',
                        border: '1px solid rgb(68,68,68)',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: updatingPassword ? 'not-allowed' : 'pointer',
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
        )}
      </div>
    </div>
  );
};

export default UsuarioContent;
