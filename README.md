# ⚽ Generador de Equipos

Aplicación web para generar equipos de fútbol balanceados basándose en las habilidades de los jugadores.

## 🚀 Características

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con correo, nick y contraseña
- **Login** con validación de credenciales
- **Persistencia de sesión** mediante localStorage
- **Logout** con botón en el header

### 👥 Gestión de Jugadores
Los usuarios se registran con **4 habilidades** que van del 1 al 10:
- ⚡ **Velocidad** - Rapidez del jugador
- 🎯 **Disparo** - Precisión y potencia
- ⭐ **Calidad** - Técnica general
- 🏃 **Resistencia** - Aguante físico

### 🎲 Selección de Jugadores
- **Agregar usuarios registrados**: Selecciona de una lista desplegable que muestra sus habilidades
- **Agregar jugadores manuales**: Permite agregar nombres sin registro previo
- **Límite de 10 jugadores** para formar 2 equipos de 5
- **Prevención de duplicados** - No permite agregar el mismo jugador dos veces

### ⚖️ Algoritmo de Balanceo Inteligente
El sistema utiliza un **algoritmo avanzado** para crear equipos equilibrados:

1. **Cálculo de promedio**: Cada jugador tiene un promedio de sus 4 habilidades
2. **Ordenamiento**: Los jugadores se ordenan por habilidad (mayor a menor)
3. **Asignación greedy**: Se asigna cada jugador al equipo con menor promedio actual
4. **Optimización iterativa**: Hasta 50 iteraciones de intercambios para minimizar diferencias
5. **Shuffle interno**: Los jugadores se mezclan dentro de cada equipo para aleatoriedad visual

#### Ejemplo de balanceo:
```
Jugadores sin registro: promedio = 5.0 (valor por defecto)
Jugador A: Vel=8, Dis=7, Cal=9, Res=8 → Promedio: 8.0
Jugador B: Vel=6, Dis=5, Cal=7, Res=6 → Promedio: 6.0

Resultado: El algoritmo minimiza la diferencia entre los promedios finales de ambos equipos
```

### 📊 Visualización
- **Indicadores de skills** en la lista de jugadores seleccionados
- **Promedio por equipo** mostrado claramente
- **Colores diferenciados** (Rojo vs Azul)
- **Animaciones** al generar equipos

### 📥 Exportación
- **Descargar PDF**: Genera un archivo PDF profesional con los equipos
- **Descargar JPG**: Crea una imagen JPG de alta calidad

## 🛠️ Tecnologías Utilizadas

- ⚛️ **React 19.1.1** - Framework principal
- 📘 **TypeScript** - Tipado estático
- ⚡ **Vite 7.1.7** - Build tool y dev server
- 🎨 **Tailwind CSS 3.4.0** - Estilos y diseño
- 📄 **jsPDF 3.0.3** - Generación de PDFs
- 🖼️ **html2canvas 1.4.1** - Captura de pantalla
- 🎯 **React Icons 5.5.0** - Iconos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/GEOCES/generadorequipos.git

# Instalar dependencias
cd generadorequipos
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🎮 Uso

### 1. Registro
1. Accede a la aplicación
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Completa el formulario:
   - Correo electrónico
   - Nick (nombre de usuario)
   - Contraseña
   - Ajusta tus 4 habilidades con los sliders (1-10)
4. Haz clic en "Registrarse"

### 2. Selección de Jugadores
1. Selecciona usuarios registrados del dropdown
2. O agrega jugadores manualmente escribiendo su nombre
3. Continúa hasta tener 10 jugadores

### 3. Generación de Equipos
1. Haz clic en "Generar Equipos Balanceados"
2. Espera a que el algoritmo calcule los equipos óptimos
3. Visualiza los equipos con sus promedios

### 4. Exportación
1. Haz clic en el botón "PDF" o "JPG"
2. El archivo se descargará automáticamente

## 📂 Estructura del Proyecto

```
team-generator/
├── src/
│   ├── components/           # Componentes React
│   │   ├── Login.tsx        # Formulario de login
│   │   ├── Register.tsx     # Formulario de registro con skills
│   │   ├── ExportableTeams.tsx
│   │   └── TeamCapture.tsx
│   ├── contexts/            # Context API
│   │   └── AuthContext.tsx  # Gestión de autenticación
│   ├── hooks/               # Custom hooks
│   │   ├── useDirectExport.ts
│   │   ├── useExport.ts
│   │   └── useSimpleExport.ts
│   ├── types/               # Definiciones TypeScript
│   │   └── user.ts          # Tipos de usuario y skills
│   ├── utils/               # Utilidades
│   │   └── teamBalancer.ts  # Algoritmo de balanceo
│   ├── App.tsx              # Router de autenticación
│   ├── AppWithAuth.tsx      # Aplicación principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globales
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuración

### Colores Personalizados (Tailwind)
```javascript
// tailwind.config.js
colors: {
  'grass': {  // Verde césped
    50: '#f0f9f0',
    600: '#1f6b1f',
    // ...
  },
  'field': {  // Gris campo
    50: '#f8f9fa',
    800: '#3c4043',
    // ...
  }
}
```

### LocalStorage
El sistema utiliza dos claves en localStorage:
- `team_generator_users`: Array de usuarios registrados
- `team_generator_session`: Usuario actualmente logueado

## 🎯 Algoritmo de Balanceo - Detalles Técnicos

```typescript
// Pseudocódigo del algoritmo
function generateBalancedTeams(players) {
  // 1. Ordenar por habilidad
  sortedPlayers = sort(players, bySkillAverage, DESC)
  
  // 2. Asignación inicial
  for each player in sortedPlayers {
    assignToTeamWithLowerAverage(player)
  }
  
  // 3. Optimización por intercambios
  for i = 1 to 50 {
    for each pair (playerRed, playerBlue) {
      if swap reduces difference {
        swap(playerRed, playerBlue)
      }
    }
  }
  
  // 4. Shuffle visual
  shuffle(teamRed)
  shuffle(teamBlue)
  
  return [teamRed, teamBlue]
}
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### GitHub Pages
```bash
npm run build
# Configurar GitHub Pages apuntando a dist/
```

## 📝 Notas de Versión

### v2.0.0 - Sistema de Usuarios y Balanceo (Actual)
- ✨ Sistema completo de autenticación (registro/login/logout)
- ✨ Registro de usuarios con 4 habilidades personalizables
- ✨ Algoritmo de balanceo inteligente por skills
- ✨ Selector dual (usuarios registrados + manuales)
- ✨ Visualización de promedios por equipo
- ✨ Persistencia en localStorage

### v1.0.0 - Versión Inicial
- Generación aleatoria de equipos
- Exportación a PDF/JPG
- Diseño responsive

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**GEOCES**
- GitHub: [@GEOCES](https://github.com/GEOCES)
- Proyecto: [generadorequipos](https://github.com/GEOCES/generadorequipos)

## 🙏 Agradecimientos

- React Team por el framework
- Tailwind CSS por el sistema de diseño
- jsPDF por la generación de PDFs
- Comunidad open source

---

⚽ **¡Disfruta generando equipos balanceados!** ⚽
