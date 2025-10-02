import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AppWithAuth from './AppWithAuth';

type AuthView = 'login' | 'register';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grass-50 via-grass-100 to-grass-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600 mx-auto mb-4"></div>
          <p className="text-grass-700">Cargando...</p>
        </div>
      </div>
    );
  }

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
