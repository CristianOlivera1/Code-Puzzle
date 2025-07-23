# Puzzle Code - Juego Educativo de Programación

**Puzzle Code** es una aplicación web educativa interactiva que permite a los usuarios aprender programación mediante el ensamblaje de líneas de código usando una interfaz de arrastrar y soltar (drag & drop).

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

## 🗄️ Base de Datos

### Estructura de Tablas
```sql
- Rol: Gestión de permisos (Administrador/Usuario)
- Usuario: Información personal y credenciales
- Lenguaje: Tecnologías de programación disponibles
- Nivel: Puzzles individuales con código y soluciones
- ProgresoUsuario: Registro de completación y puntuaciones
```

### Datos Iniciales
- **Usuario Administrador**: 
  - Email: admin@puzzlecode.com
  - Contraseña: password
- **Lenguajes Preconfigurados**: C++, Java, Python, JavaScript, HTML
- **Niveles de Ejemplo**: Puzzles básicos para cada lenguaje

## 🔧 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con efectos glassmorphism
- **JavaScript ES6+**: Funcionalidad interactiva y manejo del DOM
- **SortableJS**: Biblioteca para drag & drop
- **Font Awesome**: Iconografía profesional

### Backend
- **PHP 7.4+**: Lógica del servidor y APIs
- **MySQL**: Base de datos relacional
- **PDO**: Conexiones seguras a la base de datos
- **Arquitectura MVC**: Organización del código

### Herramientas de Desarrollo
- **XAMPP**: Entorno de desarrollo local
- **Apache**: Servidor web
- **Responsive Design**: Adaptable a dispositivos móviles

## 🏗️ Estructura del Proyecto

```
puzzle/
├── index.html                    # Página principal del juego
├── README.md                     # Documentación del proyecto
├── assets/                       # Recursos estáticos
│   ├── css/
│   │   ├── styles.css           # Estilos principales
│   │   ├── admin.css            # Estilos del panel admin
│   │   └── profile.css          # Estilos del perfil
│   ├── images/                  # Avatares e iconos
│   │   ├── default.png          # Avatar por defecto
│   │   ├── avatar1-5.png        # Avatares adicionales
│   │   └── [lenguajes].png      # Iconos de tecnologías
│   └── js/
│       ├── app.js               # Lógica principal del juego
│       ├── admin.js             # Funcionalidad del admin
│       └── profile.js           # Gestión de perfiles
├── pages/                       # Páginas adicionales
│   ├── admin.html               # Panel de administración
│   └── profile.html             # Página de perfil de usuario
└── php/                         # Backend PHP
    ├── config/
    │   ├── database.php         # Configuración de BD
    │   └── setup.sql            # Esquema y datos iniciales
    ├── controllers/             # Controladores MVC
    │   ├── auth.php             # Autenticación
    │   ├── game.php             # Lógica del juego
    │   ├── admin.php            # Operaciones admin
    │   └── profile.php          # Gestión de perfiles
    └── models/                  # Modelos de datos
        ├── Usuario.php          # Modelo de usuario
        ├── Nivel.php            # Modelo de nivel
        └── ProgresoUsuario.php  # Modelo de progreso
```

## ⚙️ Instalación y Configuración

### Prerrequisitos
- XAMPP (Apache + MySQL + PHP)
- Navegador web moderno
- Editor de texto/código

### Pasos de Instalación

1. **Clonar/Descargar el proyecto**
   ```bash
   # Colocar en la carpeta htdocs de XAMPP
   C:\xampp\htdocs\puzzle\
   ```

2. **Configurar Base de Datos**
   ```sql
   # Ejecutar setup.sql en phpMyAdmin
   # Crear base de datos 'puzzle_code'
   # Importar todas las tablas y datos
   ```

3. **Configurar Conexión**
   ```php
   # Verificar config/database.php
   # Ajustar credenciales si es necesario
   ```

4. **Iniciar Servicios**
   ```bash
   # Iniciar Apache y MySQL en XAMPP
   # Acceder a http://localhost/puzzle/
   ```

## 🎓 Uso del Sistema

### Para Estudiantes
1. **Registro**: Crear cuenta con email y contraseña
2. **Selección**: Elegir lenguaje y nivel de dificultad
3. **Resolución**: Arrastrar líneas de código al área de solución
4. **Evaluación**: Recibir calificación de 1-3 estrellas
5. **Progreso**: Seguir avance en el perfil personal

### Para Administradores
1. **Acceso**: Usar credenciales admin@puzzlecode.com / password
2. **Gestión**: Administrar usuarios, niveles y contenido
3. **Monitoreo**: Revisar estadísticas y rendimiento
4. **Mantenimiento**: Crear nuevos puzzles y actualizar sistema

## 🛡️ Seguridad

- **Validación de Entrada**: Sanitización de datos del usuario
- **Hashing de Contraseñas**: Almacenamiento seguro con password_hash()
- **Sesiones Seguras**: Gestión apropiada de autenticación
- **Validación de Roles**: Control de acceso basado en permisos
- **Escape de HTML**: Prevención de inyección XSS

---

**Desarrollado con ❤️ para la educación en programación**
```
puzzle/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── images/
├── php/
│   ├── config/
│   │   ├── database.php
│   │   └── setup.sql
│   ├── controllers/
│   │   ├── auth.php
│   │   └── game.php
│   └── models/
│       ├── Usuario.php
│       ├── Nivel.php
│       └── ProgresoUsuario.php
├── pages/
└── index.html
```

## Instalación y Configuración

### Prerrequisitos
- XAMPP (Apache + MySQL + PHP)
- Navegador web moderno

### Pasos de Instalación

1. **Configurar XAMPP**
   - Instala XAMPP en tu sistema
   - Inicia Apache y MySQL desde el panel de control de XAMPP

2. **Clonar/Descargar el Proyecto**
   ```bash
   # El proyecto debe estar en la carpeta htdocs de XAMPP
   c:\xampp\htdocs\puzzle\
   ```

3. **Configurar la Base de Datos**
   - Abre phpMyAdmin (http://localhost/phpmyadmin)
   - Ejecuta el script SQL ubicado en `php/config/setup.sql`
   - Esto creará la base de datos `puzzle` con todas las tablas necesarias

4. **Configurar Conexión a la Base de Datos**
   - Verifica la configuración en `php/config/database.php`
   - Ajusta los parámetros si es necesario:
     ```php
     private $host = 'localhost';
     private $db_name = 'puzzle';
     private $username = 'root';
     private $password = '';
     ```

5. **Acceder a la Aplicación**
   - Abre tu navegador web
   - Ve a: `http://localhost/puzzle`

## Estructura de la Base de Datos

### Tablas Principales
- **rol**: Roles de usuario (Administrador, Jugador)
- **Usuario**: Información de usuarios registrados
- **Lenguaje**: Lenguajes de programación disponibles
- **Nivel**: Niveles/desafíos de cada lenguaje
- **ProgresoUsuario**: Progreso y puntuaciones de cada usuario

## Funcionalidades

### Sistema de Usuarios
- Registro de nuevos usuarios
- Inicio y cierre de sesión
- Seguimiento del estado de conexión

### Mecánicas de Juego
- Selección de lenguaje de programación
- Visualización de niveles disponibles
- Arrastrar y soltar bloques de código
- Verificación automática de soluciones
- Sistema de puntuación por estrellas
- Cronómetro para cada nivel

### Sistema de Progreso
- Guardado automático del progreso
- Mejores tiempos por nivel
- Sistema de desbloqueo de niveles
- Estadísticas detalladas

## 🎯 Instalación de Assets Adicionales

### Audio Files
Los archivos de audio deben descargarse y colocarse en `assets/audio/`:
- `background-music.mp3` - Música de fondo principal
- `click.mp3` - Sonido de click en botones
- `drag-start.mp3` - Sonido al iniciar arrastre
- `drag-drop.mp3` - Sonido al soltar elemento
- `success.mp3` - Sonido de éxito
- `error.mp3` - Sonido de error
- `level-complete.mp3` - Música de nivel completado
- `star.mp3` - Sonido de estrella obtenida

Ver `AUDIO_SOURCES.md` para fuentes recomendadas de descarga.

### Character Assets
Los GIFs de personajes deben descargarse y organizarse en:

```
assets/characters/
├── mascot/
│   ├── idle.gif
│   ├── celebrating.gif
│   ├── thinking.gif
│   ├── sad.gif
│   └── cheering.gif
├── languages/
│   ├── javascript.gif
│   ├── python.gif
│   ├── java.gif
│   ├── cpp.gif
│   └── html.gif
└── effects/
    ├── confetti.gif
    ├── fireworks.gif
    ├── sparkles.gif
    └── stars.gif
```

Ver `CHARACTER_SYSTEM.md` para guía completa de implementación y fuentes de descarga.

## Personalización

### Agregar Nuevos Lenguajes
1. Inserta un nuevo registro en la tabla `Lenguaje`
2. Agrega la imagen correspondiente en `assets/images/`
3. Crea niveles para el nuevo lenguaje en la tabla `Nivel`

### Agregar Nuevos Niveles
```sql
INSERT INTO Nivel (idLenguaje, titulo, ayudaDescripcion, tiempoLimite, codigo, estado) 
VALUES (1, 'Nuevo Nivel', 'Descripción del objetivo', 300, 'código\ncorrecto\naquí', 0);
```

### Personalizar Estilos
- Modifica `assets/css/styles.css` para cambiar la apariencia
- Los colores principales están definidos como variables CSS
- Diseño responsive incluido para móviles

## API Endpoints

### Autenticación
- `POST /php/controllers/auth.php?action=login` - Iniciar sesión
- `POST /php/controllers/auth.php?action=register` - Registrar usuario
- `GET /php/controllers/auth.php?action=logout` - Cerrar sesión

### Juego
- `GET /php/controllers/game.php?action=obtener_niveles` - Obtener todos los niveles
- `GET /php/controllers/game.php?action=obtener_nivel&idNivel=X` - Obtener nivel específico
- `POST /php/controllers/game.php?action=verificar_solucion` - Verificar solución
- `GET /php/controllers/game.php?action=obtener_progreso` - Obtener progreso del usuario

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Soporte
Si tienes problemas o preguntas, por favor crea un issue en el repositorio del proyecto.

## Versión
v2.0.0 - Sistema completo con audio, personajes animados, y experiencia multimedia

---
Desarrollado con ❤️ para la educación en programación
