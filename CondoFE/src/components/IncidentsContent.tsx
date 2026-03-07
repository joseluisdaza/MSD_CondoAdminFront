import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { useUserRole } from '../hooks/useUserRole';

interface Incident {
  id: number;
  incidentTypeId: number;
  userId: number;
  propertyId: number;
  incidentDate: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  resolutionDate?: string;
  resolutionNotes?: string;
  totalCost?: number;
  incidentTypeName?: string;
  userName?: string;
  propertyCode?: string;
}

interface IncidentType {
  id: number;
  typeName: string;
  description: string;
  requiresEmergencyResponse: boolean;
}

interface Property {
  id: number;
  code: string;
  tower: string;
}

interface IncidentsContentProps {
  token: string;
}

const IncidentsContent: React.FC<IncidentsContentProps> = ({ token }) => {
  const { userRoles } = useUserRole(token);
  const isAdmin = userRoles.includes('admin') || userRoles.includes('super');
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMyIncidents, setShowMyIncidents] = useState(!isAdmin);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [formData, setFormData] = useState<Omit<Incident, 'id' | 'incidentTypeName' | 'userName' | 'propertyCode' | 'totalCost'>>({
    incidentTypeId: 0,
    userId: 0,
    propertyId: 0,
    incidentDate: '',
    description: '',
    location: '',
    priority: 'Medium',
    status: 'Reported',
    resolutionDate: undefined,
    resolutionNotes: undefined,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch incidents from API
  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = showMyIncidents ? ENDPOINTS.myIncidents : ENDPOINTS.incidents;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los incidentes`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setMessage({ text: 'Error de conexión al cargar incidentes', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, showMyIncidents]);

  // Fetch incident types
  const fetchIncidentTypes = useCallback(async () => {
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
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
    }
  }, [token]);

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    try {
      const endpoint = isAdmin ? ENDPOINTS.property : ENDPOINTS.userProperties;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    fetchIncidents();
    fetchIncidentTypes();
    fetchProperties();
  }, [fetchIncidents, fetchIncidentTypes, fetchProperties]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedIncident(null);
    setViewMode('list');
    
    // Get current date and time
    const now = new Date().toISOString().slice(0, 16);
    
    setFormData({
      incidentTypeId: incidentTypes.length > 0 ? incidentTypes[0].id : 0,
      userId: 0,
      propertyId: properties.length > 0 ? properties[0].id : 0,
      incidentDate: now,
      description: '',
      location: '',
      priority: 'Medium',
      status: 'Reported',
      resolutionDate: undefined,
      resolutionNotes: undefined,
    });
    setMessage(null);
  };

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsEditing(true);
    setIsCreating(false);
    setViewMode('list');
    setFormData({
      incidentTypeId: incident.incidentTypeId,
      userId: incident.userId,
      propertyId: incident.propertyId,
      incidentDate: incident.incidentDate.slice(0, 16),
      description: incident.description,
      location: incident.location,
      priority: incident.priority,
      status: incident.status,
      resolutionDate: incident.resolutionDate?.slice(0, 16),
      resolutionNotes: incident.resolutionNotes,
    });
    setMessage(null);
  };

  const handleViewDetail = (incident: Incident) => {
    setSelectedIncident(incident);
    setViewMode('detail');
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreating ? ENDPOINTS.incidents : `${ENDPOINTS.incidents}/${selectedIncident?.id}`;
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
          text: isCreating ? 'Incidente reportado exitosamente' : 'Incidente actualizado exitosamente', 
          type: 'success' 
        });
        setIsCreating(false);
        setIsEditing(false);
        setSelectedIncident(null);
        fetchIncidents();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo guardar el incidente`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error saving incident:', error);
      setMessage({ text: 'Error de conexión al guardar incidente', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este incidente?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.incidents}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Incidente eliminado exitosamente', type: 'success' });
        fetchIncidents();
        setViewMode('list');
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo eliminar el incidente`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
      setMessage({ text: 'Error de conexión al eliminar incidente', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedIncident(null);
    setViewMode('list');
    setMessage(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return '#28a745';
      case 'In Progress': return '#007bff';
      case 'Reported': return '#ffc107';
      case 'Pending': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: 'rgb(68,68,68)' }}>Gestión de Incidentes</h2>

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

      {/* Detail View */}
      {viewMode === 'detail' && selectedIncident && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd',
        }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 16px',
              marginBottom: '15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Volver a la lista
          </button>

          <h3 style={{ marginBottom: '20px', color: 'rgb(68,68,68)' }}>
            Detalles del Incidente #{selectedIncident.id}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                <strong>Tipo:</strong> {selectedIncident.incidentTypeName || `Tipo #${selectedIncident.incidentTypeId}`}
              </p>
              <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                <strong>Fecha:</strong> {new Date(selectedIncident.incidentDate).toLocaleString()}
              </p>
              <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                <strong>Ubicación:</strong> {selectedIncident.location}
              </p>
              <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                <strong>Prioridad:</strong>{' '}
                <span style={{ 
                  color: getPriorityColor(selectedIncident.priority),
                  fontWeight: 'bold' 
                }}>
                  {selectedIncident.priority}
                </span>
              </p>
            </div>
            <div>
              <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                <strong>Estado:</strong>{' '}
                <span style={{ 
                  color: getStatusColor(selectedIncident.status),
                  fontWeight: 'bold' 
                }}>
                  {selectedIncident.status}
                </span>
              </p>
              {!showMyIncidents && isAdmin && (
                <>
                  <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                    <strong>Usuario:</strong> {selectedIncident.userName || `Usuario #${selectedIncident.userId}`}
                  </p>
                  <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                    <strong>Propiedad:</strong> {selectedIncident.propertyCode || `Prop #${selectedIncident.propertyId}`}
                  </p>
                </>
              )}
              {selectedIncident.totalCost && selectedIncident.totalCost > 0 && (
                <p style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>
                  <strong>Costo:</strong> ${selectedIncident.totalCost.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>Descripción:</h4>
            <p style={{ color: 'rgb(68,68,68)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {selectedIncident.description}
            </p>
          </div>

          {selectedIncident.resolutionDate && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: 'rgb(68,68,68)' }}>Resolución:</h4>
              <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                <strong>Fecha de resolución:</strong> {new Date(selectedIncident.resolutionDate).toLocaleString()}
              </p>
              {selectedIncident.resolutionNotes && (
                <p style={{ color: 'rgb(68,68,68)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedIncident.resolutionNotes}
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => handleEdit(selectedIncident)}
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
            {isAdmin && (
              <button
                onClick={() => handleDelete(selectedIncident.id)}
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
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Toggle View for Admin */}
          {isAdmin && !isCreating && !isEditing && (
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setShowMyIncidents(!showMyIncidents)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgb(68,68,68)',
                  color: 'rgb(244,228,69)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '10px',
                }}
              >
                {showMyIncidents ? 'Ver Todos los Incidentes' : 'Ver Mis Incidentes'}
              </button>
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
              + Reportar Nuevo Incidente
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
                {isCreating ? 'Reportar Nuevo Incidente' : 'Editar Incidente'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                    Tipo de Incidente *
                  </label>
                  <select
                    name="incidentTypeId"
                    value={formData.incidentTypeId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value={0}>Seleccione un tipo</option>
                    {incidentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName} {type.requiresEmergencyResponse ? '⚠️' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                    Propiedad *
                  </label>
                  <select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value={0}>Seleccione una propiedad</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.code} - Torre {property.tower}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                    Fecha y Hora del Incidente *
                  </label>
                  <input
                    type="datetime-local"
                    name="incidentDate"
                    value={formData.incidentDate}
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
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Lobby principal, Estacionamiento nivel 2, etc."
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
                    Prioridad *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Low">Baja</option>
                    <option value="Medium">Media</option>
                    <option value="High">Alta</option>
                    <option value="Critical">Crítica</option>
                  </select>
                </div>

                {isAdmin && isEditing && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      Estado *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="Reported">Reportado</option>
                      <option value="Pending">Pendiente</option>
                      <option value="In Progress">En Progreso</option>
                      <option value="Resolved">Resuelto</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Describa el incidente con el mayor detalle posible..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                {isAdmin && isEditing && (
                  <>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                        Fecha de Resolución
                      </label>
                      <input
                        type="datetime-local"
                        name="resolutionDate"
                        value={formData.resolutionDate || ''}
                        onChange={handleInputChange}
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
                        Notas de Resolución
                      </label>
                      <textarea
                        name="resolutionNotes"
                        value={formData.resolutionNotes || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describa cómo se resolvió el incidente..."
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </>
                )}

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

          {/* Incidents List */}
          {loading && incidents.length === 0 ? (
            <p>Cargando incidentes...</p>
          ) : incidents.length === 0 ? (
            <p>No hay incidentes reportados.</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
            }}>
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => handleViewDetail(incident)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ color: 'rgb(68,68,68)', margin: 0 }}>
                      Incidente #{incident.id}
                    </h3>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: getPriorityColor(incident.priority),
                      color: 'white',
                    }}>
                      {incident.priority}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                    <strong>Tipo:</strong> {incident.incidentTypeName || `Tipo #${incident.incidentTypeId}`}
                  </p>
                  <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                    <strong>Fecha:</strong> {new Date(incident.incidentDate).toLocaleDateString()}
                  </p>
                  <p style={{ marginBottom: '8px', color: 'rgb(68,68,68)' }}>
                    <strong>Ubicación:</strong> {incident.location}
                  </p>
                  <p style={{ 
                    marginBottom: '8px', 
                    color: 'rgb(68,68,68)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    <strong>Descripción:</strong> {incident.description}
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>Estado:</strong>{' '}
                    <span style={{ 
                      color: getStatusColor(incident.status),
                      fontWeight: 'bold' 
                    }}>
                      {incident.status}
                    </span>
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #dee2e6',
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(incident);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Editar
                    </button>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(incident.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IncidentsContent;
