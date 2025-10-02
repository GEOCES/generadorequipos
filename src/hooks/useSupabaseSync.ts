import { supabase } from '../lib/supabase';
import type { User } from '../types/user';

export const useSupabaseSync = () => {
  // Sincronizar usuario con Supabase
  const syncUserToSupabase = async (user: User): Promise<boolean> => {
    try {
      console.log('Sincronizando usuario con Supabase:', user.email);
      
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          nick: user.nick,
          password: user.password,
          velocidad: user.skills.velocidad,
          disparo: user.skills.disparo,
          calidad: user.skills.calidad,
          resistencia: user.skills.resistencia,
          created_at: user.createdAt
        }, {
          onConflict: 'email'
        });

      if (error) {
        console.error('Error sincronizando usuario:', error);
        return false;
      }

      console.log('Usuario sincronizado exitosamente');
      return true;
    } catch (error) {
      console.error('Error en sincronización:', error);
      return false;
    }
  };

  // Cargar usuarios desde Supabase
  const loadUsersFromSupabase = async (): Promise<User[]> => {
    try {
      console.log('Cargando usuarios desde Supabase...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando usuarios:', error);
        return [];
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

      console.log('Usuarios cargados desde Supabase:', formattedUsers.length);
      return formattedUsers;
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      return [];
    }
  };

  return {
    syncUserToSupabase,
    loadUsersFromSupabase
  };
};
