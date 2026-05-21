import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { useUserRole } from '../hooks/useUserRole';

interface ResourceBooking {
  id: number;
  resourceId: number;
  userId: number;
  propertyId: number;
  statusId: number;
  bookingDate: string;
  startTime: string | null;
  endTime: string | null;
  bookingEndDate: string;
  bookingPrice: number;
  bookingWarrantyCost: number;
  bookingDescription: string;
  bookingPhoto: string | null;
  purpose: string;
  numberOfPeople: number;
  resourceName?: string;
  userName?: string;
  propertyCode?: string;
}

interface Resource {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  photo?: string;
}

interface Property {
  id: number;
  code: string;
  tower: string;
}

interface ResourceBookingsContentProps {
  token: string;
}

const DEFAULT_STATUS_ID = 1;

const statusOptions = [
  { value: 1, label: 'Pendiente' },
  { value: 2, label: 'Confirmada' },
  { value: 3, label: 'Cancelada' },
  { value: 4, label: 'Finalizada' },
];

const toDatetimeLocal = (value: string | null | undefined) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const tzOffset = parsed.getTimezoneOffset();
  const localDate = new Date(parsed.getTime() - tzOffset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const toIsoOrNull = (value: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const toTimeString = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return '00:00:00';
  }
  const hh = String(parsed.getHours()).padStart(2, '0');
  const mm = String(parsed.getMinutes()).padStart(2, '0');
  const ss = String(parsed.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const getEndOfDayIsoFromIso = (startIso: string) => {
  const parsed = new Date(startIso);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  const endOfDay = new Date(parsed);
  endOfDay.setHours(23, 59, 59, 0);
  return endOfDay.toISOString();
};

const getStatusLabel = (statusId: number) => {
  const status = statusOptions.find(option => option.value === statusId);
  return status?.label || `Estado ${statusId}`;
};

const normalizeBooking = (booking: Partial<ResourceBooking>): ResourceBooking => ({
  id: booking.id || 0,
  resourceId: booking.resourceId || 0,
  userId: booking.userId || 0,
  propertyId: booking.propertyId || 0,
  statusId: booking.statusId || DEFAULT_STATUS_ID,
  bookingDate: booking.bookingDate || new Date().toISOString(),
  startTime: booking.startTime || null,
  endTime: booking.endTime || null,
  bookingEndDate: booking.bookingEndDate || booking.bookingDate || new Date().toISOString(),
  bookingPrice: booking.bookingPrice || 0,
  bookingWarrantyCost: booking.bookingWarrantyCost || 0,
  bookingDescription: booking.bookingDescription || '',
  bookingPhoto: booking.bookingPhoto || null,
  purpose: booking.purpose || '',
  numberOfPeople: booking.numberOfPeople || 0,
  resourceName: booking.resourceName,
  userName: booking.userName,
  propertyCode: booking.propertyCode,
});

const ResourceBookingsContent: React.FC<ResourceBookingsContentProps> = ({ token }) => {
  const { userRoles } = useUserRole(token);
  const isAdmin = userRoles.includes('admin') || userRoles.includes('super');
  
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ResourceBooking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(!isAdmin);
  const [formData, setFormData] = useState<Omit<ResourceBooking, 'id' | 'resourceName' | 'userName' | 'propertyCode'>>({
    resourceId: 0,
    userId: 0,
    propertyId: 0,
    statusId: DEFAULT_STATUS_ID,
    bookingDate: new Date().toISOString(),
    startTime: null,
    endTime: null,
    bookingEndDate: new Date().toISOString(),
    bookingPrice: 0,
    bookingWarrantyCost: 0,
    bookingDescription: '',
    bookingPhoto: null,
    purpose: '',
    numberOfPeople: 1,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = showMyBookings ? ENDPOINTS.myResourceBookings : ENDPOINTS.resourceBookings;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map((item) => normalizeBooking(item));
        setBookings(normalized);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las reservas`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage({ text: 'Error de conexión al cargar reservas', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, showMyBookings]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
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
        // Filter only active resources (those without endDate)
        setResources(data.filter((r: Resource) => !r.endDate));
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
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
    fetchBookings();
    fetchResources();
    fetchProperties();
  }, [fetchBookings, fetchResources, fetchProperties]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numericFields = ['resourceId', 'propertyId', 'statusId', 'bookingPrice', 'bookingWarrantyCost', 'numberOfPeople'];
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || numericFields.includes(name) ? Number(value) || 0 : value
    }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedBooking(null);
    
    const now = new Date();
    now.setSeconds(0, 0);
    const bookingDateIso = now.toISOString();
    
    setFormData({
      resourceId: resources.length > 0 ? resources[0].id : 0,
      userId: 0,
      propertyId: properties.length > 0 ? properties[0].id : 0,
      statusId: DEFAULT_STATUS_ID,
      bookingDate: bookingDateIso,
      startTime: null,
      endTime: null,
      bookingEndDate: getEndOfDayIsoFromIso(bookingDateIso),
      bookingPrice: 0,
      bookingWarrantyCost: 0,
      bookingDescription: '',
      bookingPhoto: null,
      purpose: '',
      numberOfPeople: 1,
    });
    setMessage(null);
  };

  const handleEdit = (booking: ResourceBooking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setIsCreating(false);
    setFormData({
      resourceId: booking.resourceId,
      userId: booking.userId,
      propertyId: booking.propertyId,
      statusId: booking.statusId,
      bookingDate: booking.bookingDate,
      startTime: null,
      endTime: null,
      bookingEndDate: getEndOfDayIsoFromIso(booking.bookingDate),
      bookingPrice: booking.bookingPrice,
      bookingWarrantyCost: booking.bookingWarrantyCost,
      bookingDescription: booking.bookingDescription,
      bookingPhoto: booking.bookingPhoto,
      purpose: booking.purpose,
      numberOfPeople: booking.numberOfPeople,
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isCreating ? ENDPOINTS.resourceBookings : `${ENDPOINTS.resourceBookings}/${selectedBooking?.id}`;
      const method = isCreating ? 'POST' : 'PUT';
      const normalizedBookingDate = toIsoOrNull(toDatetimeLocal(formData.bookingDate)) || new Date().toISOString();
      const normalizedBookingEndDate = toIsoOrNull(toDatetimeLocal(formData.bookingEndDate)) || new Date().toISOString();

      const payload = {
        id: isCreating ? 0 : selectedBooking?.id || 0,
        resourceId: Number(formData.resourceId) || 0,
        userId: formData.userId,
        propertyId: Number(formData.propertyId) || 0,
        statusId: Number(formData.statusId) || DEFAULT_STATUS_ID,
        bookingDate: normalizedBookingDate,
        startTime: toTimeString(normalizedBookingDate),
        endTime: toTimeString(normalizedBookingEndDate),
        bookingEndDate: normalizedBookingEndDate,
        bookingPrice: Number(formData.bookingPrice) || 0,
        bookingWarrantyCost: Number(formData.bookingWarrantyCost) || 0,
        bookingDescription: formData.bookingDescription,
        bookingPhoto: formData.bookingPhoto || '',
        purpose: formData.purpose || '',
        numberOfPeople: Number(formData.numberOfPeople) || 0,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({ 
          text: isCreating ? 'Reserva creada exitosamente' : 'Reserva actualizada exitosamente', 
          type: 'success' 
        });
        setIsCreating(false);
        setIsEditing(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo guardar la reserva`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      setMessage({ text: 'Error de conexión al guardar reserva', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.resourceBookings}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Reserva cancelada exitosamente', type: 'success' });
        fetchBookings();
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo cancelar la reserva`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setMessage({ text: 'Error de conexión al cancelar reserva', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedBooking(null);
    setMessage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: 'rgb(68,68,68)' }}>Reservas de Recursos</h2>

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

      {/* Toggle View for Admin */}
      {isAdmin && !isCreating && !isEditing && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowMyBookings(!showMyBookings)}
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
            {showMyBookings ? 'Ver Todas las Reservas' : 'Ver Mis Reservas'}
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
          + Nueva Reserva
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
            {isCreating ? 'Nueva Reserva' : 'Editar Reserva'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Recurso *
              </label>
              <select
                name="resourceId"
                value={formData.resourceId}
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
                <option value={0}>Seleccione un recurso</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} - {resource.description}
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
                Fecha y hora de Inicio *
              </label>
              <input
                type="datetime-local"
                name="bookingDate"
                value={toDatetimeLocal(formData.bookingDate)}
                onChange={(e) => {
                  const isoValue = toIsoOrNull(e.target.value) || new Date().toISOString();
                  setFormData(prev => ({
                    ...prev,
                    bookingDate: isoValue,
                    bookingEndDate: getEndOfDayIsoFromIso(isoValue),
                  }));
                }}
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
                Fecha y Hora de Fin *
              </label>
              <input
                type="datetime-local"
                name="bookingEndDate"
                value={toDatetimeLocal(formData.bookingEndDate)}
                readOnly
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f1f3f5',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Precio de Reserva
                </label>
                <input
                  type="number"
                  name="bookingPrice"
                  value={formData.bookingPrice}
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

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                  Precio de Garantía
                </label>
                <input
                  type="number"
                  name="bookingWarrantyCost"
                  value={formData.bookingWarrantyCost}
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
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Estado
              </label>
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                Descripción de la Reserva
              </label>
              <textarea
                name="bookingDescription"
                value={formData.bookingDescription}
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
                Número de Personas *
              </label>
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
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
                {loading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Guardar')}
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

      {/* Bookings List */}
      {loading && bookings.length === 0 ? (
        <p>Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <p>No hay reservas disponibles.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            backgroundColor: 'white',
            borderCollapse: 'collapse',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <thead>
              <tr style={{ backgroundColor: 'rgb(68,68,68)', color: 'rgb(244,228,69)' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Recurso</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Inicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fin</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Personas</th>
                {!showMyBookings && isAdmin && (
                  <>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Propiedad</th>
                  </>
                )}
                <th style={{ padding: '12px', textAlign: 'left' }}>Precio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Garantía</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} style={{ 
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  borderBottom: '1px solid #dee2e6',
                }}>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    {booking.resourceName || `Recurso #${booking.resourceId}`}
                  </td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    {new Date(booking.bookingDate).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    {new Date(booking.bookingEndDate).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    {booking.numberOfPeople}
                  </td>
                  {!showMyBookings && isAdmin && (
                    <>
                      <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                        {booking.userName || `Usuario #${booking.userId}`}
                      </td>
                      <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                        {booking.propertyCode || `Prop #${booking.propertyId}`}
                      </td>
                    </>
                  )}
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    ${booking.bookingPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                    ${booking.bookingWarrantyCost.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: booking.statusId === 2 ? '#d4edda' : booking.statusId === 3 ? '#f8d7da' : '#fff3cd',
                      color: booking.statusId === 2 ? '#155724' : booking.statusId === 3 ? '#721c24' : '#856404',
                    }}>
                      {getStatusLabel(booking.statusId)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleEdit(booking)}
                        style={{
                          padding: '5px 10px',
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
                          onClick={() => handleDelete(booking.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResourceBookingsContent;
