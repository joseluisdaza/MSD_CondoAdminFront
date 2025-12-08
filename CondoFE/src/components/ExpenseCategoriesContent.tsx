import React, { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface ExpenseCategory {
  id: number;
  category: string;
  description: string;
}

interface ExpenseCategoriesContentProps {
  token: string;
}

const ExpenseCategoriesContent: React.FC<ExpenseCategoriesContentProps> = ({ token }) => {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<ExpenseCategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<ExpenseCategory, 'id'>>({
    category: '',
    description: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch expense categories from API
  const fetchExpenseCategories = useCallback(async () => {
    setLoading(true);
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
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las categorías de expensas`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      setMessage({ text: 'Error de conexión al cargar categorías de expensas', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create new expense category
  const createExpenseCategory = async () => {
    try {
      const newExpenseCategory = {
        ...formData,
        id: 0, // Backend will assign the actual ID
      };

      const response = await fetch(ENDPOINTS.expenseCategories, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpenseCategory),
      });

      if (response.ok) {
        setMessage({ text: 'Categoría de gasto creada exitosamente', type: 'success' });
        setIsCreating(false);
        setFormData({
          category: '',
          description: '',
        });
        fetchExpenseCategories(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo crear la categoría de gasto`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error creating expense category:', error);
      setMessage({ text: 'Error de conexión al crear categoría de gasto', type: 'error' });
    }
  };

  // Update existing expense category
  const updateExpenseCategory = async () => {
    if (!selectedExpenseCategory) return;

    try {
      const updatedExpenseCategory = {
        ...selectedExpenseCategory,
        ...formData,
      };

      const response = await fetch(`${ENDPOINTS.expenseCategories}/${selectedExpenseCategory.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpenseCategory),
      });

      if (response.ok) {
        setMessage({ text: 'Categoría de gasto actualizada exitosamente', type: 'success' });
        setIsEditing(false);
        setSelectedExpenseCategory(null);
        fetchExpenseCategories(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo actualizar la categoría de gasto`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating expense category:', error);
      setMessage({ text: 'Error de conexión al actualizar categoría de gasto', type: 'error' });
    }
  };

  // Delete expense category
  const deleteExpenseCategory = async (categoryId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta categoría de gasto?')) {
      return;
    }

    try {
      const response = await fetch(`${ENDPOINTS.expenseCategories}/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ text: 'Categoría de gasto eliminada exitosamente', type: 'success' });
        fetchExpenseCategories(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo eliminar la categoría de gasto`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error deleting expense category:', error);
      setMessage({ text: 'Error de conexión al eliminar categoría de gasto', type: 'error' });
    }
  };

  // Handle edit button click
  const handleEdit = (expenseCategory: ExpenseCategory) => {
    setSelectedExpenseCategory(expenseCategory);
    setFormData({
      category: expenseCategory.category,
      description: expenseCategory.description,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create button click
  const handleCreate = () => {
    setFormData({
      category: '',
      description: '',
    });
    setIsCreating(true);
    setIsEditing(false);
    setSelectedExpenseCategory(null);
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
      createExpenseCategory();
    } else if (isEditing) {
      updateExpenseCategory();
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedExpenseCategory(null);
    setFormData({
      category: '',
      description: '',
    });
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, [fetchExpenseCategories]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Categorías de expensas</h1>
      
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
          Crear Nueva Categoría de Gasto
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
            {isCreating ? 'Crear Nueva Categoría de Gasto' : 'Editar Categoría de Gasto'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Categoría:
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
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

      {/* Expense Categories List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'rgb(68,68,68)' }}>Cargando categorías de expensas...</div>
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
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.length === 0 ? (
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
                    No hay categorías de expensas registradas
                  </td>
                </tr>
              ) : (
                expenseCategories.map((expenseCategory, index) => (
                  <tr
                    key={expenseCategory.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{expenseCategory.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {expenseCategory.category}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {expenseCategory.description}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(expenseCategory)}
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
                          onClick={() => deleteExpenseCategory(expenseCategory.id)}
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

export default ExpenseCategoriesContent;