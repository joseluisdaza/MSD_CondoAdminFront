import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface Property {
  id: number;
  legalId: string;
  tower: string;
  floor: number;
  code: string;
  propertyType: number;
  startDate: string;
  endDate?: string;
}

interface PropertyType {
  id: number;
  type: string;
  description: string;
  rooms: number;
  bathrooms: number;
  waterService: boolean;
  startDate: string;
}

interface PropiedadesContentProps {
  token: string;
}

const PropiedadesContent: React.FC<PropiedadesContentProps> = ({ token }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Property, 'id' | 'startDate'>>({
    legalId: '',
    tower: '',
    floor: 0,
    code: '',
    propertyType: 0,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.property, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las propiedades`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setMessage({ text: 'Error de conexión al cargar propiedades', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch property types from API
  const fetchPropertyTypes = useCallback(async () => {
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
        console.error('Error fetching property types:', response.status);
      }
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  }, [token]);

  // Create new property
  const createProperty = async () => {
    try {
      const newProperty = {
        ...formData,
        id: 0, // Backend will assign the actual ID
        startDate: new Date().toISOString(),
      };

      const response = await fetch(ENDPOINTS.property, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });

      if (response.ok) {
        setMessage({ text: 'Propiedad creada exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          legalId: '',
          tower: '',
          floor: 0,
          code: '',
          propertyType: 0,
        });
        fetchProperties(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear la propiedad`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setMessage({ text: 'Error de conexión al crear propiedad', type: 'error' });
    }
  };

  // Update existing property
  const updateProperty = async () => {
    if (!selectedProperty) return;

    try {
      const updatedProperty = {
        ...selectedProperty,
        ...formData,
        startDate: new Date().toISOString(),
      };

      const response = await fetch(`${ENDPOINTS.property}/${selectedProperty.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      });

      if (response.ok) {
        setMessage({ text: 'Propiedad actualizada exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedProperty(null);
        fetchProperties(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar la propiedad`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating property:', error);
      setMessage({ text: 'Error de conexión al actualizar propiedad', type: 'error' });
    }
  };

  // Delete property
  const deleteProperty = async (propertyId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta propiedad?')) {
      return;
    }

    try {
      const response = await fetch(`${ENDPOINTS.property}/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Propiedad eliminada exitosamente', type: 'success' });
        fetchProperties(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo eliminar la propiedad`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setMessage({ text: 'Error de conexión al eliminar propiedad', type: 'error' });
    }
  };

  // Handle edit button click
  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      legalId: property.legalId,
      tower: property.tower,
      floor: property.floor,
      code: property.code,
      propertyType: property.propertyType,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    setFormData({
      legalId: '',
      tower: '',
      floor: 0,
      code: '',
      propertyType: 0,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedProperty(null);
  };

  // Get property type display text
  const getPropertyTypeDisplay = (propertyTypeId: number) => {
    const type = propertyTypes.find(pt => pt.id === propertyTypeId);
    return type ? `${type.type} - ${type.description}` : propertyTypeId.toString();
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      createProperty();
    } else if (isEditing) {
      updateProperty();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedProperty(null);
    setFormData({
      legalId: '',
      tower: '',
      floor: 0,
      code: '',
      propertyType: 0,
    });
  };

  useEffect(() => {
    fetchProperties();
    fetchPropertyTypes();
  }, [fetchProperties, fetchPropertyTypes]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Propiedades</h1>
      
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
          Crear Nueva Propiedad
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
            {isCreating ? 'Crear Nueva Propiedad' : 'Editar Propiedad'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  ID Legal:
                </label>
                <input
                  type="text"
                  name="legalId"
                  value={formData.legalId}
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
                  Torre:
                </label>
                <input
                  type="text"
                  name="tower"
                  value={formData.tower}
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
                  Piso:
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
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
                  Código:
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
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
                  Tipo de Propiedad:
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
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
                  <option value="0" style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}>
                    Seleccionar tipo de propiedad...
                  </option>
                  {propertyTypes.map((type) => (
                    <option 
                      key={type.id} 
                      value={type.id}
                      style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}
                    >
                      {type.type} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
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

      {/* Properties List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando propiedades...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>ID Legal</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Torre</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Piso</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Código</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Tipo Propiedad</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Inicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Fin</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgb(68,68,68)',
                      fontStyle: 'italic',
                    }}
                  >
                    No hay propiedades registradas
                  </td>
                </tr>
              ) : (
                properties.map((property, index) => (
                  <tr
                    key={property.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{property.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {property.legalId}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {property.tower}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {property.floor}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {property.code}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {getPropertyTypeDisplay(property.propertyType)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(property.startDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {property.endDate ? new Date(property.endDate).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(property)}
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
                        <button
                          onClick={() => deleteProperty(property.id)}
                          disabled={isEditing || isCreating}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isEditing || isCreating ? 'not-allowed' : 'pointer',
                            opacity: isEditing || isCreating ? 0.6 : 1,
                            fontSize: '12px',
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
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

export default PropiedadesContent;
