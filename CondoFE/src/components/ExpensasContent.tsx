import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface Expense {
  id: number;
  categoryId: number;
  propertyId: number;
  startDate: string;
  paymentLimitDate: string;
  amount: number;
  interestAmount: number;
  interestRate: number;
  description: string;
  statusId: number;
  categoryName: string;
  propertyCode: string;
  propertyTower: string;
  statusDescription: string;
}

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

interface ExpenseCategory {
  id: number;
  category: string;
  description: string;
}

interface PaymentStatus {
  id: number;
  statusDescription: string;
}

interface ExpensasContentProps {
  token: string;
}

const ExpensasContent: React.FC<ExpensasContentProps> = ({ token }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'categoryName' | 'propertyCode' | 'propertyTower' | 'statusDescription'>>({
    categoryId: 0,
    propertyId: 0,
    startDate: '',
    paymentLimitDate: '',
    amount: 0.01,
    interestAmount: 0,
    interestRate: 100,
    description: '',
    statusId: 1, // Default to "Pendiente"
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.expenses, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las expensas`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setMessage({ text: 'Error de conexión al cargar expensas', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
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
        console.error('Error fetching properties:', response.status);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [token]);

  // Fetch expense categories from API
  const fetchExpenseCategories = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINTS.expenseCategories, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenseCategories(data);
      } else {
        console.error('Error fetching expense categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching expense categories:', error);
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

  // Create new expense
  const createExpense = async () => {
    try {
      const newExpense = {
        categoryId: formData.categoryId,
        propertyId: formData.propertyId,
        startDate: formData.startDate,
        paymentLimitDate: formData.paymentLimitDate,
        amount: formData.amount,
        interestAmount: formData.interestAmount,
        interestRate: formData.interestRate,
        description: formData.description,
        statusId: 1, // Always 1 for new expenses (Pendiente)
      };

      const response = await fetch(ENDPOINTS.expenses, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setMessage({ text: 'Expensa creada exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          categoryId: 0,
          propertyId: 0,
          startDate: '',
          paymentLimitDate: '',
          amount: 0.01,
          interestAmount: 0,
          interestRate: 100,
          description: '',
          statusId: 1,
        });
        fetchExpenses(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear la expensa`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      setMessage({ text: 'Error de conexión al crear expensa', type: 'error' });
    }
  };

  // Update existing expense
  const updateExpense = async () => {
    if (!selectedExpense) return;

    try {
      const updatedExpense = {
        categoryId: formData.categoryId,
        propertyId: formData.propertyId,
        startDate: formData.startDate,
        paymentLimitDate: formData.paymentLimitDate,
        amount: formData.amount,
        interestAmount: formData.interestAmount,
        interestRate: formData.interestRate,
        description: formData.description,
        statusId: formData.statusId,
      };

      const response = await fetch(`${ENDPOINTS.expenses}/${selectedExpense.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      });

      if (response.ok) {
        setMessage({ text: 'Expensa actualizada exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedExpense(null);
        fetchExpenses(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar la expensa`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      setMessage({ text: 'Error de conexión al actualizar expensa', type: 'error' });
    }
  };

  // Get display text functions
  const getPropertyDisplay = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? `${property.tower}-${property.code}` : propertyId.toString();
  };

  const getCategoryDisplay = (categoryId: number) => {
    const category = expenseCategories.find(c => c.id === categoryId);
    return category ? category.description : categoryId.toString();
  };

  const getStatusDisplay = (statusId: number) => {
    const status = paymentStatuses.find(s => s.id === statusId);
    return status ? status.statusDescription : statusId.toString();
  };

  // Handle edit button click
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      categoryId: expense.categoryId,
      propertyId: expense.propertyId,
      startDate: expense.startDate.split('T')[0], // Convert to date input format
      paymentLimitDate: expense.paymentLimitDate.split('T')[0],
      amount: expense.amount,
      interestAmount: expense.interestAmount,
      interestRate: expense.interestRate,
      description: expense.description,
      statusId: expense.statusId,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      categoryId: 0,
      propertyId: 0,
      startDate: today,
      paymentLimitDate: today,
      amount: 0.01,
      interestAmount: 0,
      interestRate: 100,
      description: '',
      statusId: 1,
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedExpense(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'date' ? value : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert dates to ISO format
    const startDateISO = new Date(formData.startDate).toISOString();
    const paymentLimitDateISO = new Date(formData.paymentLimitDate).toISOString();
    
    setFormData(prev => ({
      ...prev,
      startDate: startDateISO,
      paymentLimitDate: paymentLimitDateISO,
    }));

    if (isCreating) {
      createExpense();
    } else if (isEditing) {
      updateExpense();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedExpense(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      categoryId: 0,
      propertyId: 0,
      startDate: today,
      paymentLimitDate: today,
      amount: 0.01,
      interestAmount: 0,
      interestRate: 100,
      description: '',
      statusId: 1,
    });
  };

  useEffect(() => {
    fetchExpenses();
    fetchProperties();
    fetchExpenseCategories();
    fetchPaymentStatuses();
  }, [fetchExpenses, fetchProperties, fetchExpenseCategories, fetchPaymentStatuses]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Expensas</h1>
      
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
          Crear Nueva Expensa
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
            {isCreating ? 'Crear Nueva Expensa' : 'Editar Expensa'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Categoría:
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
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
                    Seleccionar categoría...
                  </option>
                  {expenseCategories.map((category) => (
                    <option 
                      key={category.id} 
                      value={category.id}
                      style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}
                    >
                      {category.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Propiedad:
                </label>
                <select
                  name="propertyId"
                  value={formData.propertyId}
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
                    Seleccionar propiedad...
                  </option>
                  {properties.map((property) => (
                    <option 
                      key={property.id} 
                      value={property.id}
                      style={{ backgroundColor: 'white', color: 'rgb(68,68,68)' }}
                    >
                      {property.tower}-{property.code} ({property.legalId})
                    </option>
                  ))}
                </select>
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
                  Tasa Interés (%):
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
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

      {/* Expenses List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando expensas...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Categoría</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Propiedad</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Monto</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Interés</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Inicio</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha Límite</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
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
                    No hay expensas registradas
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{expense.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {getCategoryDisplay(expense.categoryId)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {getPropertyDisplay(expense.propertyId)}
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
                      <button
                        onClick={() => handleEdit(expense)}
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

export default ExpensasContent;
