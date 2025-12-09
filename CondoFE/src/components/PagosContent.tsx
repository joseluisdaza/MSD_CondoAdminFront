import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ENDPOINTS } from '../api/endpoints';

interface Property {
  id: number;
  legalId: string;
  tower: string;
  floor: number;
  code: string;
  propertyType: number;
  startDate: string;
}

interface Expense {
  id: number;
  categoryName: string;
  propertyCode: string;
  propertyTower: string;
  statusDescription: string;
  categoryId: number;
  propertyId: number;
  startDate: string;
  paymentLimitDate: string;
  amount: number;
  interestAmount: number;
  interestRate: number;
  description: string;
  statusId: number;
}

interface PagosContentProps {
  token: string;
}

type SortField = 'startDate' | 'paymentLimitDate' | 'amount' | 'statusDescription';
type SortDirection = 'asc' | 'desc';

const PagosContent: React.FC<PagosContentProps> = ({ token }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch user properties
  const fetchUserProperties = useCallback(async () => {
    try {
      const response = await fetch(ENDPOINTS.userProperties, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        return data;
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudieron cargar las propiedades del usuario`, 
          type: 'error' 
        });
        return [];
      }
    } catch (error) {
      console.error('Error fetching user properties:', error);
      setMessage({ text: 'Error de conexión al cargar propiedades del usuario', type: 'error' });
      return [];
    }
  }, [token]);

  // Fetch expenses for a specific property
  const fetchPropertyExpenses = useCallback(async (propertyId: number) => {
    try {
      const response = await fetch(`${ENDPOINTS.expenses}/property/${propertyId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(`Error fetching expenses for property ${propertyId}:`, response.status);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching expenses for property ${propertyId}:`, error);
      return [];
    }
  }, [token]);

  // Fetch all expenses for user properties
  const fetchAllUserExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const userProperties = await fetchUserProperties();
      if (userProperties.length === 0) {
        setAllExpenses([]);
        return;
      }

      // Fetch expenses for all properties
      const expensePromises = userProperties.map(property => 
        fetchPropertyExpenses(property.id)
      );
      
      const expenseArrays = await Promise.all(expensePromises);
      const flatExpenses = expenseArrays.flat();
      
      setAllExpenses(flatExpenses);
    } catch (error) {
      console.error('Error fetching user expenses:', error);
      setMessage({ text: 'Error al cargar expensas del usuario', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [fetchUserProperties, fetchPropertyExpenses]);

  // Pay expense
  const payExpense = async (expenseId: number) => {
    if (!window.confirm('¿Está seguro de que desea procesar el pago de esta expensa?')) {
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.expensePayments, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenseId }),
      });

      if (response.ok) {
        setMessage({ text: 'Pago procesado exitosamente', type: 'success' });
        fetchAllUserExpenses(); // Reload the list
      } else {
        const errorText = await response.text();
        setMessage({ 
          text: errorText || `Error ${response.status}: No se pudo procesar el pago`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ text: 'Error de conexión al procesar el pago', type: 'error' });
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort and filter expenses
  const sortedAndFilteredExpenses = useMemo(() => {
    let filtered = allExpenses;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = allExpenses.filter(expense => 
        statusFilter === 'pending' ? expense.statusId === 1 : expense.statusDescription === statusFilter
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'paymentLimitDate':
          aValue = new Date(a.paymentLimitDate);
          bValue = new Date(b.paymentLimitDate);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'statusDescription':
          aValue = a.statusDescription;
          bValue = b.statusDescription;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allExpenses, sortField, sortDirection, statusFilter]);

  // Calculate total interest if interest rate > 0
  const calculateTotalInterest = (amount: number, interestRate: number, interestAmount: number) => {
    if (interestRate > 0) {
      return (amount * interestRate) / 100;
    }
    return interestAmount;
  };

  // Get unique statuses for filter
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(allExpenses.map(expense => expense.statusDescription))];
    return statuses;
  }, [allExpenses]);

  // Sort header component
  const SortHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      style={{ 
        padding: '12px', 
        textAlign: 'left', 
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative'
      }}
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field && (
        <span style={{ marginLeft: '5px' }}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );

  useEffect(() => {
    fetchAllUserExpenses();
  }, [fetchAllUserExpenses]);

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
      <h1 style={{ color: 'rgb(68,68,68)', marginBottom: '20px' }}>Pago de Expensas</h1>
      
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

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold', color: 'rgb(68,68,68)' }}>
            Filtrar por Estado:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: 'rgb(68,68,68)',
            }}
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Solo Pendientes</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div style={{ color: 'rgb(68,68,68)', fontSize: '14px' }}>
          Total de expensas: {sortedAndFilteredExpenses.length}
        </div>
      </div>

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
                <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
                <SortHeader field="statusDescription">Estado</SortHeader>
                <SortHeader field="amount">Monto</SortHeader>
                <th style={{ padding: '12px', textAlign: 'center' }}>Interés</th>
                <SortHeader field="startDate">Fecha Inicio</SortHeader>
                <SortHeader field="paymentLimitDate">Fecha Límite</SortHeader>
                <th style={{ padding: '12px', textAlign: 'center' }}>Tasa Interés (%)</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredExpenses.length === 0 ? (
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
                    {allExpenses.length === 0 
                      ? 'No tienes expensas registradas' 
                      : 'No se encontraron expensas con los filtros aplicados'
                    }
                  </td>
                </tr>
              ) : (
                sortedAndFilteredExpenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>{expense.id}</td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      {expense.description}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: expense.statusId === 1 ? '#28a745' : expense.statusId === 4 ? '#dc3545' : 'rgb(68,68,68)',
                      fontWeight: expense.statusId === 1 ? 'bold' : 'normal'
                    }}>
                      {expense.statusDescription}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)', fontWeight: 'bold' }}>
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      ${calculateTotalInterest(expense.amount, expense.interestRate, expense.interestAmount).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(expense.startDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', color: 'rgb(68,68,68)' }}>
                      {new Date(expense.paymentLimitDate).toLocaleDateString('es-ES')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'rgb(68,68,68)' }}>
                      {expense.interestRate.toFixed(1)}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {expense.statusId === 1 ? (
                        <button
                          onClick={() => payExpense(expense.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Pagar
                        </button>
                      ) : (
                        <span style={{ color: '#6c757d', fontSize: '12px' }}>N/A</span>
                      )}
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

export default PagosContent;
