# 🚀 Configuración de Supabase para Generador de Equipos

## 📋 Pasos para Configurar la Base de Datos

### 1. Crear Cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con GitHub (recomendado)
4. Crea un nuevo proyecto

### 2. Obtener Credenciales
1. En el dashboard de Supabase, ve a **Settings** → **API**
2. Copia:
   - **Project URL** (ej: `https://abcdefgh.supabase.co`)
   - **anon public** key (ej: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configurar Variables de Entorno
1. Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

2. En Vercel:
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega las dos variables

### 4. Crear Tabla de Usuarios
Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nick TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  velocidad INTEGER NOT NULL CHECK (velocidad >= 1 AND velocidad <= 10),
  disparo INTEGER NOT NULL CHECK (disparo >= 1 AND disparo <= 10),
  calidad INTEGER NOT NULL CHECK (calidad >= 1 AND calidad <= 10),
  resistencia INTEGER NOT NULL CHECK (resistencia >= 1 AND resistencia <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nick ON users(nick);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (para la lista de usuarios)
CREATE POLICY "Allow public read access" ON users
  FOR SELECT USING (true);

-- Política para permitir inserción (registro)
CREATE POLICY "Allow public insert" ON users
  FOR INSERT WITH CHECK (true);

-- Política para permitir actualización (solo el propio usuario)
CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);
```

### 5. Actualizar el Código
1. Actualiza `src/lib/supabase.ts` con tus credenciales:
```typescript
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-anon-key-aqui';
```

2. Cambia el import en `src/main.tsx`:
```typescript
// Cambiar de:
import { AuthProvider } from './contexts/AuthContext.tsx'

// A:
import { AuthProvider } from './contexts/AuthContextSupabase.tsx'
```

### 6. Desplegar
```bash
npm run build
git add .
git commit -m "feat: Integración con Supabase para persistencia global"
git push
```

## ✅ Verificación
1. Los usuarios se guardan globalmente
2. Cualquier usuario puede ver la lista de usuarios registrados
3. Los datos persisten entre sesiones
4. Funciona en producción (Vercel)

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Verifica que las credenciales estén correctas
- Asegúrate de usar la key "anon public", no la "service_role"

### Error: "relation 'users' does not exist"
- Ejecuta el SQL de creación de tabla
- Verifica que estés en el proyecto correcto

### Error: "permission denied"
- Verifica que las políticas RLS estén configuradas
- Asegúrate de que la tabla tenga los permisos correctos

## 📊 Beneficios de Supabase
- ✅ Base de datos PostgreSQL en la nube
- ✅ API REST automática
- ✅ Autenticación incluida
- ✅ 500MB gratis
- ✅ Escalable
- ✅ Real-time (opcional)
