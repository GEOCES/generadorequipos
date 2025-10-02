import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// Obtén estas credenciales de https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nick: string;
          password: string;
          velocidad: number;
          disparo: number;
          calidad: number;
          resistencia: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nick: string;
          password: string;
          velocidad: number;
          disparo: number;
          calidad: number;
          resistencia: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nick?: string;
          password?: string;
          velocidad?: number;
          disparo?: number;
          calidad?: number;
          resistencia?: number;
          created_at?: string;
        };
      };
    };
  };
}
