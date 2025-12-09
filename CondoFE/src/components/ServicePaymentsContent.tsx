// src/components/ServicePaymentsContent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface ServicePayment {
  id: number;
  receiveNumber: string;
  paymentDate: string;
  amount: number;
  description: string;
  receivePhoto: string;
  statusId: number;
  serviceExpenseId: number;
  statusDescription: string;
}

interface PaymentStatus {
  id: number;
  statusDescription: string;
}

interface ServicePaymentsContentProps {
  token: string;
}

const ServicePaymentsContent: React.FC<ServicePaymentsContentProps> = ({ token }) => {
  const [servicePayments, setServicePayments] = useState<ServicePayment[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ServicePayment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<ServicePayment, 'id' | 'statusDescription'>>({
    receiveNumber: '',
    paymentDate: '',
    amount: 0.01,
    description: '',
    receivePhoto: '',
    statusId: 2,
    serviceExpenseId: 0,
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch service payments from API
  const fetchServicePayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.servicePayments, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServicePayments(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar los pagos de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching service payments:', error);
      setMessage({ text: 'Error de conexión al cargar pagos de servicio', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch payment statuses from API
  const fetchPaymentStatuses = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINTS.paymentStatus, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentStatuses(data);
      } else {
        console.error('Error fetching payment statuses:', response.status);
      }
    } catch (error) {
      console.error('Error fetching payment statuses:', error);
    }
  }, [token]);

  // Accept payment (change status to 3)
  const acceptPayment = async (payment: ServicePayment) => {
    if (!window.confirm('¿Está seguro de que desea aceptar este pago?')) {
      return;
    }

    setLoading(true);
    try {
      const updatedPayment = {
        receiveNumber: payment.receiveNumber,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        description: payment.description,
        receivePhoto: payment.receivePhoto,
        statusId: 3, // Accept status
        serviceExpenseId: payment.serviceExpenseId,
      };

      const response = await fetch(`${ENDPOINTS.servicePayments}/${payment.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayment),
      });

      if (response.ok) {
        setMessage({ text: 'Pago aceptado exitosamente', type: 'success' });
        await fetchServicePayments(); // Refresh the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo aceptar el pago`, 
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

  // Cancel payment (change status to 4)
  const cancelPayment = async (payment: ServicePayment) => {
    if (!window.confirm('¿Está seguro de que desea anular este pago?')) {
      return;
    }

    setLoading(true);
    try {
      const updatedPayment = {
        receiveNumber: payment.receiveNumber,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        description: payment.description,
        receivePhoto: payment.receivePhoto,
        statusId: 4, // Cancel status
        serviceExpenseId: payment.serviceExpenseId,
      };

      const response = await fetch(`${ENDPOINTS.servicePayments}/${payment.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayment),
      });

      if (response.ok) {
        setMessage({ text: 'Pago anulado exitosamente', type: 'success' });
        await fetchServicePayments(); // Refresh the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo anular el pago`, 
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

  // Update existing payment
  const updatePayment = async () => {
    if (!selectedPayment) return;

    try {
      const updatedPayment = {
        receiveNumber: formData.receiveNumber,
        paymentDate: formData.paymentDate,
        amount: formData.amount,
        description: formData.description,
        receivePhoto: formData.receivePhoto,
        statusId: formData.statusId,
        serviceExpenseId: formData.serviceExpenseId,
      };

      const response = await fetch(`${ENDPOINTS.servicePayments}/${selectedPayment.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayment),
      });

      if (response.ok) {
        setMessage({ text: 'Pago actualizado exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedPayment(null);
        fetchServicePayments(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar el pago`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setMessage({ text: 'Error de conexión al actualizar pago', type: 'error' });
    }
  };

  // Get status display
  const getStatusDisplay = (statusId: number) => {
    const status = paymentStatuses.find(s => s.id === statusId);
    return status ? status.statusDescription : statusId.toString();
  };

  // Handle edit button click
  const handleEdit = (payment: ServicePayment) => {
    setSelectedPayment(payment);
    setFormData({
      receiveNumber: payment.receiveNumber,
      paymentDate: payment.paymentDate.split('T')[0], // Convert to date input format
      amount: payment.amount,
      description: payment.description,
      receivePhoto: payment.receivePhoto,
      statusId: payment.statusId,
      serviceExpenseId: payment.serviceExpenseId,
    });
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date to ISO format
    const paymentDateISO = new Date(formData.paymentDate).toISOString();
    
    setFormData(prev => ({
      ...prev,
      paymentDate: paymentDateISO,
    }));

    updatePayment();
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPayment(null);
    setFormData({
      receiveNumber: '',
      paymentDate: '',
      amount: 0.01,
      description: '',
      receivePhoto: '',
      statusId: 2,
      serviceExpenseId: 0,
    });
  };

  useEffect(() => {
    fetchServicePayments();
    fetchPaymentStatuses();
  }, [fetchServicePayments, fetchPaymentStatuses]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Pagos de Expensas de Servicio</h1>
      
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

      {/* Form for edit */}
      {isEditing && (
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
            Editar Pago de Servicio
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Número de Recibo:
                </label>
                <input
                  type="text"
                  name="receiveNumber"
                  value={formData.receiveNumber}
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
                  Fecha de Pago:
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
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
                  Monto:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
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
                  Estado:
                </label>
                <select
                  name="statusId"
                  value={formData.statusId}
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
                  {paymentStatuses.map((status) => (
                    <option 
                      key={status.id} 
                      value={status.id}
                      style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}
                    >
                      {status.statusDescription}
                    </option>
                  ))}
                </select>
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
                Actualizar
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

      {/* Service Payments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando pagos de servicio...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Número Recibo</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Pago</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Monto</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>ID Expensa</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicePayments.length === 0 ? (
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
                    No hay pagos de servicio registrados
                  </td>
                </tr>
              ) : (
                servicePayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{payment.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {payment.receiveNumber}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(payment.paymentDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {payment.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {payment.serviceExpenseId}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85em',
                          fontWeight: '500',
                          backgroundColor: 
                            payment.statusId === 3 ? '#d4edda' : 
                            payment.statusId === 4 ? '#f8d7da' : 
                            '#fff3cd',
                          color: 
                            payment.statusId === 3 ? '#155724' : 
                            payment.statusId === 4 ? '#721c24' : 
                            '#856404',
                        }}
                      >
                        {getStatusDisplay(payment.statusId)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleEdit(payment)}
                          disabled={isEditing || loading}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isEditing || loading) ? 'not-allowed' : 'pointer',
                            opacity: (isEditing || loading) ? 0.6 : 1,
                            fontSize: '12px',
                            marginBottom: '2px',
                          }}
                        >
                          Editar
                        </button>
                        {payment.statusId === 2 && ( // Only show accept button for pending payments
                          <button
                            onClick={() => acceptPayment(payment)}
                            disabled={isEditing || loading}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: (isEditing || loading) ? 'not-allowed' : 'pointer',
                              opacity: (isEditing || loading) ? 0.6 : 1,
                              fontSize: '12px',
                              marginBottom: '2px',
                            }}
                          >
                            Aceptar
                          </button>
                        )}
                        {(payment.statusId === 2 || payment.statusId === 3) && ( // Show cancel for pending and accepted
                          <button
                            onClick={() => cancelPayment(payment)}
                            disabled={isEditing || loading}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: (isEditing || loading) ? 'not-allowed' : 'pointer',
                              opacity: (isEditing || loading) ? 0.6 : 1,
                              fontSize: '12px',
                              marginBottom: '2px',
                            }}
                          >
                            Anular
                          </button>
                        )}
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

export default ServicePaymentsContent;