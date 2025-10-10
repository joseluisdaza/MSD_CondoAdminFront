
import { useState } from 'react';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';

function App() {
  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }
  return <LandingPage />;
}

export default App;
