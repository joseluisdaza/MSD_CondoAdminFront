// src/api/endpoints.ts

export const API_BASE_URL = 'https://localhost:7221/api';

export const ENDPOINTS = {
  health: `${API_BASE_URL}/Health`,
  authHealth: `${API_BASE_URL}/AuthHealthCheck`,
  login: `${API_BASE_URL}/Auth/Login`,
  currentUser: `${API_BASE_URL}/Users/me`,
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
  
  // Resources endpoints
  resources: `${API_BASE_URL}/Resources`,
  resourceCosts: `${API_BASE_URL}/ResourceCosts`,
  resourceBookings: `${API_BASE_URL}/ResourceBookings`,
  myResourceBookings: `${API_BASE_URL}/ResourceBookings/MyBookings`,
  
  // Incidents endpoints
  incidentTypes: `${API_BASE_URL}/IncidentTypes`,
  incidentCosts: `${API_BASE_URL}/IncidentCosts`,
  incidents: `${API_BASE_URL}/Incidents`,
  myIncidents: `${API_BASE_URL}/Incidents/MyIncidents`,

  // Add other endpoints here
};
