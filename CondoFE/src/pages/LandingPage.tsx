import React, { useEffect, useState } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { Link, useLocation, useRoutes } from 'react-router-dom';
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

interface Debt {
  code: string;
  amount: number;
}

const LandingPage: React.FC<{ token: string }> = ({ token }) => {
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
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
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
          <li>
            <Link
              to="/"
              className={`sidebar-link${location.pathname === '/' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="9" cy="9" r="7" /></svg>
              </span>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/expensas"
              className={`sidebar-link${location.pathname === '/expensas' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="4" y="4" width="10" height="10" rx="2" /></svg>
              </span>
              Expensas
            </Link>
          </li>
          <li>
            <Link
              to="/reportes"
              className={`sidebar-link${location.pathname === '/reportes' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><path d="M3 15h12M6 10h6M9 5h0" stroke="rgb(244,228,69)" strokeWidth="2"/></svg>
              </span>
              Reportes
            </Link>
          </li>
          <li>
            <Link
              to="/pagos"
              className={`sidebar-link${location.pathname === '/pagos' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="9" cy="9" r="7" /><text x="9" y="13" textAnchor="middle" fontSize="10" fill="rgb(68,68,68)">$</text></svg>
              </span>
              Pago de Expensas
            </Link>
          </li>
          <li>
            <Link
              to="/usuario"
              className={`sidebar-link${location.pathname === '/usuario' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="9" cy="7" r="4" /><rect x="5" y="12" width="8" height="4" rx="2" /></svg>
              </span>
              Usuario
            </Link>
          </li>
          <li>
            <Link
              to="/usuarios"
              className={`sidebar-link${location.pathname === '/usuarios' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><circle cx="6" cy="8" r="3" /><circle cx="12" cy="8" r="3" /><rect x="3" y="13" width="12" height="3" rx="1.5" /></svg>
              </span>
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              to="/propiedades"
              className={`sidebar-link${location.pathname === '/propiedades' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="3" y="7" width="12" height="8" rx="2" /><rect x="7" y="3" width="4" height="4" rx="1" /></svg>
              </span>
              Propiedades
            </Link>
          </li>
          <li>
            <Link
              to="/tipo-propiedades"
              className={`sidebar-link${location.pathname === '/tipo-propiedades' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="4" width="14" height="10" rx="2" /><rect x="6" y="2" width="6" height="4" rx="1" /><circle cx="7" cy="8" r="1" /><circle cx="11" cy="8" r="1" /></svg>
              </span>
              Tipo de Propiedad
            </Link>
          </li>
          <li>
            <Link
              to="/categorias-expensas"
              className={`sidebar-link${location.pathname === '/categorias-expensas' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="3" y="3" width="12" height="12" rx="2" /><line x1="7" y1="7" x2="11" y2="7" stroke="rgb(68,68,68)" strokeWidth="2" /><line x1="7" y1="10" x2="11" y2="10" stroke="rgb(68,68,68)" strokeWidth="2" /></svg>
              </span>
              Categorías de expensas
            </Link>
          </li>
          <li>
            <Link
              to="/duenos-propiedades"
              className={`sidebar-link${location.pathname === '/duenos-propiedades' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="4" width="14" height="10" rx="2" /><circle cx="6" cy="8" r="1.5" /><circle cx="12" cy="8" r="1.5" /><path d="M9 11h4v2H9z" /><path d="M5 11h2v2H5z" /></svg>
              </span>
              Gestión de Propietarios
            </Link>
          </li>
          <li>
            <Link
              to="/tipos-servicio"
              className={`sidebar-link${location.pathname === '/tipos-servicio' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="2" width="14" height="14" rx="2" /><circle cx="6" cy="6" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /></svg>
              </span>
              Tipos de Servicio
            </Link>
          </li>
          <li>
            <Link
              to="/expensas-servicio"
              className={`sidebar-link${location.pathname === '/expensas-servicio' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="3" width="14" height="12" rx="2" /><line x1="5" y1="7" x2="13" y2="7" stroke="rgb(68,68,68)" strokeWidth="1.5" /><line x1="5" y1="10" x2="11" y2="10" stroke="rgb(68,68,68)" strokeWidth="1.5" /><circle cx="12" cy="6" r="2" /></svg>
              </span>
              Expensas de Servicio
            </Link>
          </li>
          <li>
            <Link
              to="/pagos-servicio"
              className={`sidebar-link${location.pathname === '/pagos-servicio' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="3" width="14" height="12" rx="2" /><circle cx="5" cy="8" r="1.5" /><circle cx="9" cy="8" r="1.5" /><circle cx="13" cy="8" r="1.5" /><path d="M5 11h8v2H5z" /></svg>
              </span>
              Pagos de Servicio
            </Link>
          </li>
          <li>
            <Link
              to="/roles"
              className={`sidebar-link${location.pathname === '/roles' ? ' active' : ''}`}
              style={{ color: 'rgb(244,228,69)' }}
            >
              <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <svg width="18" height="18" fill="rgb(244,228,69)"><rect x="2" y="6" width="14" height="8" rx="1" /><circle cx="6" cy="4" r="2" /><circle cx="12" cy="4" r="2" /></svg>
              </span>
              Roles
            </Link>
          </li>
        </ul>
      </nav>
      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 32,
          marginLeft: sidebarOpen ? 200 : 0,
          marginTop: !sidebarOpen ? 56 : 0,
          transition: 'margin-left 0.3s, margin-top 0.3s',
          width: `calc(100vw - ${sidebarOpen ? 200 : 0}px)`,
          minHeight: '100vh',
          animation: 'fadeIn 0.5s',
          background: 'rgb(244,228,69)',
          color: 'rgb(68,68,68)',
          boxSizing: 'border-box',
        }}
      >
        {useRoutes([
          { path: '/', element: <InicioContent debts={debts} announcements={announcements} loading={loading} /> },
          { path: '/expensas', element: <ExpensasContent token={token} /> },
          { path: '/reportes', element: <ReportesContent /> },
          { path: '/pagos', element: <PagosContent token={token} /> },
          { path: '/usuario', element: <UsuarioContent token={token} /> },
          { path: '/usuarios', element: <UsuariosContent token={token} /> },
          { path: '/propiedades', element: <PropiedadesContent token={token} /> },
          { path: '/tipo-propiedades', element: <PropertyTypesContent token={token} /> },
          { path: '/categorias-expensas', element: <ExpenseCategoriesContent token={token} /> },
          { path: '/duenos-propiedades', element: <PropertyOwnersContent token={token} /> },
          { path: '/tipos-servicio', element: <ServiceTypesContent token={token} /> },
          { path: '/expensas-servicio', element: <ServiceExpensesContent token={token} /> },
          { path: '/pagos-servicio', element: <ServicePaymentsContent token={token} /> },
          { path: '/roles', element: <RolesContent token={token} /> },
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