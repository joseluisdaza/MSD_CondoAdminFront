import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'rgb(244, 228, 69)',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '60px 40px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'rgb(220, 53, 69)',
          margin: '0 0 20px 0',
        }}>
          ⛔
        </h1>
        
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'rgb(68, 68, 68)',
          margin: '0 0 16px 0',
        }}>
          Acceso Denegado
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'rgb(100, 100, 100)',
          margin: '0 0 32px 0',
          lineHeight: '1.6',
        }}>
          No tienes permisos para acceder a esta página. Por favor, contacta con el administrador si crees que es un error.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px',
            backgroundColor: 'rgb(68, 68, 68)',
            color: 'rgb(244, 228, 69)',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgb(100, 100, 100)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgb(68, 68, 68)';
          }}
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
