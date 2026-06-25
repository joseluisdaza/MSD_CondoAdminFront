// src/api/endpoints.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7221/api';

export const ENDPOINTS = {
  health: `${API_BASE_URL}/Health`,
  authHealth: `${API_BASE_URL}/AuthHealthCheck`,
  login: `${API_BASE_URL}/Auth/Login`,
  logout: `${API_BASE_URL}/Auth/logout`,
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
  resourceCostsCurrent: (resourceId: number) => `${API_BASE_URL}/ResourceCosts/Current/${resourceId}`,
  resourceCostsAdd: (resourceId: number) => `${API_BASE_URL}/ResourceCosts/Add/${resourceId}`,
  resourceBookings: `${API_BASE_URL}/ResourceBookings`,
  myResourceBookings: `${API_BASE_URL}/ResourceBookings/MyBookings`,
  
  // Incidents endpoints
  incidentTypes: `${API_BASE_URL}/IncidentTypes`,
  incidentCosts: `${API_BASE_URL}/IncidentCosts`,
  incidents: `${API_BASE_URL}/Incidents`,
  myIncidents: `${API_BASE_URL}/Incidents/MyIncidents`,

  // Reports endpoints
  reports: `${API_BASE_URL}/Reports`,
  executeReport: (reportId: number) => `${API_BASE_URL}/Reports/${reportId}/Execute`,
  reportStyle: (styleId: number) => `${API_BASE_URL}/Reports/Styles/${styleId}`,
};
