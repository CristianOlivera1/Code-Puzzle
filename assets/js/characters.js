// Sistema de Gestión de Personajes Animados
class CharacterManager {
    constructor() {
        this.characterSprite = null;
        this.speechBubble = null;
        this.speechText = null;
        this.celebrationEffects = null;
        this.celebrationGif = null;
        
        this.expressions = {
            idle: 'assets/characters/mascot/idle.svg',
            celebrating: 'assets/characters/mascot/celebrating.svg',
            thinking: 'assets/characters/mascot/thinking.svg',
            sad: 'assets/characters/mascot/sad.svg',
            cheering: 'assets/characters/mascot/cheering.svg'
        };
        
        this.languageCharacters = {
            'JavaScript': 'assets/characters/languages/javascript-robot.svg',
            'Python': 'assets/characters/languages/python-snake.svg',
            'Java': 'assets/characters/languages/java-coffee.svg',
            'C++': 'assets/characters/languages/cpp-gear.svg',
            'HTML/CSS': 'assets/characters/languages/html-builder.svg'
        };
        
        this.effects = {
            confetti: 'assets/characters/effects/confetti.svg',
            fireworks: 'assets/characters/effects/fireworks.svg',
            sparkles: 'assets/characters/effects/sparkles.svg',
            starsFalling: 'assets/characters/effects/stars-falling.svg',
            successBurst: 'assets/characters/effects/success-burst.svg'
        };
        
        this.encouragements = [
            '¡Tú puedes hacerlo!',
            '¡Sigue programando!',
            '¡Eres un gran programador!',
            '¡La práctica hace al maestro!',
            '¡Cada error te hace más fuerte!',
            '¡Piensa como un programador!',
            '¡Nunca te rindas!',
            '¡El código es tu amigo!'
        ];
        
        this.hints = [
            '¿Has revisado el orden de las líneas?',
            'Recuerda la sintaxis del lenguaje',
            '¡Piensa en la lógica paso a paso!',
            'Cada línea tiene su lugar correcto',
            'Lee el código línea por línea',
            '¿Qué debería ejecutarse primero?',
            'Revisa la estructura del programa'
        ];
        
        this.init();
    }
    
    init() {
        this.createCharacterElements();
        this.setupEventListeners();
        
        // Mostrar el personaje automáticamente después de un breve delay
        setTimeout(() => {
            this.show();
            this.speak('¡Hola! Soy tu compañero de programación. ¡Vamos a aprender juntos!', 4000);
        }, 2000); // Aumenté el delay para asegurar que todo esté cargado
    }
    
    // Crear elementos HTML del personaje
    createCharacterElements() {
        // Usar elementos existentes del HTML si están disponibles
        this.characterContainer = document.getElementById('character-container');
        this.characterSprite = document.getElementById('character-sprite');
        this.speechBubble = document.getElementById('speech-bubble');
        this.speechText = document.getElementById('speech-text');
        this.celebrationEffects = document.getElementById('celebration-effects');
        this.celebrationGif = document.getElementById('celebration-gif');
        
        // Si no existen, crearlos dinámicamente
        if (!this.characterContainer) {
            this.createDynamicElements();
        } else {
            // Configurar elementos existentes
            if (this.characterSprite) {
                this.characterSprite.src = this.expressions.idle;
                this.characterSprite.alt = 'Mascota del juego';
                this.characterSprite.title = 'Haz clic para obtener ánimo';
            }
            if (this.speechText) {
                this.speechText.textContent = '¡Hola! ¿Listo para programar?';
            }
        }
    }
    
    // Crear elementos dinámicamente si no existen en HTML
    createDynamicElements() {
        // Contenedor principal del personaje
        const characterContainer = document.createElement('div');
        characterContainer.id = 'character-container';
        characterContainer.className = 'character-container';
        characterContainer.style.display = 'none';
        
        // Sprite del personaje
        const characterSprite = document.createElement('img');
        characterSprite.id = 'character-sprite';
        characterSprite.src = this.expressions.idle;
        characterSprite.alt = 'Mascota del juego';
        characterSprite.title = 'Haz clic para obtener ánimo';
        
        // Burbuja de diálogo
        const speechBubble = document.createElement('div');
        speechBubble.id = 'speech-bubble';
        speechBubble.className = 'speech-bubble';
        speechBubble.style.display = 'none';
        
        const speechText = document.createElement('p');
        speechText.id = 'speech-text';
        speechText.textContent = '¡Hola! ¿Listo para programar?';
        
        speechBubble.appendChild(speechText);
        characterContainer.appendChild(characterSprite);
        characterContainer.appendChild(speechBubble);
        
        // Efectos de celebración
        const celebrationEffects = document.createElement('div');
        celebrationEffects.id = 'celebration-effects';
        celebrationEffects.className = 'effects-overlay';
        celebrationEffects.style.display = 'none';
        
        const celebrationGif = document.createElement('img');
        celebrationGif.id = 'celebration-gif';
        celebrationGif.alt = 'Celebración';
        
        celebrationEffects.appendChild(celebrationGif);
        
        // Agregar al DOM
        document.body.appendChild(characterContainer);
        document.body.appendChild(celebrationEffects);
        
        // Guardar referencias
        this.characterSprite = characterSprite;
        this.speechBubble = speechBubble;
        this.speechText = speechText;
        this.celebrationEffects = celebrationEffects;
        this.celebrationGif = celebrationGif;
        this.characterContainer = characterContainer;
    }
    
    // Configurar event listeners
    setupEventListeners() {
        if (this.characterSprite) {
            this.characterSprite.addEventListener('click', () => {
                this.showRandomEncouragement();
            });
            
            // Manejar errores de carga de imágenes
            this.characterSprite.addEventListener('error', () => {
                console.warn('No se pudo cargar el sprite del personaje');
                this.characterSprite.style.display = 'none';
            });
        }
    }
    
    // Mostrar el personaje
    show() {
        if (this.characterContainer) {
            this.characterContainer.style.display = 'block';
        }
    }
    
    // Ocultar el personaje
    hide() {
        if (this.characterContainer) {
            this.characterContainer.style.display = 'none';
        }
        this.hideSpeech();
    }
    
    // Cambiar expresión del personaje
    changeExpression(expression, duration = 3000) {
        if (this.characterSprite && this.expressions[expression]) {
            this.characterSprite.src = this.expressions[expression];
            
            // Volver a idle después del tiempo especificado
            if (expression !== 'idle') {
                setTimeout(() => {
                    if (this.characterSprite) {
                        this.characterSprite.src = this.expressions.idle;
                    }
                }, duration);
            }
        }
    }
    
    // Mostrar mensaje con burbuja de diálogo
    speak(message, duration = 3000) {
        if (this.speechText && this.speechBubble) {
            this.speechText.textContent = message;
            this.speechBubble.style.display = 'block';
            
            setTimeout(() => {
                this.hideSpeech();
            }, duration);
        }
    }
    
    // Ocultar burbuja de diálogo
    hideSpeech() {
        if (this.speechBubble) {
            this.speechBubble.style.display = 'none';
        }
    }
    
    // Celebración al completar nivel
    celebrate(stars = 1) {
        this.changeExpression('celebrating', 5000);
        
        let message = '';
        let effect = '';
        
        switch(stars) {
            case 3:
                message = '¡Increíble! ¡Perfecto! 🎉';
                effect = this.effects.fireworks;
                break;
            case 2:
                message = '¡Muy bien! ¡Casi perfecto! ⭐';
                effect = this.effects.confetti;
                break;
            case 1:
                message = '¡Bien hecho! ¡Sigue así! 👍';
                effect = this.effects.sparkles;
                break;
            default:
                message = '¡Completaste el nivel!';
                effect = this.effects.successBurst;
        }
        
        this.speak(message, 4000);
        this.showEffect(effect, 3000);
    }
    
    // Mostrar efectos de celebración
    showEffect(effectSrc, duration = 2000) {
        if (this.celebrationGif && this.celebrationEffects) {
            this.celebrationGif.src = effectSrc;
            this.celebrationEffects.style.display = 'flex';
            
            setTimeout(() => {
                this.celebrationEffects.style.display = 'none';
            }, duration);
        }
    }
    
    // Reacción a error
    showError() {
        this.changeExpression('sad', 2000);
        const errorMessages = [
            '¡No te rindas! Inténtalo de nuevo 💪',
            '¡Los errores nos enseñan! 📚',
            '¡Cada intento te acerca al éxito! 🎯',
            '¡Revisa tu código una vez más! 🔍'
        ];
        const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        this.speak(randomMessage, 3000);
    }
    
    // Dar pista
    giveHint() {
        this.changeExpression('thinking', 3000);
        const randomHint = this.hints[Math.floor(Math.random() * this.hints.length)];
        this.speak(`💡 ${randomHint}`, 4000);
    }
    
    // Mensajes de ánimo aleatorios
    showRandomEncouragement() {
        this.changeExpression('cheering', 3000);
        const randomMsg = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
        this.speak(`🌟 ${randomMsg}`, 3000);
    }
    
    // Cambiar personaje según lenguaje
    setLanguageCharacter(language) {
        if (this.characterSprite && this.languageCharacters[language]) {
            this.characterSprite.src = this.languageCharacters[language];
        }
    }
    
    // Saludo inicial al comenzar un nivel
    welcomeToLevel(levelTitle) {
        this.show();
        this.changeExpression('cheering', 3000);
        this.speak(`¡Bienvenido al nivel: ${levelTitle}! 🚀`, 4000);
    }
    
    // Despedida al salir del juego
    goodbye() {
        this.changeExpression('cheering', 2000);
        this.speak('¡Hasta la próxima! 👋', 2000);
        
        setTimeout(() => {
            this.hide();
        }, 2500);
    }
    
    // Animación de entrada suave
    enterAnimation() {
        if (this.characterContainer) {
            this.characterContainer.style.transform = 'translateY(100px)';
            this.characterContainer.style.opacity = '0';
            this.show();
            
            setTimeout(() => {
                this.characterContainer.style.transition = 'all 0.5s ease';
                this.characterContainer.style.transform = 'translateY(0)';
                this.characterContainer.style.opacity = '1';
            }, 100);
        }
    }
    
    // Método alias para compatibilidad
    setExpression(expression, duration = 3000) {
        this.changeExpression(expression, duration);
    }
    
    // Método para mostrar mensaje
    showSpeech(message, duration = 3000) {
        this.speak(message, duration);
    }
    
    // Método para mostrar personaje específico de lenguaje
    showLanguageCharacter(language) {
        // Mapear nombres de lenguajes a los disponibles
        const languageMap = {
            'javascript': 'JavaScript',
            'python': 'Python', 
            'java': 'Java',
            'cpp': 'C++',
            'c++': 'C++',
            'html': 'HTML/CSS',
            'css': 'HTML/CSS'
        };
        
        const mappedLanguage = languageMap[language.toLowerCase()] || language;
        
        // Si existe un personaje específico para el lenguaje, intentar cargarlo
        if (this.languageCharacters[mappedLanguage]) {
            // Verificar si el archivo existe antes de cambiar
            const img = new Image();
            img.onload = () => {
                if (this.characterSprite) {
                    this.characterSprite.src = this.languageCharacters[mappedLanguage];
                }
            };
            img.onerror = () => {
                // Si no se puede cargar, usar expresión por defecto
                this.changeExpression('idle');
            };
            img.src = this.languageCharacters[mappedLanguage];
        } else {
            // Usar expresión por defecto si no hay personaje específico
            this.changeExpression('idle');
        }
    }
    
    // Método para inicializar (alias)
    initialize() {
        // Ya inicializado en constructor, pero disponible por compatibilidad
        this.show();
    }
}

// Variable global
window.characterManager = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.characterManager = new CharacterManager();
});
