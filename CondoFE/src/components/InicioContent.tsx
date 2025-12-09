import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationCard {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
  color: string;
}

const InicioContent: React.FC<{ debts: any[]; announcements: string[]; loading: boolean }> = ({ debts, announcements, loading }) => {
  const navigate = useNavigate();

  const navigationCards: NavigationCard[] = [
    // Sección de Expensas
    {
      title: 'Expensas',
      description: 'Administrar expensas regulares del condominio',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="8" y="8" width="16" height="16" rx="3" /></svg>,
      path: '/expensas',
      color: '#3498db'
    },
    {
      title: 'Pago de Expensas',
      description: 'Realizar pagos de expensas pendientes',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><circle cx="16" cy="16" r="12" /><text x="16" y="22" textAnchor="middle" fontSize="14" fill="rgb(68,68,68)">$</text></svg>,
      path: '/pagos',
      color: '#27ae60'
    },
    {
      title: 'Categorías de Expensas',
      description: 'Gestionar categorías de expensas',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="6" y="6" width="20" height="20" rx="3" /><line x1="12" y1="12" x2="20" y2="12" stroke="rgb(68,68,68)" strokeWidth="2" /><line x1="12" y1="18" x2="20" y2="18" stroke="rgb(68,68,68)" strokeWidth="2" /></svg>,
      path: '/categorias-expensas',
      color: '#2980b9'
    },
    
    // Sección de Servicios
    {
      title: 'Expensas de Servicio',
      description: 'Administrar expensas relacionadas con servicios',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="6" width="24" height="20" rx="3" /><line x1="8" y1="12" x2="22" y2="12" stroke="rgb(68,68,68)" strokeWidth="2" /><line x1="8" y1="18" x2="18" y2="18" stroke="rgb(68,68,68)" strokeWidth="2" /><circle cx="20" cy="10" r="3" /></svg>,
      path: '/expensas-servicio',
      color: '#e67e22'
    },
    {
      title: 'Pagos de Servicios',
      description: 'Gestionar pagos de servicios',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="6" width="24" height="20" rx="3" /><circle cx="8" cy="14" r="2" /><circle cx="16" cy="14" r="2" /><circle cx="24" cy="14" r="2" /><path d="M8 20h16v3H8z" /></svg>,
      path: '/pagos-servicio',
      color: '#f39c12'
    },
    {
      title: 'Tipos de Servicio',
      description: 'Configurar tipos de servicios disponibles',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="4" width="24" height="24" rx="3" /><circle cx="12" cy="12" r="3" /><circle cx="20" cy="12" r="3" /><circle cx="12" cy="20" r="3" /><circle cx="20" cy="20" r="3" /></svg>,
      path: '/tipos-servicio',
      color: '#d35400'
    },
    
    // Sección de Propiedades
    {
      title: 'Propiedades',
      description: 'Administrar propiedades del condominio',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="6" y="12" width="20" height="14" rx="3" /><rect x="12" y="6" width="8" height="8" rx="2" /></svg>,
      path: '/propiedades',
      color: '#9b59b6'
    },
    {
      title: 'Tipo de Propiedad',
      description: 'Configurar tipos de propiedades',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="8" width="24" height="16" rx="3" /><rect x="10" y="4" width="12" height="8" rx="2" /><circle cx="12" cy="14" r="2" /><circle cx="20" cy="14" r="2" /></svg>,
      path: '/tipo-propiedades',
      color: '#8e44ad'
    },
    
    // Sección de Usuarios
    {
      title: 'Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><circle cx="12" cy="14" r="5" /><circle cx="20" cy="14" r="5" /><rect x="6" y="22" width="20" height="5" rx="2.5" /></svg>,
      path: '/usuarios',
      color: '#e74c3c'
    },
    {
      title: 'Gestión de Propietarios',
      description: 'Administrar relación propietarios-propiedades',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="8" width="24" height="16" rx="3" /><circle cx="10" cy="14" r="2" /><circle cx="22" cy="14" r="2" /><path d="M16 19h6v3h-6z" /><path d="M8 19h4v3H8z" /></svg>,
      path: '/duenos-propiedades',
      color: '#c0392b'
    },
    {
      title: 'Roles',
      description: 'Configurar roles y permisos',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><rect x="4" y="10" width="24" height="14" rx="2" /><circle cx="10" cy="8" r="3" /><circle cx="22" cy="8" r="3" /></svg>,
      path: '/roles',
      color: '#34495e'
    },
    
    // Reportes
    {
      title: 'Reportes',
      description: 'Generar reportes y estadísticas',
      icon: <svg width="32" height="32" fill="rgb(244,228,69)"><path d="M6 26h20M10 18h10M16 10h0" stroke="rgb(244,228,69)" strokeWidth="3"/></svg>,
      path: '/reportes',
      color: '#16a085'
    }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '40px',
        textAlign: 'center',
        padding: '30px 0',
        borderBottom: '2px solid rgba(68,68,68,0.1)'
      }}>
        <h1 style={{ 
          color: 'rgb(68,68,68)', 
          marginBottom: '10px',
          fontSize: '2.5em',
          fontWeight: '300'
        }}>
          Sistema de Administración de Condominio
        </h1>
        <p style={{ 
          color: 'rgba(68,68,68,0.7)',
          fontSize: '1.2em',
          margin: 0
        }}>
          Selecciona una opción para comenzar
        </p>
      </div>

      {/* Quick Stats Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(231,76,60,0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>Deudas Pendientes</h3>
          {loading ? (
            <p style={{ margin: 0, fontSize: '1.5em' }}>Cargando...</p>
          ) : (
            <p style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>{debts.length}</p>
          )}
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #3498db, #2980b9)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(52,152,219,0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>Anuncios Activos</h3>
          <p style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>{announcements.length}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #27ae60, #229954)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(39,174,96,0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>Estado del Sistema</h3>
          <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold' }}>Operativo</p>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          color: 'rgb(68,68,68)', 
          marginBottom: '30px',
          fontSize: '1.8em',
          fontWeight: '400'
        }}>
          Módulos del Sistema
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {navigationCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(card.path)}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {/* Color accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: card.color
              }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: `${card.color}15`,
                  borderRadius: '8px',
                  flexShrink: 0
                }}>
                  {card.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: 'rgb(68,68,68)', 
                    margin: '0 0 8px 0',
                    fontSize: '1.2em',
                    fontWeight: '600'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(68,68,68,0.7)', 
                    margin: 0,
                    fontSize: '0.95em',
                    lineHeight: '1.4'
                  }}>
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      {(debts.length > 0 || announcements.length > 0) && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            color: 'rgb(68,68,68)', 
            marginBottom: '25px',
            fontSize: '1.8em',
            fontWeight: '400'
          }}>
            Actividad Reciente
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '20px' 
          }}>
            {debts.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: 'rgb(68,68,68)', 
                  margin: '0 0 15px 0',
                  fontSize: '1.3em',
                  fontWeight: '600'
                }}>
                  Deudas Pendientes
                </h3>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ color: 'rgba(68,68,68,0.6)' }}>Cargando...</div>
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {debts.slice(0, 5).map((debt, idx) => (
                      <div key={idx} style={{
                        padding: '12px 0',
                        borderBottom: idx < debts.slice(0, 5).length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'rgb(68,68,68)' }}>{debt.code}</span>
                        <span style={{ 
                          color: '#e74c3c', 
                          fontWeight: 'bold',
                          fontSize: '1.1em'
                        }}>
                          ${debt.amount || 'N/A'}
                        </span>
                      </div>
                    ))}
                    {debts.length > 5 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '10px 0',
                        color: 'rgba(68,68,68,0.6)',
                        fontSize: '0.9em'
                      }}>
                        +{debts.length - 5} más...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {announcements.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  color: 'rgb(68,68,68)', 
                  margin: '0 0 15px 0',
                  fontSize: '1.3em',
                  fontWeight: '600'
                }}>
                  Anuncios Recientes
                </h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {announcements.slice(0, 5).map((announcement, idx) => (
                    <div key={idx} style={{
                      padding: '12px 0',
                      borderBottom: idx < announcements.slice(0, 5).length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}>
                      <p style={{ 
                        margin: 0,
                        color: 'rgb(68,68,68)',
                        lineHeight: '1.4'
                      }}>
                        {announcement}
                      </p>
                    </div>
                  ))}
                  {announcements.length > 5 && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '10px 0',
                      color: 'rgba(68,68,68,0.6)',
                      fontSize: '0.9em'
                    }}>
                      +{announcements.length - 5} más...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InicioContent;
