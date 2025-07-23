// Sistema de audio para Puzzle Code
class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.effectVolume = 0.5;
        this.audioContext = null;
        this.synthSounds = {};
        
        this.init();
    }
    
    init() {
        // Cargar configuración de audio desde localStorage
        const savedMuted = localStorage.getItem('puzzleCodeMuted');
        const savedMusicVolume = localStorage.getItem('puzzleCodeMusicVolume');
        const savedEffectVolume = localStorage.getItem('puzzleCodeEffectVolume');
        
        this.isMuted = savedMuted === 'true';
        this.musicVolume = savedMusicVolume ? parseFloat(savedMusicVolume) : 0.3;
        this.effectVolume = savedEffectVolume ? parseFloat(savedEffectVolume) : 0.5;
        
        // Inicializar Web Audio Context
        this.initAudioContext();
        
        // Cargar sonidos
        this.loadSounds();
        
        // Crear controles de audio
        this.createAudioControls();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSynthSounds();
        } catch (error) {
            console.log('Web Audio API no disponible, usando fallback');
        }
    }
    
    createSynthSounds() {
        if (!this.audioContext) return;
        
        this.synthSounds = {
            click: () => this.createBeep(800, 0.1, 'sine'),
            dragStart: () => this.createBeep(600, 0.15, 'square'),
            dragDrop: () => this.createBeep(400, 0.2, 'triangle'),
            success: () => this.createChord([523, 659, 784], 0.5, 'sine'), // C major
            error: () => this.createBeep(200, 0.3, 'sawtooth'),
            star: () => this.createGlide(800, 1200, 0.3, 'sine'),
            levelComplete: () => this.createFanfare()
        };
    }
    
    createBeep(frequency, duration, waveType = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = waveType;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.effectVolume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createChord(frequencies, duration, waveType = 'sine') {
        if (!this.audioContext) return;
        
        frequencies.forEach(freq => {
            this.createBeep(freq, duration, waveType);
        });
    }
    
    createGlide(startFreq, endFreq, duration, waveType = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        oscillator.type = waveType;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.effectVolume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createFanfare() {
        if (!this.audioContext) return;
        
        // Secuencia de acordes para fanfare
        const chords = [
            [523, 659, 784], // C major
            [587, 740, 880], // D major  
            [659, 831, 988], // E major
            [523, 659, 784, 1047] // C major octave
        ];
        
        chords.forEach((chord, index) => {
            setTimeout(() => {
                this.createChord(chord, 0.4, 'sine');
            }, index * 150);
        });
    }
    
    loadSounds() {
        // Música de fondo
        this.backgroundMusic = new Audio('assets/audio/background-music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        
        // Lista de archivos de audio que deben existir
        const requiredSounds = {
            dragStart: 'assets/audio/drag-start.mp3',
            dragDrop: 'assets/audio/drag-drop.mp3',
            success: 'assets/audio/success.mp3',
            error: 'assets/audio/error.mp3',
            star: 'assets/audio/star.mp3',
            click: 'assets/audio/click.mp3',
            levelComplete: 'assets/audio/level-complete.mp3'
        };
        
        // Cargar solo archivos que existen
        this.sounds = {};
        Object.entries(requiredSounds).forEach(([name, path]) => {
            const audio = new Audio(path);
            audio.volume = this.effectVolume;
            
            // Manejar errores silenciosamente
            audio.addEventListener('error', () => {
                console.log(`Archivo de audio opcional no encontrado: ${name} (${path})`);
            });
            
            this.sounds[name] = audio;
        });
        
        // Manejar errores de música de fondo
        this.backgroundMusic.addEventListener('error', () => {
            console.log('Música de fondo no encontrada (assets/audio/background-music.mp3)');
        });
    }
    
    createAudioControls() {
        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';
        audioControls.innerHTML = `
            <div class="audio-panel">
                <button id="audio-toggle" class="audio-btn" title="Activar/Desactivar audio">
                    <i class="fas ${this.isMuted ? 'fa-volume-mute' : 'fa-volume-up'}"></i>
                </button>
                <div class="volume-controls" id="volume-controls">
                    <div class="volume-slider">
                        <label>Música:</label>
                        <input type="range" id="music-volume" min="0" max="1" step="0.1" value="${this.musicVolume}">
                    </div>
                    <div class="volume-slider">
                        <label>Efectos:</label>
                        <input type="range" id="effects-volume" min="0" max="1" step="0.1" value="${this.effectVolume}">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(audioControls);
        
        // Event listeners
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.toggleMute();
        });
        
        document.getElementById('music-volume').addEventListener('input', (e) => {
            this.setMusicVolume(parseFloat(e.target.value));
        });
        
        document.getElementById('effects-volume').addEventListener('input', (e) => {
            this.setEffectVolume(parseFloat(e.target.value));
        });
        
        // Mostrar/ocultar controles al hacer hover
        const audioPanel = audioControls.querySelector('.audio-panel');
        audioPanel.addEventListener('mouseenter', () => {
            document.getElementById('volume-controls').style.display = 'block';
        });
        
        audioPanel.addEventListener('mouseleave', () => {
            document.getElementById('volume-controls').style.display = 'none';
        });
    }
    
    playBackgroundMusic() {
        if (!this.isMuted && this.backgroundMusic) {
            this.backgroundMusic.play().catch(e => {
                console.log('Música de fondo no disponible, continuando sin música');
            });
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    playSound(soundName) {
        if (this.isMuted) return;
        
        // Intentar reproducir archivo de audio primero
        if (this.sounds[soundName]) {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.effectVolume;
            sound.play().catch(e => {
                console.log(`Archivo de audio no disponible, usando sonido sintético: ${soundName}`);
                this.playSynthSound(soundName);
            });
        } else {
            // Usar sonido sintético como fallback
            this.playSynthSound(soundName);
        }
    }
    
    playSynthSound(soundName) {
        if (!this.isMuted && this.synthSounds[soundName]) {
            try {
                // Resumir audio context si está suspendido
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.synthSounds[soundName]();
            } catch (error) {
                console.log(`No se pudo reproducir sonido sintético: ${soundName}`);
            }
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
            document.getElementById('audio-toggle').innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            this.playBackgroundMusic();
            document.getElementById('audio-toggle').innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        
        localStorage.setItem('puzzleCodeMuted', this.isMuted);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
        }
        localStorage.setItem('puzzleCodeMusicVolume', volume);
    }
    
    setEffectVolume(volume) {
        this.effectVolume = volume;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = volume;
        });
        localStorage.setItem('puzzleCodeEffectVolume', volume);
    }
    
    // Métodos para eventos específicos del juego
    onDragStart() {
        this.playSound('dragStart');
    }
    
    onDragDrop() {
        this.playSound('dragDrop');
    }
    
    onSuccess() {
        this.playSound('success');
    }
    
    onError() {
        this.playSound('error');
    }
    
    onStarEarned() {
        this.playSound('star');
    }
    
    onLevelComplete() {
        this.playSound('levelComplete');
    }
    
    onButtonClick() {
        this.playSound('click');
    }
}

// Instancia global del manager de audio
window.audioManager = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});
