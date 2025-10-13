import React, { useEffect, useState } from 'react';
import { ENDPOINTS } from './api/endpoints';
import InicioContent from './components/InicioContent';
import ExpensasContent from './components/ExpensasContent';
import ReportesContent from './components/ReportesContent';
import PagosContent from './components/PagosContent';
import UsuarioContent from './components/UsuarioContent';
import UsuariosContent from './components/UsuariosContent';
import PropiedadesContent from './components/PropiedadesContent';

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
  const [selectedMenu, setSelectedMenu] = useState('Inicio');
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
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1001,
          background: 'transparent',
          border: 'none',
          fontSize: '22px',
          cursor: 'pointer',
          display: 'block',
          width: '40px',
          height: '40px',
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
          background: '#1976d2',
          color: '#fff',
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
          {['Inicio', 'Expensas', 'Reportes', 'Pagos', 'Usuario', 'Usuarios', 'Propiedades'].map(item => (
            <li
              key={item}
              style={{
                padding: '8px 0',
                fontWeight: selectedMenu === item ? 'bold' : 'normal',
                cursor: 'pointer',
                background: selectedMenu === item ? '#1565c0' : 'none',
                borderRadius: selectedMenu === item ? '4px' : '0',
                color: '#fff',
              }}
              onClick={() => { setSelectedMenu(item); setSidebarOpen(false); }}
            >
              {item}
            </li>
          ))}
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
          width: '100%',
        }}
      >
        {selectedMenu === 'Inicio' && (
          <InicioContent debts={debts} announcements={announcements} loading={loading} />
        )}
        {selectedMenu === 'Expensas' && <ExpensasContent />}
        {selectedMenu === 'Reportes' && <ReportesContent />}
        {selectedMenu === 'Pagos' && <PagosContent />}
        {selectedMenu === 'Usuario' && <UsuarioContent />}
        {selectedMenu === 'Usuarios' && <UsuariosContent />}
        {selectedMenu === 'Propiedades' && <PropiedadesContent />}
      </main>
      {/* Responsive styles */}
      <style>{`
        .hamburger-menu {
          font-size: 22px !important;
          width: 40px !important;
          height: 40px !important;
        }
        @media (max-width: 600px) {
          .sidebar-menu {
            width: ${sidebarOpen ? '70vw' : '0'} !important;
            padding: ${sidebarOpen ? '20px' : '0'} !important;
          }
          main {
            margin-left: 0 !important;
            padding-top: 60px !important;
          }
          .hamburger-menu {
            top: 10px !important;
            left: 10px !important;
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;