import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RegisterData, LoginData } from '../types/user';
import { useSupabaseSync } from '../hooks/useSupabaseSync';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (data: LoginData) => boolean;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading] = useState(false);
  const { syncUserToSupabase, loadUsersFromSupabase } = useSupabaseSync();

  // Cargar usuarios y sesión al iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Cargar desde localStorage primero
    const storedUsers = localStorage.getItem('team_generator_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedSession = localStorage.getItem('team_generator_session');
    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      setCurrentUser(sessionUser);
    }

    // Intentar cargar desde Supabase como backup
    try {
      const supabaseUsers = await loadUsersFromSupabase();
      if (supabaseUsers.length > 0) {
        setUsers(supabaseUsers);
        localStorage.setItem('team_generator_users', JSON.stringify(supabaseUsers));
      }
    } catch (error) {
      console.log('Supabase no disponible, usando localStorage');
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Verificar si el email ya existe
    const emailExists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (emailExists) {
      alert('Este correo ya está registrado');
      return false;
    }

    // Verificar si el nick ya existe
    const nickExists = users.some(u => u.nick.toLowerCase() === data.nick.toLowerCase());
    if (nickExists) {
      alert('Este nick ya está en uso');
      return false;
    }

    // Crear nuevo usuario con UUID
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      nick: data.nick,
      password: data.password,
      skills: data.skills,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('team_generator_users', JSON.stringify(updatedUsers));

    // Intentar sincronizar con Supabase
    try {
      await syncUserToSupabase(newUser);
    } catch (error) {
      console.log('No se pudo sincronizar con Supabase, pero el usuario se guardó localmente');
    }

    // Auto-login después del registro
    setCurrentUser(newUser);
    localStorage.setItem('team_generator_session', JSON.stringify(newUser));

    return true;
  };

  const login = (data: LoginData): boolean => {
    const user = users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
    );

    if (!user) {
      alert('Correo o contraseña incorrectos');
      return false;
    }

    setCurrentUser(user);
    localStorage.setItem('team_generator_session', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('team_generator_session');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        isAuthenticated: currentUser !== null,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

