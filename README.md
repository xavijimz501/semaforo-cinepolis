# Estadístico y Alertamiento (Semáforo Cinépolis)

Panel web para la visualización de estadísticas, métricas y mapas de alertamiento.

## 🚀 Tecnologías

- **Frontend:** React 19 + TypeScript
- **Bundler:** Vite
- **Estilos:** Tailwind CSS v4
- **Visualización:** ECharts (`echarts-for-react`), MapLibre GL
- **Iconos:** Lucide React

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** (o gestor de paquetes de tu preferencia)

## ⚙️ Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crea o edita el archivo `.env` en la raíz:
   ```env
   VITE_API_URL="https://url-de-tu-api"
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor local de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza el compilado de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |
