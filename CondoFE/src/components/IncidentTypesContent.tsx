import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface IncidentType {
  id: number;
  typeName: string;
  description: string;
  requiresEmergencyResponse: boolean;
}

interface IncidentTypesContentProps {
  token: string;
}

const IncidentTypesContent: React.FC<IncidentTypesContentProps> = ({ token }) => {
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<IncidentType, 'id'>>({
    typeName: '',
    description: '',
    requiresEmergencyResponse: false,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch incident types from API
  const fetchIncidentTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.incidentTypes, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIncidentTypes(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los tipos de incidente`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
      setMessage({ text: 'Error de conexión al cargar tipos de incidente', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchIncidentTypes();
  }, [fetchIncidentTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedType(null);
    setFormData({
      typeName: '',
      description: '',
      requiresEmergencyResponse: false,
    });
    setMessage(null);
  };

  const handleEdit = (type: IncidentType) => {
    setSelectedType(type);
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      typeName: type.typeName,
      description: type.description,
      requiresEmergencyResponse: type.requiresEmergencyResponse,
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreating ? ENDPOINTS.incidentTypes : `${ENDPOINTS.incidentTypes}/${selectedType?.id}`;
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
          text: isCreating ? 'Tipo de incidente creado exitosamente' : 'Tipo de incidente actualizado exitosamente', 
          type: 'success' 
        });
        setIsCreating(false);
        setIsEditing(false);
        setSelectedType(null);
        fetchIncidentTypes();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo guardar el tipo de incidente`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error saving incident type:', error);
      setMessage({ text: 'Error de conexión al guardar tipo de incidente', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este tipo de incidente?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.incidentTypes}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Tipo de incidente eliminado exitosamente', type: 'success' });
        fetchIncidentTypes();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo eliminar el tipo de incidente`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting incident type:', error);
      setMessage({ text: 'Error de conexión al eliminar tipo de incidente', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedType(null);
    setMessage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: 'rgb(68,68,68)' }}>Gestión de Tipos de Incidente</h2>

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
      {!isCreating && !isEditing && (
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
          + Crear Nuevo Tipo
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
            {isCreating ? 'Crear Tipo de Incidente' : 'Editar Tipo de Incidente'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Nombre del Tipo *
              </label>
              <input
                type="text"
                name="typeName"
                value={formData.typeName}
                onChange={handleInputChange}
                required
                placeholder="Ej: Fuga de Agua, Problema Eléctrico, Ruido Excesivo"
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
                placeholder="Describa el tipo de incidente..."
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
                  name="requiresEmergencyResponse"
                  checked={formData.requiresEmergencyResponse}
                  onChange={handleInputChange}
                  style={{ marginRight: '8px' }}
                />
                Requiere Respuesta de Emergencia
              </label>
              <small style={{ display: 'block', marginTop: '5px', color: '#6c757d' }}>
                Marque esta opción si este tipo de incidente requiere atención inmediata
              </small>
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

      {/* Incident Types List */}
      {loading && incidentTypes.length === 0 ? (
        <p>Cargando tipos de incidente...</p>
      ) : incidentTypes.length === 0 ? (
        <p>No hay tipos de incidente disponibles.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {incidentTypes.map((type) => (
            <div
              key={type.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              {type.requiresEmergencyResponse && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  ⚠️ EMERGENCIA
                </div>
              )}
              
              <h3 style={{ marginBottom: '10px', color: 'rgb(68,68,68)', paddingRight: type.requiresEmergencyResponse ? '110px' : '0' }}>
                {type.typeName}
              </h3>
              <p style={{ marginBottom: '15px', color: 'rgb(68,68,68)', lineHeight: '1.5' }}>
                {type.description || 'Sin descripción'}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #dee2e6' }}>
                <button
                  onClick={() => handleEdit(type)}
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
                  onClick={() => handleDelete(type.id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentTypesContent;
