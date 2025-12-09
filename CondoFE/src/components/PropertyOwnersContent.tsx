// src/components/PropertyOwnersContent.tsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface PropertyOwner {
  propertyId: number;
  userId: number;
  startDate: string;
  endDate: string | null;
  propertyLegalId: string;
  propertyTower: string;
  propertyFloor: number;
  propertyCode: string;
  userName: string;
  userLastName: string;
  userLogin: string;
  userLegalId: string;
  isActive: boolean;
}

interface Property {
  id: number;
  legalId: string;
  tower: string;
  floor: number;
  code: string;
  propertyTypeId: number;
  startDate: string;
  endDate: string | null;
}

interface User {
  id: number;
  userName: string;
  lastName: string;
  login: string;
  legalId: string;
}

interface PropertyOwnersContentProps {
  token: string;
}

interface CreatePropertyOwnerRequest {
  propertyId: number;
  userId: number;
}

const PropertyOwnersContent: React.FC<PropertyOwnersContentProps> = ({ token }) => {
  const [propertyOwners, setPropertyOwners] = useState<PropertyOwner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Filter states
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [includeFinalized, setIncludeFinalized] = useState(false);
  
  // Create form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState<string>('');
  const [newUserId, setNewUserId] = useState<string>('');

  // Fetch property owners based on filters
  const fetchPropertyOwners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (selectedPropertyId) {
        params.append('propertyId', selectedPropertyId);
      }
      if (selectedUserId) {
        params.append('userId', selectedUserId);
      }
      params.append('includeFinalized', includeFinalized.toString());

      const url = `${ENDPOINTS.propertyOwners}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPropertyOwners(data);
        setMessage({ text: `${data.length} relaciones encontradas`, type: 'success' });
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las relaciones propiedad-propietario`, 
          type: 'error' 
        });
        setPropertyOwners([]);
      }
    } catch (error) {
      setMessage({ 
        text: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        type: 'error' 
      });
      setPropertyOwners([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties for dropdown
  const fetchProperties = async () => {
    try {
      const response = await fetch(ENDPOINTS.property, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await fetch(ENDPOINTS.users, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Unlink property owner
  const unlinkPropertyOwner = async (propertyId: number, userId: number) => {
    if (!window.confirm('¿Está seguro de que desea desvincular esta relación propiedad-propietario?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.propertyOwners}/${propertyId}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (response.ok) {
        setMessage({ text: 'Relación desvinculada exitosamente', type: 'success' });
        await fetchPropertyOwners(); // Refresh the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo desvincular la relación`, 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new property owner relationship
  const createPropertyOwner = async () => {
    if (!newPropertyId || !newUserId) {
      setMessage({ text: 'Por favor seleccione tanto la propiedad como el usuario', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const requestBody: CreatePropertyOwnerRequest = {
        propertyId: parseInt(newPropertyId),
        userId: parseInt(newUserId)
      };

      const response = await fetch(ENDPOINTS.propertyOwners, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setMessage({ text: 'Nueva relación propiedad-propietario creada exitosamente', type: 'success' });
        setShowCreateForm(false);
        setNewPropertyId('');
        setNewUserId('');
        await fetchPropertyOwners(); // Refresh the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear la relación`, 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedPropertyId('');
    setSelectedUserId('');
    setIncludeFinalized(false);
  };

  // Load initial data
  useEffect(() => {
    fetchProperties();
    fetchUsers();
    fetchPropertyOwners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Gestión de Propietarios</h1>
      
      {/* Message display */}
      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Filters Section */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #dee2e6',
        }}
      >
        <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>Filtros de Búsqueda</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Propiedad:</label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: 'rgb(68,68,68)',
              }}
            >
              <option value="" style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>Todas las propiedades</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id} style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>
                  {`${property.tower}-${property.floor}${property.code} (${property.legalId})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Propietario:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: 'rgb(68,68,68)',
              }}
            >
              <option value="" style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>Todos los usuarios</option>
              {users.map((user) => (
                <option key={user.id} value={user.id} style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>
                  {`${user.userName} ${user.lastName} (${user.login})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeFinalized}
                onChange={(e) => setIncludeFinalized(e.target.checked)}
                disabled={loading}
              />
              Incluir finalizados
            </label>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchPropertyOwners}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgb(68,68,68)',
              color: 'rgb(244,228,69)',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            Buscar
          </button>
          <button
            onClick={clearFilters}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Create button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgb(68,68,68)',
            color: 'rgb(244,228,69)',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {showCreateForm ? 'Cancelar' : 'Nueva Relación'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #dee2e6',
          }}
        >
          <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>Nueva Relación Propiedad-Propietario</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Propiedad *:</label>
              <select
                value={newPropertyId}
                onChange={(e) => setNewPropertyId(e.target.value)}
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: 'rgb(68,68,68)',
                }}
              >
                <option value="" style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>Seleccionar propiedad</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id} style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>
                    {`${property.tower}-${property.floor}${property.code} (${property.legalId})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuario *:</label>
              <select
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                disabled={loading}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: 'rgb(68,68,68)',
                }}
              >
                <option value="" style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>Seleccionar usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id} style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>
                    {`${user.userName} ${user.lastName} (${user.login})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={createPropertyOwner}
              disabled={loading || !newPropertyId || !newUserId}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !newPropertyId || !newUserId) ? 'not-allowed' : 'pointer',
                opacity: (loading || !newPropertyId || !newUserId) ? 0.6 : 1,
              }}
            >
              Crear Relación
            </button>
          </div>
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando relaciones...</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'rgb(68,68,68)', color: 'rgb(244,228,69)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Propiedad</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Propietario</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Documento</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Inicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Fin</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propertyOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgb(68,68,68)',
                      fontStyle: 'italic',
                    }}
                  >
                    No se encontraron relaciones propiedad-propietario
                  </td>
                </tr>
              ) : (
                propertyOwners.map((owner, index) => (
                  <tr
                    key={`${owner.propertyId}-${owner.userId}`}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {`${owner.propertyTower}-${owner.propertyFloor}${owner.propertyCode}`}
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                          {owner.propertyLegalId}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {`${owner.userName} ${owner.userLastName}`}
                        </div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                          {owner.userLogin}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{owner.userLegalId}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {formatDate(owner.startDate)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {owner.endDate ? formatDate(owner.endDate) : 'Activo'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85em',
                          fontWeight: '500',
                          backgroundColor: owner.isActive ? '#d4edda' : '#f8d7da',
                          color: owner.isActive ? '#155724' : '#721c24',
                        }}
                      >
                        {owner.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {owner.isActive && (
                        <button
                          onClick={() => unlinkPropertyOwner(owner.propertyId, owner.userId)}
                          disabled={loading}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            fontSize: '12px',
                          }}
                        >
                          Desvincular
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyOwnersContent;