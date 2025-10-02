import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, RegisterData, LoginData } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (data: LoginData) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true);

  // Cargar usuarios y sesión al iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios desde Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando usuarios:', error);
        setUsers([]);
        return;
      }

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        email: user.email,
        nick: user.nick,
        password: user.password,
        skills: {
          velocidad: user.velocidad,
          disparo: user.disparo,
          calidad: user.calidad,
          resistencia: user.resistencia
        },
        createdAt: user.created_at
      }));

      setUsers(formattedUsers);
      console.log('Usuarios cargados desde Supabase:', formattedUsers.length);

      // Verificar sesión actual (sin localStorage)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Buscar el usuario en nuestra tabla
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userData && !userError) {
          const user: User = {
            id: userData.id,
            email: userData.email,
            nick: userData.nick,
            password: userData.password,
            skills: {
              velocidad: userData.velocidad,
              disparo: userData.disparo,
              calidad: userData.calidad,
              resistencia: userData.resistencia
            },
            createdAt: userData.created_at
          };
          setCurrentUser(user);
        }
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Registrando usuario:', data.email);

      // Verificar si el email ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email.toLowerCase())
        .single();

      if (existingUser) {
        alert('Este correo ya está registrado');
        return false;
      }

      // Verificar si el nick ya existe
      const { data: existingNick } = await supabase
        .from('users')
        .select('nick')
        .eq('nick', data.nick.toLowerCase())
        .single();

      if (existingNick) {
        alert('Este nick ya está en uso');
        return false;
      }

      // Crear usuario en Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email: data.email.toLowerCase(),
          nick: data.nick,
          password: data.password,
          velocidad: data.skills.velocidad,
          disparo: data.skills.disparo,
          calidad: data.skills.calidad,
          resistencia: data.skills.resistencia
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creando usuario:', userError);
        alert('Error al crear el perfil: ' + userError.message);
        return false;
      }

      console.log('Usuario creado en Supabase:', userData);

      // Actualizar lista de usuarios
      await loadInitialData();

      // Auto-login después del registro
      const newUser: User = {
        id: userData.id,
        email: userData.email,
        nick: userData.nick,
        password: userData.password,
        skills: {
          velocidad: userData.velocidad,
          disparo: userData.disparo,
          calidad: userData.calidad,
          resistencia: userData.resistencia
        },
        createdAt: userData.created_at
      };

      setCurrentUser(newUser);
      
      return true;

    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error inesperado al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Iniciando sesión:', data.email);

      // Buscar usuario en Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email.toLowerCase())
        .eq('password', data.password)
        .single();

      if (userError || !userData) {
        alert('Correo o contraseña incorrectos');
        return false;
      }

      console.log('Usuario encontrado:', userData);

      const user: User = {
        id: userData.id,
        email: userData.email,
        nick: userData.nick,
        password: userData.password,
        skills: {
          velocidad: userData.velocidad,
          disparo: userData.disparo,
          calidad: userData.calidad,
          resistencia: userData.resistencia
        },
        createdAt: userData.created_at
      };

      setCurrentUser(user);
      
      return true;

    } catch (error) {
      console.error('Error en login:', error);
      alert('Error inesperado al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      // No hay localStorage que limpiar
    } catch (error) {
      console.error('Error en logout:', error);
    }
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
