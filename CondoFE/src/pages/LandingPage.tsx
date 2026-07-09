import React, { useEffect, useState } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { Link, useLocation, useRoutes } from 'react-router-dom';
import { useUserRole, canViewModule } from '../hooks/useUserRole';
import { protectedElement } from '../utils/protectedRoute';
import InicioContent from '../components/InicioContent';
import ExpensasContent from '../components/ExpensasContent';
import ReportesContent from '../components/ReportesContent';
import PagosContent from '../components/PagosContent';
import UsuarioContent from '../components/UsuarioContent';
import UsuariosContent from '../components/UsuariosContent';
import PropiedadesContent from '../components/PropiedadesContent';
import PropertyTypesContent from '../components/PropertyTypesContent';
import ExpenseCategoriesContent from '../components/ExpenseCategoriesContent';
import PropertyOwnersContent from '../components/PropertyOwnersContent';
import ServiceTypesContent from '../components/ServiceTypesContent';
import ServiceExpensesContent from '../components/ServiceExpensesContent';
import ServicePaymentsContent from '../components/ServicePaymentsContent';
import RolesContent from '../components/RolesContent';
import ResourcesContent from '../components/ResourcesContent';
import ResourceBookingsContent from '../components/ResourceBookingsContent';
import NotFoundPage from './NotFoundPage';

interface Debt {
  code: string;
  amount: number;
}

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  module: string;
  icon: React.ReactNode;
  subItems?: MenuItem[];
}

const LandingPage: React.FC<{ token: string; onLogout: () => void }> = ({ token, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['expensas', 'propiedades', 'usuarios', 'servicios', 'recursos', 'reportes']));

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await fetch(ENDPOINTS.logout, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Proceed with local logout even if the request fails
    } finally {
      onLogout();
    }
  };
  const { userRoles } = useUserRole(token);

  const menuStructure: MenuItem[] = [
    {
      id: 'expensas',
      label: 'Expensas',
      module: 'expensas',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="4" y="4" width="10" height="10" rx="2" /></svg>,
      subItems: [
        { id: 'expensas-item', label: 'Expensas', path: '/expensas', module: 'expensas', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="3" y="3" width="10" height="10" rx="2" /></svg> },
        { id: 'pagos', label: 'Pagos de Expensas', path: '/pagos', module: 'pagos', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><circle cx="8" cy="8" r="6" /></svg> },
        { id: 'categorias', label: 'Categorías de Expensas', path: '/categorias-expensas', module: 'categorias-expensas', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="2" y="2" width="12" height="12" rx="2" /></svg> },
      ]
    },
    {
      id: 'propiedades',
      label: 'Propiedades',
      module: 'propiedades',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="3" y="7" width="12" height="8" rx="2" /><rect x="7" y="3" width="4" height="4" rx="1" /></svg>,
      subItems: [
        { id: 'propiedades-item', label: 'Propiedades', path: '/propiedades', module: 'propiedades', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="2" y="6" width="12" height="8" rx="2" /><rect x="6" y="2" width="4" height="4" rx="1" /></svg> },
        { id: 'tipo-propiedades', label: 'Tipo de Propiedad', path: '/tipo-propiedades', module: 'tipo-propiedades', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="3" width="14" height="10" rx="2" /></svg> },
      ]
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      module: 'usuarios',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="6" cy="8" r="3" /><circle cx="12" cy="8" r="3" /><rect x="3" y="13" width="12" height="3" rx="1.5" /></svg>,
      subItems: [
        { id: 'usuario', label: 'Usuario', path: '/usuario', module: 'usuario', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><circle cx="8" cy="6" r="3" /><rect x="4" y="11" width="8" height="3" rx="1.5" /></svg> },
        { id: 'usuarios-item', label: 'Usuarios', path: '/usuarios', module: 'usuarios', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><circle cx="5" cy="7" r="2.5" /><circle cx="11" cy="7" r="2.5" /><rect x="2" y="12" width="12" height="2" rx="1" /></svg> },
        { id: 'roles', label: 'Roles', path: '/roles', module: 'roles', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="5" width="14" height="8" rx="1" /><circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" /></svg> },
        { id: 'duenos', label: 'Gestión de Propietarios', path: '/duenos-propiedades', module: 'duenos-propiedades', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="3" width="14" height="10" rx="2" /><circle cx="5" cy="7" r="1" /><circle cx="11" cy="7" r="1" /></svg> },
      ]
    },
    {
      id: 'servicios',
      label: 'Servicios',
      module: 'servicios',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="3" width="14" height="12" rx="2" /><line x1="5" y1="7" x2="13" y2="7" stroke="rgb(244,228,69)" strokeWidth="1.5" /><line x1="5" y1="10" x2="11" y2="10" stroke="rgb(244,228,69)" strokeWidth="1.5" /></svg>,
      subItems: [
        { id: 'expensas-servicio', label: 'Expensas de Servicio', path: '/expensas-servicio', module: 'expensas-servicio', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="2" width="14" height="12" rx="2" /></svg> },
        { id: 'pagos-servicio', label: 'Pagos de Servicio', path: '/pagos-servicio', module: 'pagos-servicio', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="2" width="14" height="12" rx="2" /><circle cx="4" cy="7" r="1" /><circle cx="8" cy="7" r="1" /><circle cx="12" cy="7" r="1" /></svg> },
        { id: 'tipos-servicio', label: 'Tipos de Servicio', path: '/tipos-servicio', module: 'tipos-servicio', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="1" width="14" height="14" rx="2" /><circle cx="4" cy="4" r="1.5" /><circle cx="12" cy="4" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /></svg> },
      ]
    },
    {
      id: 'recursos',
      label: 'Recursos',
      module: 'recursos',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="2" width="14" height="14" rx="2" /><circle cx="9" cy="9" r="3" /></svg>,
      subItems: [
        { id: 'recursos-item', label: 'Recursos Compartidos', path: '/recursos', module: 'recursos', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="1" y="1" width="14" height="14" rx="2" /><circle cx="8" cy="8" r="2.5" /></svg> },
        { id: 'reservas', label: 'Reservas', path: '/reservas', module: 'reservas', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><rect x="2" y="3" width="12" height="11" rx="2" /><rect x="6" y="1" width="1.5" height="3" /><rect x="10" y="1" width="1.5" height="3" /></svg> },
      ]
    },
    {
      id: 'reportes',
      label: 'Reportes',
      module: 'reportes',
      icon: <svg width="18" height="18" fill="rgb(244,228,69)"><path d="M3 15h12M6 10h6M9 5h0" stroke="rgb(244,228,69)" strokeWidth="2"/></svg>,
      subItems: [
        { id: 'reportes-item', label: 'Reportes', path: '/reportes', module: 'reportes', icon: <svg width="16" height="16" fill="rgb(244,228,69)"><path d="M2 14h12M5 9h6M8 4h0" stroke="rgb(244,228,69)" strokeWidth="1.5"/></svg> },
      ]
    },
  ];

  const renderMenuItem = (item: MenuItem, isSubItem: boolean = false): React.ReactNode => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedGroups.has(item.id);

    if (!canViewModule(userRoles, item.module)) {
      return null;
    }

    if (isSubItem) {
      return (
        <li key={item.id} style={{ marginLeft: 12 }}>
          <Link
            to={item.path || '#'}
            className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
            style={{
              color: 'rgb(244,228,69)',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 8px',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        </li>
      );
    }

    return (
      <li key={item.id}>
        {hasSubItems ? (
          <button
            onClick={() => toggleGroup(item.id)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'rgb(244,228,69)',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 228, 69, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            {item.label}
            <span style={{ marginLeft: 'auto', fontSize: '12px', transition: 'transform 0.3s' }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
            style={{
              color: 'rgb(244,228,69)',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 8px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
            }}
          >
            <span style={{ marginRight: 8, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        )}
        {hasSubItems && isExpanded && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '500px', overflow: 'hidden', transition: 'all 0.3s' }}>
            {item.subItems!.map(subItem => renderMenuItem(subItem, true))}
          </ul>
        )}
      </li>
    );
  };
  const [debts, setDebts] = useState<Debt[]>([
    {
      code: 'P001',
      amount: 150.75
    }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  // const [announcements, setAnnouncements] = useState<string[]>([
  const [announcements] = useState<string[]>([
    'Corte de agua el viernes 10am',
    'Junta de condominio el sábado 5pm'
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINTS.property, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDebts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  return (
  <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', background: 'rgb(244,228,69)', color: 'rgb(244,228,69)' }}>
      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgb(68,68,68)',
            color: 'rgb(244,228,69)',
            borderRadius: 8,
            padding: '32px 28px',
            minWidth: 300,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 17, marginBottom: 24 }}>
              ¿Estás seguro de que deseas cerrar sesión?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={confirmLogout}
                style={{
                  background: 'rgb(244,228,69)',
                  color: 'rgb(68,68,68)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Sí, cerrar sesión
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  background: 'transparent',
                  color: 'rgb(244,228,69)',
                  border: '1px solid rgb(244,228,69)',
                  borderRadius: 4,
                  padding: '8px 24px',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1001,
          background: 'rgb(68,68,68)',
          border: 'none',
          fontSize: '22px',
          cursor: 'pointer',
          display: 'block',
          width: '40px',
          height: '40px',
          color: 'rgb(244,228,69)',
        }}
        className="hamburger-menu"
        aria-label="Toggle menu"
      >
        &#9776;
      </button>
      {/* Sidebar menu */}
      <nav
        style={{
          width: sidebarOpen ? 200 : 0,
          background: 'rgb(68,68,68)',
          color: 'rgb(244,228,69)',
          padding: sidebarOpen ? 20 : 0,
          overflow: 'hidden',
          transition: 'width 0.3s, padding 0.3s',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
        }}
        className="sidebar-menu"
      >
  <ul style={{ listStyle: 'none', padding: 0, marginTop: 60 }}>
          {canViewModule(userRoles, 'inicio') && (
            <li>
              <Link
                to="/"
                className={`sidebar-link${location.pathname === '/' ? ' active' : ''}`}
                style={{
                  color: 'rgb(244,228,69)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 8px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                }}
              >
                <span style={{ marginRight: 8, display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>
                  <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="9" cy="9" r="7" /></svg>
                </span>
                Inicio
              </Link>
            </li>
          )}
          {menuStructure.map(item => renderMenuItem(item, false))}
        </ul>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            marginTop: 24,
            width: '100%',
            background: 'transparent',
            border: '1px solid rgb(244,228,69)',
            color: 'rgb(244,228,69)',
            padding: '8px 12px',
            cursor: 'pointer',
            borderRadius: 4,
            fontSize: 14,
            textAlign: 'left',
          }}
        >
          <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
            <svg width="18" height="18" fill="none" stroke="rgb(244,228,69)" strokeWidth="2"><path d="M11 16H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6M15 12l3-3-3-3M18 9H8" /></svg>
          </span>
          Cerrar sesión
        </button>
      </nav>
      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 32,
          paddingLeft: sidebarOpen ? 32 : 80,
          marginLeft: sidebarOpen ? 200 : 0,
          marginTop: !sidebarOpen ? 56 : 0,
          transition: 'margin-left 0.3s, margin-top 0.3s, padding-left 0.3s',
          width: `calc(100vw - ${sidebarOpen ? 200 : 0}px)`,
          minHeight: '100vh',
          animation: 'fadeIn 0.5s',
          background: 'rgb(244,228,69)',
          color: 'rgb(68,68,68)',
          boxSizing: 'border-box',
        }}
      >
        {useRoutes([
          { path: '/', element: <InicioContent debts={debts} announcements={announcements} loading={loading} userRoles={userRoles} /> },
          { path: '/expensas', element: protectedElement(ExpensasContent, 'expensas', userRoles, { token }) },
          { path: '/reportes', element: protectedElement(ReportesContent, 'reportes', userRoles, { token }) },
          { path: '/pagos', element: protectedElement(PagosContent, 'pagos', userRoles, { token }) },
          { path: '/usuario', element: protectedElement(UsuarioContent, 'usuario', userRoles, { token }) },
          { path: '/usuarios', element: protectedElement(UsuariosContent, 'usuarios', userRoles, { token }) },
          { path: '/propiedades', element: protectedElement(PropiedadesContent, 'propiedades', userRoles, { token }) },
          { path: '/tipo-propiedades', element: protectedElement(PropertyTypesContent, 'tipo-propiedades', userRoles, { token }) },
          { path: '/categorias-expensas', element: protectedElement(ExpenseCategoriesContent, 'categorias-expensas', userRoles, { token }) },
          { path: '/duenos-propiedades', element: protectedElement(PropertyOwnersContent, 'duenos-propiedades', userRoles, { token }) },
          { path: '/tipos-servicio', element: protectedElement(ServiceTypesContent, 'tipos-servicio', userRoles, { token }) },
          { path: '/expensas-servicio', element: protectedElement(ServiceExpensesContent, 'expensas-servicio', userRoles, { token }) },
          { path: '/pagos-servicio', element: protectedElement(ServicePaymentsContent, 'pagos-servicio', userRoles, { token }) },
          { path: '/roles', element: protectedElement(RolesContent, 'roles', userRoles, { token }) },
          { path: '/recursos', element: protectedElement(ResourcesContent, 'recursos', userRoles, { token }) },
          { path: '/reservas', element: protectedElement(ResourceBookingsContent, 'reservas', userRoles, { token }) },
          { path: '*', element: <NotFoundPage /> },
        ])}
      </main>
      {/* Responsive styles */}
      <style>{`
        .sidebar-link {
          transition: background 0.2s, color 0.2s;
        }
        .sidebar-link:hover {
          background: rgb(244,228,69) !important;
          color: rgb(68,68,68) !important;
        }
        .sidebar-link.active {
          background: rgb(244,228,69) !important;
          color: rgb(68,68,68) !important;
        }
        .sidebar-menu {
          transition: width 0.4s cubic-bezier(.4,0,.2,1), padding 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hamburger-menu {
          font-size: 22px !important;
          width: 40px !important;
          height: 40px !important;
          background: rgb(68,68,68) !important;
          color: rgb(244,228,69) !important;
        }
        @media (max-width: 600px) {
          .sidebar-menu {
            width: ${sidebarOpen ? '70vw' : '0'} !important;
            padding: ${sidebarOpen ? '20px' : '0'} !important;
          }
          main {
            margin-left: 0 !important;
            padding-top: 60px !important;
            padding-left: 80px !important;
            width: 100vw !important;
          }
          .hamburger-menu {
            top: 10px !important;
            left: 10px !important;
            font-size: 28px !important;
            background: rgb(68,68,68) !important;
            color: rgb(244,228,69) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;