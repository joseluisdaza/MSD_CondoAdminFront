import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { useUserRole } from '../hooks/useUserRole';

interface Resource {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  photo?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<Omit<Resource, 'id' | 'endDate'>>({
    name: '',
    description: '',
    startDate: new Date().toISOString(),
    photo: '',
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
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedResource(null);
    setFormData({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      photo: '',
    });
    setMessage(null);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      name: resource.name,
      description: resource.description,
      startDate: resource.startDate.split('T')[0],
      photo: resource.photo || '',
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreating ? ENDPOINTS.resources : `${ENDPOINTS.resources}/${selectedResource?.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      // Prepare data with id:0 for create, or actual id for update
      const payload = {
        id: isCreating ? 0 : selectedResource?.id || 0,
        ...formData,
        startDate: new Date(formData.startDate).toISOString()
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
    if (!window.confirm('¿Está seguro de que desea desactivar este recurso? Esta acción establecerá una fecha de fin para el recurso.')) {
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
        setMessage({ text: 'Recurso desactivado exitosamente', type: 'success' });
        fetchResources();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo desactivar el recurso`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      setMessage({ text: 'Error de conexión al desactivar recurso', type: 'error' });
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

  // Filter resources based on search term and status
  const filteredResources = resources.filter(resource => {
    // Filter by search term (name or description)
    const matchesSearch = searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !resource.endDate) ||
      (statusFilter === 'inactive' && !!resource.endDate);
    
    return matchesSearch && matchesStatus;
  });

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

      {/* Search and Filter */}
      {!isCreating && !isEditing && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd',
        }}>
          <h3 style={{ marginBottom: '15px', color: 'rgb(68,68,68)' }}>Buscar y Filtrar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Buscar por nombre o descripción
              </label>
              <input
                type="text"
                placeholder="Escriba para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Desactivados</option>
              </select>
            </div>
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <div style={{ marginTop: '10px', color: 'rgb(68,68,68)', fontSize: '14px' }}>
              Mostrando {filteredResources.length} de {resources.length} recursos
            </div>
          )}
        </div>
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ej: Salón de Eventos, Piscina, Cancha de Tenis"
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
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Describa el recurso compartido..."
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
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
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
                Foto (URL)
              </label>
              <input
                type="text"
                name="photo"
                value={formData.photo || ''}
                onChange={handleInputChange}
                placeholder="URL de la imagen del recurso"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
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
      ) : filteredResources.length === 0 ? (
        <p>{searchTerm || statusFilter !== 'all' ? 'No se encontraron recursos con los criterios de búsqueda.' : 'No hay recursos disponibles.'}</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: resource.endDate ? '1px solid #dc3545' : '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: resource.endDate ? 0.7 : 1,
              }}
            >
              {resource.photo && (
                <div style={{
                  width: '100%',
                  height: '150px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                }}>
                  <img 
                    src={resource.photo} 
                    alt={resource.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              {resource.endDate && (
                <div style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  textAlign: 'center',
                }}>
                  RECURSO DESACTIVADO
                </div>
              )}
              <h3 style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                {resource.name}
              </h3>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Descripción:</strong> {resource.description || 'N/A'}
              </p>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Fecha de Inicio:</strong> {new Date(resource.startDate).toLocaleDateString()}
              </p>
              {resource.endDate && (
                <p style={{ marginBottom: '8px', color: '#dc3545', fontWeight: 'bold' }}>
                  <strong>Fecha de Desactivación:</strong> {new Date(resource.endDate).toLocaleDateString()}
                </p>
              )}
              
              {isAdmin && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(resource)}
                    disabled={!!resource.endDate}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: resource.endDate ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: resource.endDate ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      opacity: resource.endDate ? 0.6 : 1,
                    }}
                    title={resource.endDate ? 'No se puede editar un recurso desactivado' : 'Editar recurso'}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    disabled={!!resource.endDate}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: resource.endDate ? '#6c757d' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: resource.endDate ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      opacity: resource.endDate ? 0.6 : 1,
                    }}
                    title={resource.endDate ? 'Recurso ya desactivado' : 'Desactivar recurso'}
                  >
                    {resource.endDate ? 'Desactivado' : 'Eliminar'}
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
