import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const success = login({
      email: formData.email,
      password: formData.password
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 via-grass-100 to-grass-200 flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MdSportsSoccer className="text-5xl text-grass-600" />
            <h1 className="text-3xl font-bold text-grass-800">Bienvenido</h1>
          </div>
          <p className="text-field-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-field-700 font-medium mb-2">
              <FaEnvelope className="text-grass-600" />
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-field-700 font-medium mb-2">
              <FaLock className="text-grass-600" />
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <div className="space-y-3 pt-4">
            <button type="submit" className="btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2">
              <FaSignInAlt />
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="btn-secondary w-full py-3"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

