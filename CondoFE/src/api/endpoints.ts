// src/api/endpoints.ts

export const API_BASE_URL = 'https://localhost:7221/api';

export const ENDPOINTS = {
  health: `${API_BASE_URL}/Health`,
  authHealth: `${API_BASE_URL}/AuthHealthCheck`,
  login: `${API_BASE_URL}/Auth/Login`,
  property: `${API_BASE_URL}/Property`,
  propertyType: `${API_BASE_URL}/PropertyType`,
  users: `${API_BASE_URL}/Users`,
  role: `${API_BASE_URL}/Role`,
  expenseCategories: `${API_BASE_URL}/ExpenseCategories`,
  expenses: `${API_BASE_URL}/Expenses`,
  paymentStatus: `${API_BASE_URL}/PaymentStatus`,
  userProperties: `${API_BASE_URL}/Property/ByUser`,
  expensePayments: `${API_BASE_URL}/ExpensePayments`,
  propertyOwners: `${API_BASE_URL}/PropertyOwners`,
  serviceTypes: `${API_BASE_URL}/ServiceTypes`,
  serviceExpenses: `${API_BASE_URL}/ServiceExpenses`,
  servicePayments: `${API_BASE_URL}/ServicePayments`,

  // Add other endpoints here
};
