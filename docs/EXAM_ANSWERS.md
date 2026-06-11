# Respuestas a la Evaluación Técnica

## 1. ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

*   **Persistencia Asíncrona en Aplicación Híbrida**: Al migrar de `localStorage` (síncrono) a `@capacitor/preferences` (asíncrono), fue necesario refactorizar la lógica de inicialización del `AuthService` para manejar promesas. Esto garantizó una mayor seguridad al usar el Keychain/Keystore nativo, pero introdujo complejidad en el ciclo de vida de la aplicación.
*   **Gestión de Estado con Signals**: Integrar la reactividad de los Angular Signals con flujos asíncronos de Firebase requirió un diseño cuidadoso para evitar condiciones de carrera, especialmente al implementar el filtrado dinámico de tareas por categorías.
*   **Seguridad y Auditoría**: Identificar y corregir puntos de inyección XSS y asegurar que el estado global de la aplicación se purgara completamente al hacer logout (evitando que un usuario vea datos de otro en la caché de las Signals).

## 2. ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

*   **Angular Signals**: Se utilizó el nuevo sistema de reactividad de Angular para lograr una detección de cambios granular. Esto evita que toda la aplicación se vuelva a renderizar cuando solo cambia una tarea, minimizando el uso de CPU y mejorando la fluidez de la UI.
*   **Lazy Loading Modular**: Todos los componentes de las funcionalidades (Login, Tasks, Categories) se cargan de forma perezosa (`loadComponent`), reduciendo drásticamente el tamaño del bundle inicial y el tiempo de carga del primer despliegue.
*   **RxJS `finalize()` y Gestión de Memoria**: Se implementó el operador `finalize` en las peticiones críticas para asegurar la correcta limpieza de estados de carga (loaders) y se utilizó el patrón de servicios con métodos `clearState` para liberar memoria al cerrar sesión.
*   **Zone.js Optimization**: Se habilitó la coalescencia de eventos en `app.config.ts` para agrupar múltiples micro-tareas en un solo ciclo de detección de cambios, optimizando el rendimiento en dispositivos móviles de gama media/baja.

## 3. ¿Cómo aseguraste la calidad y mantenibilidad del código?

*   **Clean Architecture**: Se aplicó una separación estricta en capas (Core, Data, Presentation). El dominio no conoce la infraestructura; se utilizan repositorios abstractos (Ports), lo que permite cambiar de Firebase a una API REST sin tocar la lógica de negocio.
*   **Desacoplamiento de Plantillas**: Se extrajeron las plantillas HTML y los estilos SCSS de los componentes modales hacia archivos independientes, siguiendo el principio de responsabilidad única y facilitando la depuración visual.
*   **Pruebas Unitarias con Vitest**: Se configuró un entorno de pruebas moderno con Vitest para validar los servicios críticos, asegurando que la lógica de autenticación y gestión de tareas sea robusta ante cambios futuros.
*   **Gitflow y Versionamiento Semántico**: Se mantuvo un historial de commits organizado y se utilizaron etiquetas de versión (tags) para marcar hitos estables de la aplicación.
