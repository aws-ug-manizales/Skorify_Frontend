# Frontend Specification

## Scope

### Incluye

El desarrollo de la interfaz de usuario de **Skorify**, abarcando:

- Autenticación de usuarios (login, registro, recuperación de contraseña)
- Visualización de partidos del Mundial de Fútbol 2026
- Creación y gestión de predicciones
- Interfaz para participación en apuestas
- Visualización de resultados y estadísticas
- Perfil de usuario (historial, puntos, ranking, etc.)
- Navegación general de la aplicación (menús, rutas, flujo entre pantallas)
- Estados de la UI (loading, error, vacío)
- Diseño responsive (web y móvil)

---

### No incluye

- Lógica de negocio de apuestas
- Procesamiento de pagos o transacciones reales
- Integraciones con APIs externas (más allá de mocks o datos simulados)
- Backend o gestión de base de datos
- Sistema de autenticación real (solo interfaz)
- Seguridad avanzada o validaciones críticas

---

### Supuestos

- El backend proveerá endpoints claros y documentados
- Se utilizarán datos mock durante el desarrollo inicial
- El diseño puede iterar en función del feedback del equipo
- Las decisiones finales de UX/UI se tomarán de forma colaborativa

---

### Fuera de alcance (por ahora)

- Notificaciones en tiempo real
- Sistema de chat entre usuarios
- Funcionalidades sociales avanzadas (seguidores, feeds, etc.)
- Soporte offline

## Links importantes
- UX docs: /docs/ux
- UI system: /docs/ui

## Roles de usuario
- Usuario normal
- Admin

## Pantallas principales
- Resultado de partidos
- Tabla de puntuación de usuarios
- Predicciones
- Login
- Register
- Dashboard/Landing(?)

## Estados importantes
- Loading
- Error
- Empty state