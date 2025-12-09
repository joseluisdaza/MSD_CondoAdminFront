// src/components/ServiceExpensesContent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface ServiceExpense {
  id: number;
  serviceTypeId: number;
  description: string;
  amount: number;
  startDate: string;
  paymentLimitDate: string;
  interestAmount: number;
  totalAmount: number;
  status: number;
  expenseDate: string;
  statusId: number;
  serviceTypeName: string;
  statusDescription: string;
}

interface ServiceType {
  id: number;
  serviceName: string;
  description: string;
  totalServiceExpenses: number;
}

interface PaymentStatus {
  id: number;
  statusDescription: string;
}

interface ServiceExpensesContentProps {
  token: string;
}

const ServiceExpensesContent: React.FC<ServiceExpensesContentProps> = ({ token }) => {
  const [serviceExpenses, setServiceExpenses] = useState<ServiceExpense[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ServiceExpense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<ServiceExpense, 'id' | 'serviceTypeName' | 'statusDescription'>>({
    serviceTypeId: 0,
    description: '',
    amount: 0.01,
    startDate: '',
    paymentLimitDate: '',
    interestAmount: 0,
    totalAmount: 0.01,
    status: 4,
    expenseDate: '',
    statusId: 1, // Default to "Pendiente"
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch service expenses from API
  const fetchServiceExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.serviceExpenses, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServiceExpenses(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las expensas de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching service expenses:', error);
      setMessage({ text: 'Error de conexión al cargar expensas de servicio', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch service types from API
  const fetchServiceTypes = useCallback(async () => {
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
        console.error('Error fetching service types:', response.status);
      }
    } catch (error) {
      console.error('Error fetching service types:', error);
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

  // Create new service expense
  const createServiceExpense = async () => {
    try {
      const newExpense = {
        serviceTypeId: formData.serviceTypeId,
        description: formData.description,
        amount: formData.amount,
        startDate: formData.startDate,
        paymentLimitDate: formData.paymentLimitDate,
        interestAmount: formData.interestAmount,
        totalAmount: formData.totalAmount,
        status: formData.status,
        expenseDate: formData.expenseDate,
        statusId: 1, // Always 1 for new expenses (Pendiente)
      };

      const response = await fetch(ENDPOINTS.serviceExpenses, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setMessage({ text: 'Expensa de servicio creada exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          serviceTypeId: 0,
          description: '',
          amount: 0.01,
          startDate: '',
          paymentLimitDate: '',
          interestAmount: 0,
          totalAmount: 0.01,
          status: 4,
          expenseDate: '',
          statusId: 1,
        });
        fetchServiceExpenses(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear la expensa de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating service expense:', error);
      setMessage({ text: 'Error de conexión al crear expensa de servicio', type: 'error' });
    }
  };

  // Update existing service expense
  const updateServiceExpense = async () => {
    if (!selectedExpense) return;

    try {
      const updatedExpense = {
        serviceTypeId: formData.serviceTypeId,
        description: formData.description,
        amount: formData.amount,
        startDate: formData.startDate,
        paymentLimitDate: formData.paymentLimitDate,
        interestAmount: formData.interestAmount,
        totalAmount: formData.totalAmount,
        status: formData.status,
        expenseDate: formData.expenseDate,
        statusId: formData.statusId,
      };

      const response = await fetch(`${ENDPOINTS.serviceExpenses}/${selectedExpense.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      });

      if (response.ok) {
        setMessage({ text: 'Expensa de servicio actualizada exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedExpense(null);
        fetchServiceExpenses(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar la expensa de servicio`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating service expense:', error);
      setMessage({ text: 'Error de conexión al actualizar expensa de servicio', type: 'error' });
    }
  };

  // Pay service expense
  const payServiceExpense = async (expense: ServiceExpense) => {
    if (!window.confirm(`¿Está seguro de que desea procesar el pago de $${expense.totalAmount.toFixed(2)}?`)) {
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        receiveNumber: `SE-${expense.id}-${Date.now()}`, // Generate unique receipt number
        paymentDate: new Date().toISOString(),
        amount: expense.totalAmount,
        description: `Pago de expensa de servicio: ${expense.description}`,
        receivePhoto: "", // Empty string as required
        statusId: 2, // Always send statusId as 2
        serviceExpenseId: expense.id // Add the serviceExpenseId
      };

      const response = await fetch(ENDPOINTS.servicePayments, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setMessage({ text: 'Pago procesado exitosamente', type: 'success' });
        await fetchServiceExpenses(); // Refresh the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo procesar el pago`, 
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

  // Get display text functions
  const getServiceTypeDisplay = (serviceTypeId: number) => {
    const serviceType = serviceTypes.find(st => st.id === serviceTypeId);
    return serviceType ? serviceType.serviceName : serviceTypeId.toString();
  };

  const getStatusDisplay = (statusId: number) => {
    const status = paymentStatuses.find(s => s.id === statusId);
    return status ? status.statusDescription : statusId.toString();
  };

  // Handle edit button click
  const handleEdit = (expense: ServiceExpense) => {
    setSelectedExpense(expense);
    setFormData({
      serviceTypeId: expense.serviceTypeId,
      description: expense.description,
      amount: expense.amount,
      startDate: expense.startDate.split('T')[0], // Convert to date input format
      paymentLimitDate: expense.paymentLimitDate.split('T')[0],
      interestAmount: expense.interestAmount,
      totalAmount: expense.totalAmount,
      status: expense.status,
      expenseDate: expense.expenseDate.split('T')[0],
      statusId: expense.statusId,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      serviceTypeId: 0,
      description: '',
      amount: 0.01,
      startDate: today,
      paymentLimitDate: today,
      interestAmount: 0,
      totalAmount: 0.01,
      status: 4,
      expenseDate: today,
      statusId: 1,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedExpense(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    
    if (type === 'number') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: parsedValue
      };
      
      // Auto-calculate totalAmount when amount or interestAmount changes
      if (name === 'amount' || name === 'interestAmount') {
        const amount = name === 'amount' ? parsedValue as number : prev.amount;
        const interestAmount = name === 'interestAmount' ? parsedValue as number : prev.interestAmount;
        updated.totalAmount = amount + interestAmount;
      }
      
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert dates to ISO format
    const startDateISO = new Date(formData.startDate).toISOString();
    const paymentLimitDateISO = new Date(formData.paymentLimitDate).toISOString();
    const expenseDateISO = new Date(formData.expenseDate).toISOString();
    
    setFormData(prev => ({
      ...prev,
      startDate: startDateISO,
      paymentLimitDate: paymentLimitDateISO,
      expenseDate: expenseDateISO,
    }));

    if (isCreating) {
      createServiceExpense();
    } else if (isEditing) {
      updateServiceExpense();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedExpense(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      serviceTypeId: 0,
      description: '',
      amount: 0.01,
      startDate: today,
      paymentLimitDate: today,
      interestAmount: 0,
      totalAmount: 0.01,
      status: 4,
      expenseDate: today,
      statusId: 1,
    });
  };

  useEffect(() => {
    fetchServiceExpenses();
    fetchServiceTypes();
    fetchPaymentStatuses();
  }, [fetchServiceExpenses, fetchServiceTypes, fetchPaymentStatuses]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Expensas de Servicio</h1>
      
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
          Crear Nueva Expensa de Servicio
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
            {isCreating ? 'Crear Nueva Expensa de Servicio' : 'Editar Expensa de Servicio'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Tipo de Servicio:
                </label>
                <select
                  name="serviceTypeId"
                  value={formData.serviceTypeId}
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
                    Seleccionar tipo de servicio...
                  </option>
                  {serviceTypes.map((serviceType) => (
                    <option 
                      key={serviceType.id} 
                      value={serviceType.id}
                      style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}
                    >
                      {serviceType.serviceName}
                    </option>
                  ))}
                </select>
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
                  Monto Interés:
                </label>
                <input
                  type="number"
                  name="interestAmount"
                  value={formData.interestAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
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
                  Monto Total:
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#f8f9fa',
                    color: '#6c757d',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Fecha Inicio:
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
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Fecha Límite Pago:
                </label>
                <input
                  type="date"
                  name="paymentLimitDate"
                  value={formData.paymentLimitDate}
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
                  Fecha de Expensa:
                </label>
                <input
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
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
              {isEditing && (
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
              )}
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

      {/* Service Expenses List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando expensas de servicio...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Tipo Servicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Monto</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Interés</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Inicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Límite</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviceExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgb(68,68,68)',
                      fontStyle: 'italic',
                    }}
                  >
                    No hay expensas de servicio registradas
                  </td>
                </tr>
              ) : (
                serviceExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{expense.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {getServiceTypeDisplay(expense.serviceTypeId)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {expense.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      ${expense.interestAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      ${expense.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(expense.startDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(expense.paymentLimitDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {getStatusDisplay(expense.statusId)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(expense)}
                          disabled={isEditing || isCreating || loading}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isEditing || isCreating || loading) ? 'not-allowed' : 'pointer',
                            opacity: (isEditing || isCreating || loading) ? 0.6 : 1,
                            fontSize: '12px',
                          }}
                        >
                          Editar
                        </button>
                        {expense.statusId === 1 && ( // Only show pay button for pending expenses
                          <button
                            onClick={() => payServiceExpense(expense)}
                            disabled={isEditing || isCreating || loading}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: (isEditing || isCreating || loading) ? 'not-allowed' : 'pointer',
                              opacity: (isEditing || isCreating || loading) ? 0.6 : 1,
                              fontSize: '12px',
                            }}
                          >
                            Pagar
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

export default ServiceExpensesContent;