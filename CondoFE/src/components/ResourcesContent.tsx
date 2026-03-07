import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { useUserRole } from '../hooks/useUserRole';

interface Resource {
  id: number;
  resourceName: string;
  description: string;
  capacity: number;
  isAvailable: boolean;
  location: string;
  costPerHour?: number;
}

interface ResourcesContentProps {
  token: string;
}

const ResourcesContent: React.FC<ResourcesContentProps> = ({ token }) => {
  const { userRoles } = useUserRole(token);
  const isAdmin = userRoles.includes('admin') || userRoles.includes('super');
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Resource, 'id'>>({
    resourceName: '',
    description: '',
    capacity: 1,
    isAvailable: true,
    location: '',
    costPerHour: 0,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch resources from API
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.resources, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResources(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los recursos`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setMessage({ text: 'Error de conexión al cargar recursos', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedResource(null);
    setFormData({
      resourceName: '',
      description: '',
      capacity: 1,
      isAvailable: true,
      location: '',
      costPerHour: 0,
    });
    setMessage(null);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      resourceName: resource.resourceName,
      description: resource.description,
      capacity: resource.capacity,
      isAvailable: resource.isAvailable,
      location: resource.location,
      costPerHour: resource.costPerHour,
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreating ? ENDPOINTS.resources : `${ENDPOINTS.resources}/${selectedResource?.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ 
          text: isCreating ? 'Recurso creado exitosamente' : 'Recurso actualizado exitosamente', 
          type: 'success' 
        });
        setIsCreating(false);
        setIsEditing(false);
        setSelectedResource(null);
        fetchResources();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo guardar el recurso`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      setMessage({ text: 'Error de conexión al guardar recurso', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este recurso?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.resources}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Recurso eliminado exitosamente', type: 'success' });
        fetchResources();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo eliminar el recurso`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      setMessage({ text: 'Error de conexión al eliminar recurso', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedResource(null);
    setMessage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: 'rgb(68,68,68)' }}>Gestión de Recursos Compartidos</h2>

      {/* Message Display */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Create Button */}
      {!isCreating && !isEditing && isAdmin && (
        <button
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            backgroundColor: 'rgb(68,68,68)',
            color: 'rgb(244,228,69)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + Crear Nuevo Recurso
        </button>
      )}

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd',
        }}>
          <h3 style={{ marginBottom: '15px', color: 'rgb(68,68,68)' }}>
            {isCreating ? 'Crear Recurso' : 'Editar Recurso'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Nombre del Recurso *
              </label>
              <input
                type="text"
                name="resourceName"
                value={formData.resourceName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Ubicación *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Capacidad *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Costo por Hora ($)
              </label>
              <input
                type="number"
                name="costPerHour"
                value={formData.costPerHour || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  style={{ marginRight: '8px' }}
                />
                Disponible
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgb(68,68,68)',
                  color: 'rgb(244,228,69)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources List */}
      {loading && resources.length === 0 ? (
        <p>Cargando recursos...</p>
      ) : resources.length === 0 ? (
        <p>No hay recursos disponibles.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {resources.map((resource) => (
            <div
              key={resource.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                {resource.resourceName}
              </h3>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Descripción:</strong> {resource.description || 'N/A'}
              </p>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Ubicación:</strong> {resource.location}
              </p>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Capacidad:</strong> {resource.capacity} personas
              </p>
              {resource.costPerHour !== undefined && resource.costPerHour > 0 && (
                <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                  <strong>Costo:</strong> ${resource.costPerHour}/hora
                </p>
              )}
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Estado:</strong>{' '}
                <span style={{ 
                  color: resource.isAvailable ? '#28a745' : '#dc3545',
                  fontWeight: 'bold' 
                }}>
                  {resource.isAvailable ? 'Disponible' : 'No Disponible'}
                </span>
              </p>
              
              {isAdmin && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(resource)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesContent;
