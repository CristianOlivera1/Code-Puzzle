# Puzzle Code - Juego Educativo de Programación

**Puzzle Code** es una aplicación web educativa interactiva que permite a los usuarios aprender programación mediante el ensamblaje de líneas de código usando una interfaz de arrastrar y soltar (drag & drop).

<img width="1920" height="1080" alt="333shots_so" src="https://github.com/user-attachments/assets/3f70684f-14dd-49bb-a150-c53d25597041" />

## Diseño Figma [link](https://www.figma.com/design/3ysrfL0CqkApWlaFZhppkS/puzzle-code?t=Uy4LCO9aWnT1GO85-0)

## Modelo relacional de la Base de datos [link](https://dbdiagram.io/d/code-puzzle-6873d5c0f413ba3508a15e2f)

## 🚀 Características Principales

### 🎮 Sistema de Juego
- **Interfaz Dual**: Área de origen con líneas de código desordenadas y área de solución donde ensamblar el código
- **Drag & Drop Avanzado**: Mecánica intuitiva de arrastrar y soltar usando SortableJS
- **Sistema de Estrellas**: Calificación de 1-3 estrellas basada en el tiempo de resolución
- **Múltiples Lenguajes**: Soporte para C++, Java, Python, JavaScript y HTML
- **Niveles Progresivos**: Sistema de dificultad incremental

### 🎵 Sistema de Audio
- **Música de Fondo**: Reproducción automática durante el juego
- **Efectos de Sonido**: 
  - Sonidos de click, drag & drop
  - Efectos de éxito y error
  - Sonidos de estrellas y logros
  - Música de completación de nivel
- **Controles de Volumen**: Ajustes independientes para música y efectos
- **Configuración Persistente**: Preferencias guardadas en localStorage

### 🎭 Sistema de Personajes
- **Mascota Interactiva**: Personaje animado que guía al usuario
- **Expresiones Dinámicas**: 
  - Idle (reposo)
  - Celebrating (celebrando)
  - Thinking (pensando)
  - Sad (triste por errores)
  - Cheering (animando)
- **Personajes por Lenguaje**: Mascota específica para cada tecnología
- **Burbujas de Diálogo**: Mensajes contextuales y motivacionales
- **Efectos de Celebración**: 
  - Confeti para completar niveles
  - Fuegos artificiales para 3 estrellas
  - Destellos para 2 estrellas
  - Efectos de estrellas para 1 estrella

### 👤 Sistema de Usuarios
- **Autenticación Completa**: Registro, inicio de sesión y gestión de sesiones
- **Perfiles Personalizados**: 
  - Cambio de avatar con 6+ opciones disponibles
  - Visualización de estadísticas personales
  - Progreso por lenguaje de programación
  - Historial de logros recientes
- **Cambio de Contraseña**: Sistema seguro de actualización de credenciales
- **Exportación de Datos**: Descarga del progreso personal en formato JSON

### 🛠️ Panel de Administración
- **Gestión de Usuarios**: 
  - Visualización completa de usuarios registrados
  - Edición de información de usuarios
  - Eliminación de cuentas
  - Asignación de roles (Administrador/Usuario)
- **Gestión de Contenido**:
  - Creación y edición de niveles
  - Administración de lenguajes de programación
  - Configuración de dificultad y ayudas
- **Dashboard Estadístico**: 
  - Métricas de usuarios activos
  - Progreso general del sistema
  - Análisis de rendimiento

