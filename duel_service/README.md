# Servicio de Duelos

Este servicio es responsable de manejar la lógica de los duelos en tiempo real entre estudiantes en CourseClash. Implementado en Go para maximizar la eficiencia en concurrencia y manejo de conexiones simultáneas.

## Tecnologías

- **Go**: Lenguaje de programación compilado y concurrente.
- **Gin/Echo**: Framework web para Go.
- **WebSockets**: Para comunicación en tiempo real.
- **MongoDB**: Base de datos NoSQL para almacenar datos de duelos y preguntas.

## Estructura del Proyecto

```
/duel_service
├── cmd/                      # Comandos y puntos de entrada
│   └── api/                  # Aplicación API
│       ├── main.go           # Punto de entrada principal
│       └── routes.go         # Definición de rutas
├── internal/                 # Código interno de la aplicación
│   ├── handlers/             # Manejadores de peticiones HTTP
│   │   └── duel_handler.go   # Manejador de duelos
│   ├── models/               # Definición de modelos de datos
│   │   └── duel.go           # Modelo de duelo
│   └── services/             # Lógica de negocio
│       └── duel_service.go   # Servicio de duelos
├── .gitignore                # Archivos a ignorar por git
└── go.mod                    # Definición de módulo y dependencias
```

## Características Principales

- Duelos en tiempo real entre estudiantes
- Sistema de preguntas y respuestas con temporizador
- Cálculo de puntuaciones y actualización de rangos
- Historial de duelos
- Matchmaking para emparejar estudiantes de nivel similar
- Soporte para múltiples duelos simultáneos

## Ventajas del Uso de Go

- **Eficiencia en Concurrencia**: Las goroutines de Go son extremadamente ligeras comparadas con los hilos tradicionales, permitiendo manejar miles de conexiones simultáneas con un uso mínimo de recursos.
- **Compilación Rápida**: Go se compila rápidamente, generando un binario ejecutable que puede correr en prácticamente cualquier sistema operativo.
- **Rendimiento**: Excelente rendimiento para aplicaciones con alta demanda de concurrencia, ideal para los duelos en tiempo real.

## Cómo Ejecutar

1. Asegúrate de tener Go instalado (versión 1.16+)

2. Instalar dependencias:
   ```bash
   go mod download
   ```

3. Compilar y ejecutar:
   ```bash
   go run cmd/api/main.go
   ```

4. O construir el binario:
   ```bash
   go build -o duel_service cmd/api/main.go
   ./duel_service
   ```

## Endpoints Principales

- `GET /api/duels`: Obtener lista de duelos disponibles o en curso
- `POST /api/duels`: Crear un nuevo duelo o solicitud de duelo
- `GET /api/duels/{duel_id}`: Obtener información de un duelo específico
- `GET /api/duels/history/{user_id}`: Obtener historial de duelos de un usuario
- `GET /api/duels/ranking`: Obtener ranking de duelos
- `WebSocket /ws/duels/{duel_id}`: Conexión WebSocket para participar en un duelo en tiempo real

## Flujo de un Duelo

1. Un estudiante solicita un duelo (puede ser aleatorio o contra un oponente específico)
2. El sistema empareja a los estudiantes según su rango
3. Ambos estudiantes se conectan al WebSocket del duelo
4. El sistema envía preguntas a ambos estudiantes simultáneamente
5. Los estudiantes responden dentro del tiempo límite
6. El sistema calcula puntuaciones basadas en respuestas correctas y tiempo de respuesta
7. Al finalizar todas las preguntas, se determina un ganador y se actualizan los rangos
8. Los resultados se almacenan en la base de datos
