import React from 'react';

const InicioContent: React.FC<{ debts: any[]; announcements: string[]; loading: boolean }>
  = ({ debts, announcements, loading }) => (
  <>
    <h2>Deudas Pendientes</h2>
    {loading ? (
      <p>Cargando...</p>
    ) : (
      <ul>
        {debts.map((debt, idx) => (
          <li key={idx}>
            {debt.code}: ${debt.amount || 'N/A'}
          </li>
        ))}
      </ul>
    )}
    <h2>Anuncios</h2>
    <ul>
      {announcements.map((a, idx) => <li key={idx}>{a}</li>)}
    </ul>
  </>
);

export default InicioContent;
