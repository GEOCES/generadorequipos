import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AppWithAuth from './AppWithAuth';

type AuthView = 'login' | 'register';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  // Si está autenticado, mostrar la app principal
  if (isAuthenticated) {
    return <AppWithAuth />;
  }

  // Si no está autenticado, mostrar login o registro
  if (authView === 'login') {
    return (
      <Login
        onSuccess={() => {/* La app se actualiza automáticamente */}}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <Register
      onSuccess={() => {/* La app se actualiza automáticamente */}}
      onSwitchToLogin={() => setAuthView('login')}
    />
  );
};

export default App;
