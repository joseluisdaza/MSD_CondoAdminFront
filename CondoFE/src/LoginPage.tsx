import React, { useState } from 'react';
import { ENDPOINTS } from './api/endpoints';
import { t } from './i18n/resources';
import type { SupportedLang, LoginKey } from './i18n/resources';

const LoginPage: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<SupportedLang>('en');

  const getMessage = (label: LoginKey) => {
    return t(lang, 'login', label);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
  const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({ login, password }),
      });
      if (!response.ok) {
        // throw new Error(t(lang, 'login', 'errorInvalid'));
        throw new Error(getMessage('errorInvalid'));
      }
      const data = await response.json();
      // Assuming the token is in data.token
      onLogin(data.token || '');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t(lang, 'login', 'error'));
      } else {
        setError(t(lang, 'login', 'error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="lang">Language: </label>
        <select id="lang" value={lang} onChange={e => setLang(e.target.value as SupportedLang)}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <h2>{t(lang, 'login', 'title')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t(lang, 'login', 'username')}</label>
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <label>{t(lang, 'login', 'password')}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? t(lang, 'login', 'buttonLoading') : t(lang, 'login', 'button')}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
