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
    // Cargar SOLO desde Supabase (sin localStorage)
    try {
      const supabaseUsers = await loadUsersFromSupabase();
      setUsers(supabaseUsers);
      console.log('Usuarios cargados desde Supabase:', supabaseUsers.length);
    } catch (error) {
      console.log('Supabase no disponible');
      setUsers([]);
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

    // Guardar SOLO en Supabase
    try {
      await syncUserToSupabase(newUser);
      console.log('Usuario guardado en Supabase');
      
      // Recargar usuarios desde Supabase
      const supabaseUsers = await loadUsersFromSupabase();
      setUsers(supabaseUsers);
      
      // Auto-login después del registro
      setCurrentUser(newUser);
    } catch (error) {
      console.log('Error guardando en Supabase:', error);
      alert('Error al guardar el usuario');
      return false;
    }

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
    // Sin localStorage - solo en memoria
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    // Sin localStorage que limpiar
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

