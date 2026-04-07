## User Flow - Flujo Principal (Happy Path)

```mermaid
flowchart TD
    A[Inicio] --> B[Login / Registro]
    B --> C[Dashboard]

    C --> D[Ver partidos]
    D --> E[Seleccionar partido]
    E --> F[Realizar predicción]

    F --> G{¿Todas las predicciones completas?}
    G -->|No| D
    G -->|Sí| H[Confirmar predicciones]

    H --> I[Dashboard]

    I --> J[Ver puntos acumulados]
    I --> K[Ver ranking]
    I --> L[Perfil]
    L --> I
```

## User Flow - Usuario Nuevo

```mermaid
flowchart TD
    A[Inicio] --> B[Registro]
    B --> C[Confirmación de cuenta]
    C --> D[Login]
    D --> E[Dashboard]
```
**NOTA**: Quizas saltarse la confirmación estaria bien, pero podria darse el caso de llenarnos de cuentas basura.

## User Flow - Usuario Recurrente

```mermaid
flowchart TD
    A[Inicio] --> B[Sesión activa]
    B --> C[Dashboard]
```

## User Flow - Errores

```mermaid
flowchart TD
    A[Login] -->|Credenciales incorrectas| B[Error]
    B --> A

    C[Crear predicción] -->|Datos inválidos| D[Error]
    D --> C

    E[Conexión API] -->|Falla| F[Estado de error]
    F --> G[Reintentar]
```

## Reglas clave
- Las predicciones no deberian poder alterarse llegado cierto momento, definir con el equipo de backend, el como se manejara esta excepción.
- Los puntos se calculan automaticamente despues de cada partido