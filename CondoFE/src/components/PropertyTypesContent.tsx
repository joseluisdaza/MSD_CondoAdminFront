import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface PropertyType {
  id: number;
  type: string;
  description: string;
  rooms: number;
  bathrooms: number;
  waterService: boolean;
  startDate: string;
}

interface PropertyTypesContentProps {
  token: string;
}

const PropertyTypesContent: React.FC<PropertyTypesContentProps> = ({ token }) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<PropertyType, 'id' | 'startDate'>>({
    type: '',
    description: '',
    rooms: 0,
    bathrooms: 0,
    waterService: true,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch property types from API
  const fetchPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.propertyType, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPropertyTypes(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los tipos de propiedad`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching property types:', error);
      setMessage({ text: 'Error de conexión al cargar tipos de propiedad', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create new property type
  const createPropertyType = async () => {
    try {
      const newPropertyType = {
        ...formData,
        id: 0, // Backend will assign the actual ID
        startDate: new Date().toISOString(),
      };

      const response = await fetch(ENDPOINTS.propertyType, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPropertyType),
      });

      if (response.ok) {
        setMessage({ text: 'Tipo de propiedad creado exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          type: '',
          description: '',
          rooms: 0,
          bathrooms: 0,
          waterService: true,
        });
        fetchPropertyTypes(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear el tipo de propiedad`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating property type:', error);
      setMessage({ text: 'Error de conexión al crear tipo de propiedad', type: 'error' });
    }
  };

  // Update existing property type
  const updatePropertyType = async () => {
    if (!selectedPropertyType) return;

    try {
      const updatedPropertyType = {
        ...selectedPropertyType,
        ...formData,
        startDate: new Date().toISOString(),
      };

      const response = await fetch(`${ENDPOINTS.propertyType}/${selectedPropertyType.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPropertyType),
      });

      if (response.ok) {
        setMessage({ text: 'Tipo de propiedad actualizado exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedPropertyType(null);
        fetchPropertyTypes(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: ${response.body}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating property type:', error);
      setMessage({ text: 'Error de conexión al actualizar tipo de propiedad', type: 'error' });
    }
  };

  // Handle edit button click
  const handleEdit = (propertyType: PropertyType) => {
    setSelectedPropertyType(propertyType);
    setFormData({
      type: propertyType.type,
      description: propertyType.description,
      rooms: propertyType.rooms,
      bathrooms: propertyType.bathrooms,
      waterService: propertyType.waterService,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    setFormData({
      type: '',
      description: '',
      rooms: 0,
      bathrooms: 0,
      waterService: true,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedPropertyType(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      createPropertyType();
    } else if (isEditing) {
      updatePropertyType();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedPropertyType(null);
    setFormData({
      type: '',
      description: '',
      rooms: 0,
      bathrooms: 0,
      waterService: true,
    });
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, [fetchPropertyTypes]);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Tipos de Propiedades</h1>
      
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

      {/* Create button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreate}
          disabled={isEditing || isCreating}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgb(68,68,68)',
            color: 'rgb(244,228,69)',
            border: 'none',
            borderRadius: '4px',
            cursor: isEditing || isCreating ? 'not-allowed' : 'pointer',
            opacity: isEditing || isCreating ? 0.6 : 1,
          }}
        >
          Crear Nuevo Tipo de Propiedad
        </button>
      </div>

      {/* Form for create/edit */}
      {(isCreating || isEditing) && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #dee2e6',
          }}
        >
          <h3 style={{ color: 'rgb(68,68,68)', marginBottom: '15px' }}>
            {isCreating ? 'Crear Nuevo Tipo de Propiedad' : 'Editar Tipo de Propiedad'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Tipo:
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Habitaciones:
                </label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  min="0"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Baños:
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="waterService"
                  checked={formData.waterService}
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px' }}
                />
                <label style={{ fontWeight: 'bold' }}>Servicio de Agua</label>
              </div>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Descripción:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {isCreating ? 'Crear' : 'Actualizar'}
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
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Property Types List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando tipos de propiedades...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Habitaciones</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Baños</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Servicio de Agua</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Inicio</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propertyTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgb(68,68,68)',
                      fontStyle: 'italic',
                    }}
                  >
                    No hay tipos de propiedades registrados
                  </td>
                </tr>
              ) : (
                propertyTypes.map((propertyType, index) => (
                  <tr
                    key={propertyType.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{propertyType.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {propertyType.type}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {propertyType.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {propertyType.rooms}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {propertyType.bathrooms}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {propertyType.waterService ? 'Sí' : 'No'}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(propertyType.startDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(propertyType)}
                        disabled={isEditing || isCreating}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ffc107',
                          color: '#212529',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: isEditing || isCreating ? 'not-allowed' : 'pointer',
                          opacity: isEditing || isCreating ? 0.6 : 1,
                          fontSize: '12px',
                        }}
                      >
                        Editar
                      </button>
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

export default PropertyTypesContent;