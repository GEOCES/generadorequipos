import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// Obtén estas credenciales de https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://scaixkfkmdtjejdduoem.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYWl4a2ZrbWR0amVqZGR1b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNjQxNjEsImV4cCI6MjA3NDk0MDE2MX0.ieiMzqTSUv-4CwC2DFGlJzYK3eQP7UpJ31vQcJeKeAc';

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
