// src/components/ServiceTypesContent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface ServiceType {
  id: number;
  serviceName: string;
  description: string;
  totalServiceExpenses: number;
}

interface ServiceTypesContentProps {
  token: string;
}

const ServiceTypesContent: React.FC<ServiceTypesContentProps> = ({ token }) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<ServiceType, 'id' | 'totalServiceExpenses'>>({
    serviceName: '',
    description: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch service types from API
  const fetchServiceTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.serviceTypes, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServiceTypes(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los tipos de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching service types:', error);
      setMessage({ text: 'Error de conexión al cargar tipos de servicio', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create new service type
  const createServiceType = async () => {
    try {
      const newServiceType = {
        serviceName: formData.serviceName,
        description: formData.description,
      };

      const response = await fetch(ENDPOINTS.serviceTypes, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newServiceType),
      });

      if (response.ok) {
        setMessage({ text: 'Tipo de servicio creado exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          serviceName: '',
          description: '',
        });
        fetchServiceTypes(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear el tipo de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating service type:', error);
      setMessage({ text: 'Error de conexión al crear tipo de servicio', type: 'error' });
    }
  };

  // Update existing service type
  const updateServiceType = async () => {
    if (!selectedServiceType) return;

    try {
      const updatedServiceType = {
        serviceName: formData.serviceName,
        description: formData.description,
      };

      const response = await fetch(`${ENDPOINTS.serviceTypes}/${selectedServiceType.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedServiceType),
      });

      if (response.ok) {
        setMessage({ text: 'Tipo de servicio actualizado exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedServiceType(null);
        fetchServiceTypes(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar el tipo de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating service type:', error);
      setMessage({ text: 'Error de conexión al actualizar tipo de servicio', type: 'error' });
    }
  };

  // Handle edit button click
  const handleEdit = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setFormData({
      serviceName: serviceType.serviceName,
      description: serviceType.description,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    setFormData({
      serviceName: '',
      description: '',
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedServiceType(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      createServiceType();
    } else if (isEditing) {
      updateServiceType();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedServiceType(null);
    setFormData({
      serviceName: '',
      description: '',
    });
  };

  useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Tipos de Servicio</h1>
      
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
          Crear Nuevo Tipo de Servicio
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
            {isCreating ? 'Crear Nuevo Tipo de Servicio' : 'Editar Tipo de Servicio'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre del Servicio:
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
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

      {/* Service Types List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando tipos de servicio...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Nombre del Servicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgb(68,68,68)',
                      fontStyle: 'italic',
                    }}
                  >
                    No hay tipos de servicio registrados
                  </td>
                </tr>
              ) : (
                serviceTypes.map((serviceType, index) => (
                  <tr
                    key={serviceType.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{serviceType.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {serviceType.serviceName}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {serviceType.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(serviceType)}
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

export default ServiceTypesContent;