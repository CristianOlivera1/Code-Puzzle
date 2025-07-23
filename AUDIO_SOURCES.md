# 🎵 Sistema de Audio para Puzzle Code

## 📁 Archivos de Audio Necesarios

Coloca los siguientes archivos en la carpeta `assets/audio/`:

### 🎵 Música de Fondo
- **background-music.mp3** - Música principal del juego

### 🔊 Efectos de Sonido
- **drag-start.mp3** - Sonido al iniciar arrastre de código
- **drag-drop.mp3** - Sonido al soltar bloque de código
- **success.mp3** - Sonido de éxito al completar correctamente
- **error.mp3** - Sonido de error al fallar
- **star.mp3** - Sonido al ganar estrella
- **click.mp3** - Sonido de clic en botones
- **level-complete.mp3** - Sonido de nivel completado
- **typing.mp3** - Sonido de escritura (opcional)

## 🌐 Fuentes Recomendadas para Descargar Sonidos

### 1. **Freesound.org** (Gratis con registro)
- URL: https://freesound.org/
- **Recomendaciones específicas:**
  - Música de fondo: Buscar "chiptune", "game music", "ambient"
  - Drag start: "swoosh", "pickup", "select"
  - Drag drop: "place", "drop", "thud"
  - Success: "success", "achievement", "win"
  - Error: "error", "buzz", "fail"
  - Star: "chime", "ding", "reward"
  - Click: "click", "button", "ui"
  - Level complete: "fanfare", "victory", "complete"

### 2. **Zapsplat** (Gratis con registro)
- URL: https://www.zapsplat.com/
- **Categorías útiles:**
  - User Interface > Clicks and Buttons
  - Games > Retro Game Sounds
  - Games > Success and Achievement

### 3. **OpenGameArt.org** (Completamente gratis)
- URL: https://opengameart.org/
- **Secciones recomendadas:**
  - Music > Background Music
  - Sound Effect > Interface Sounds
  - Sound Effect > Game Sound Effects

### 4. **Pixabay Music** (Gratis)
- URL: https://pixabay.com/music/
- **Búsquedas sugeridas:**
  - "8-bit music" para música de fondo
  - "game sounds" para efectos

### 5. **YouTube Audio Library** (Gratis)
- URL: https://studio.youtube.com/channel/UC.../music
- **Filtros útiles:**
  - Genre: Electronic, Ambient
  - Mood: Happy, Uplifting para éxito
  - Duration: Short (0-2 min) para efectos

## 🎨 Características Recomendadas por Sonido

### 🎵 **background-music.mp3**
- **Duración:** 2-5 minutos (loop automático)
- **Estilo:** Chiptune, ambient, lo-fi
- **Tempo:** Moderado (no muy rápido para no distraer)
- **Volumen:** Suave, de fondo

### 🔊 **drag-start.mp3**
- **Duración:** 0.2-0.5 segundos
- **Estilo:** Swoosh suave, pickup digital
- **Tono:** Medio-alto, agradable

### 🔊 **drag-drop.mp3**
- **Duración:** 0.3-0.7 segundos
- **Estilo:** Drop suave, place, thud ligero
- **Tono:** Medio-bajo, satisfactorio

### ✅ **success.mp3**
- **Duración:** 1-2 segundos
- **Estilo:** Chime ascendente, ding alegre
- **Tono:** Alto, positivo

### ❌ **error.mp3**
- **Duración:** 0.5-1 segundo
- **Estilo:** Buzz corto, descending tone
- **Tono:** Bajo, pero no desagradable

### ⭐ **star.mp3**
- **Duración:** 0.5-1 segundo
- **Estilo:** Chime brillante, ding metálico
- **Tono:** Alto, cristalino

### 🖱️ **click.mp3**
- **Duración:** 0.1-0.3 segundos
- **Estilo:** Click suave, button press
- **Tono:** Medio, nítido

### 🏆 **level-complete.mp3**
- **Duración:** 2-4 segundos
- **Estilo:** Fanfare corto, victory jingle
- **Tono:** Ascendente, triunfal

## 📝 Instrucciones de Descarga

1. **Visita las fuentes recomendadas**
2. **Busca sonidos con las características mencionadas**
3. **Descarga en formato MP3** (preferible) o WAV
4. **Renombra los archivos** con los nombres exactos listados arriba
5. **Coloca en la carpeta** `assets/audio/`

## 🎛️ Configuración de Volumen

El sistema incluye controles automáticos de volumen:
- **Música de fondo:** 30% por defecto
- **Efectos de sonido:** 50% por defecto
- **Controles de usuario:** Deslizadores en la interfaz
- **Persistencia:** Se guardan las preferencias en localStorage

## 🔧 Características Técnicas

- **Formatos soportados:** MP3, WAV, OGG
- **Carga asíncrona:** Los sonidos no bloquean la interfaz
- **Manejo de errores:** Continúa funcionando si faltan archivos
- **Optimización:** Solo reproduce si el audio no está silenciado
- **Compatibilidad:** Funciona en todos los navegadores modernos

## 🎮 Eventos de Audio Integrados

- **Al arrastrar código:** drag-start.mp3
- **Al soltar código:** drag-drop.mp3
- **Solución correcta:** success.mp3 + level-complete.mp3
- **Por cada estrella:** star.mp3 (con delay de 300ms)
- **Solución incorrecta:** error.mp3
- **Clic en botones:** click.mp3
- **Música de fondo:** Se inicia automáticamente al seleccionar cualquier nivel de programación y se detiene al salir del juego

¡Con estos sonidos, tu juego de programación tendrá una experiencia audio completa y profesional! 🎵🎮
