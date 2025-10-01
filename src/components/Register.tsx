import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaTachometerAlt, FaCrosshairs, FaStar, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import type { UserSkills } from '../types/user';

interface RegisterProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    nick: '',
    password: ''
  });

  const [skills, setSkills] = useState<UserSkills>({
    velocidad: 5,
    disparo: 5,
    calidad: 5,
    resistencia: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.nick || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const success = register({
      email: formData.email,
      nick: formData.nick,
      password: formData.password,
      skills
    });

    if (success) {
      onSuccess();
    }
  };

  const handleSkillChange = (skill: keyof UserSkills, value: number) => {
    setSkills(prev => ({
      ...prev,
      [skill]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 via-grass-100 to-grass-200 flex items-center justify-center p-4">
      <div className="card p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaUser className="text-4xl text-grass-600" />
            <h1 className="text-3xl font-bold text-grass-800">Registro</h1>
          </div>
          <p className="text-field-600">Crea tu cuenta para empezar a jugar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos básicos */}
          <div className="space-y-4">
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
                <FaUser className="text-grass-600" />
                <span>Nick</span>
              </label>
              <input
                type="text"
                value={formData.nick}
                onChange={(e) => setFormData({ ...formData, nick: e.target.value })}
                className="input-field"
                placeholder="Tu nombre de jugador"
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
          </div>

          {/* Skills */}
          <div className="border-t border-field-200 pt-6">
            <h3 className="text-xl font-semibold text-grass-800 mb-4 flex items-center space-x-2">
              <FaStar className="text-grass-600" />
              <span>Tus Habilidades (1-10)</span>
            </h3>

            <div className="space-y-4">
              {/* Velocidad */}
              <div>
                <label className="flex items-center justify-between text-field-700 font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaRunning className="text-grass-600" />
                    <span>Velocidad</span>
                  </span>
                  <span className="text-2xl font-bold text-grass-600">{skills.velocidad}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skills.velocidad}
                  onChange={(e) => handleSkillChange('velocidad', parseInt(e.target.value))}
                  className="w-full h-2 bg-field-200 rounded-lg appearance-none cursor-pointer accent-grass-600"
                />
              </div>

              {/* Disparo */}
              <div>
                <label className="flex items-center justify-between text-field-700 font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaCrosshairs className="text-grass-600" />
                    <span>Disparo</span>
                  </span>
                  <span className="text-2xl font-bold text-grass-600">{skills.disparo}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skills.disparo}
                  onChange={(e) => handleSkillChange('disparo', parseInt(e.target.value))}
                  className="w-full h-2 bg-field-200 rounded-lg appearance-none cursor-pointer accent-grass-600"
                />
              </div>

              {/* Calidad */}
              <div>
                <label className="flex items-center justify-between text-field-700 font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaStar className="text-grass-600" />
                    <span>Calidad</span>
                  </span>
                  <span className="text-2xl font-bold text-grass-600">{skills.calidad}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skills.calidad}
                  onChange={(e) => handleSkillChange('calidad', parseInt(e.target.value))}
                  className="w-full h-2 bg-field-200 rounded-lg appearance-none cursor-pointer accent-grass-600"
                />
              </div>

              {/* Resistencia */}
              <div>
                <label className="flex items-center justify-between text-field-700 font-medium mb-2">
                  <span className="flex items-center space-x-2">
                    <FaTachometerAlt className="text-grass-600" />
                    <span>Resistencia</span>
                  </span>
                  <span className="text-2xl font-bold text-grass-600">{skills.resistencia}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skills.resistencia}
                  onChange={(e) => handleSkillChange('resistencia', parseInt(e.target.value))}
                  className="w-full h-2 bg-field-200 rounded-lg appearance-none cursor-pointer accent-grass-600"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3 pt-4">
            <button type="submit" className="btn-primary w-full py-3 text-lg">
              Registrarse
            </button>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="btn-secondary w-full py-3"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

