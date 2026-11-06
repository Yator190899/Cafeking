# Mi Libreta Minera

Aplicación web integral para la gestión minera: control de gastos diarios y mensuales en soles peruanos (S/), bloc de notas con guardado automático, seguimiento de pedidos, recordatorios con alertas sonoras, calendario de operaciones y exportación a Excel (.xlsx).

## Requisitos
- Node.js (versión 18 o superior)
- npm o bun

## Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000` (o el puerto indicado en la consola).

3. **Construir para producción:**
   ```bash
   npm run build
   ```

## Características Principales
- **Inicio / Dashboard**: Resumen de gastos del mes, gastos del día en soles (S/), pedidos pendientes, recordatorios activos y últimos apuntes de guardia.
- **Bloc de Notas**: Cuaderno de campo con guardado automático, categorización por área minera y búsqueda rápida.
- **Control de Gastos**: Registro de compras con cálculo automático de totales, filtros por área/proveedor y exportación a Excel (.xlsx real) y CSV.
- **Gestión de Pedidos**: Seguimiento de despachos de insumos y botón de 1 clic para marcar como recibido.
- **Avisos y Recordatorios**: Programación de alertas con fecha y hora, notificaciones del navegador y avisos sonoros sintetizados.
- **Calendario de Operaciones**: Cronograma interactivo mensual con agenda diaria de gastos, pedidos y tareas.
- **Aplicación Instalable (PWA)**: Compatible con celulares Android (WebAPK), iPhone (Safari) y computadoras de escritorio.
- **Persistencia**: Firebase Firestore en tiempo real con soporte sin conexión (offline).
