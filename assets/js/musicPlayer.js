  // Reproductor de música con API de Audius
class MusicPlayer {
    constructor() {
        this.player = document.getElementById('player');
        this.playBtn = document.getElementById('playBtn');
        this.seekBar = document.getElementById('seekBar');
        this.current = document.getElementById('current');
        this.duration = document.getElementById('duration');
        
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isLoading = false;
        this.swiper = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadTrendingTracks();
        this.initSwiper();
        this.renderPlaylist();
    }

    setupEventListeners() {
        // Control de reproducción
        this.playBtn.addEventListener('click', () => {
            if (this.player.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        // Controles de navegación
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }

        // Control de volumen
        const volumeBar = document.getElementById('volumeBar');
        if (volumeBar) {
            volumeBar.addEventListener('input', () => {
                this.player.volume = volumeBar.value / 100;
            });
            this.player.volume = 0.7; // Volumen inicial
        }

        // Eventos del reproductor
        this.player.addEventListener('loadedmetadata', () => {
            this.seekBar.max = this.player.duration;
            this.duration.textContent = this.formatTime(this.player.duration);
        });

        this.player.addEventListener('timeupdate', () => {
            this.seekBar.value = this.player.currentTime;
            this.current.textContent = this.formatTime(this.player.currentTime);
            this.updateVisualizer();
        });

        this.player.addEventListener('ended', () => {
            this.nextTrack();
        });

        this.player.addEventListener('play', () => {
            // Mostrar indicador en Swiper
            const currentSlide = document.querySelector(`[data-index="${this.currentTrackIndex}"]`);
            if (currentSlide && !currentSlide.querySelector('.playing-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'playing-indicator';
                indicator.innerHTML = '🎵 REPRODUCIENDO';
                currentSlide.appendChild(indicator);
            }
        });

        this.player.addEventListener('pause', () => {
            // Ocultar indicadores
            document.querySelectorAll('.playing-indicator').forEach(indicator => {
                indicator.style.opacity = '0.5';
            });
        });

        // Manejar errores de carga
        this.player.addEventListener('error', (e) => {
            console.error('Error en el reproductor:', e);
            this.playBtn.textContent = "▶";
            this.playBtn.classList.remove('playing');
        });

        // Manejar interrupciones de carga
        this.player.addEventListener('abort', () => {
            console.log('Carga de audio interrumpida');
        });

        // Resetear estado cuando se puede reproducir
        this.player.addEventListener('canplay', () => {
            // Solo actualizar si no está en proceso de actualización
            if (!this.isUpdatingSwiper) {
                this.playBtn.disabled = false;
            }
        });

        // Control de la barra de progreso
        this.seekBar.addEventListener('input', () => {
            this.player.currentTime = this.seekBar.value;
        });

        // Búsqueda
        const searchInput = document.querySelector('input[placeholder="Buscar..."]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTracks(e.target.value);
            });
        }
    }

    async loadTrendingTracks() {
        try {
            this.isLoading = true;
            console.log('Cargando canciones trending...');
            
            // API de Audius para obtener canciones trending
            const response = await fetch('https://discoveryprovider.audius.co/v1/tracks/trending?limit=20');
            const data = await response.json();
            
            if (data && data.data) {
                this.playlist = data.data.map(track => ({
                    id: track.id,
                    title: track.title,
                    artist: track.user.name,
                    duration: track.duration,
                    artwork: track.artwork ? 
                        (track.artwork['480x480'] || track.artwork['150x150'] || 'https://via.placeholder.com/480') : 
                        'https://via.placeholder.com/480',
                    artworkLarge: track.artwork ? 
                        (track.artwork['1000x1000'] || track.artwork['480x480'] || track.artwork['150x150'] || 'https://via.placeholder.com/1000') : 
                        'https://via.placeholder.com/1000',
                    streamUrl: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`,
                    permalink: track.permalink
                }));

                console.log(`Cargadas ${this.playlist.length} canciones`);
                
                // Cargar la primera canción
                if (this.playlist.length > 0) {
                    this.loadTrack(0);
                }
            }
        } catch (error) {
            console.error('Error al cargar canciones:', error);
            // Usar canciones de fallback
            this.loadFallbackTracks();
        } finally {
            this.isLoading = false;
        }
    }

    loadFallbackTracks() {
        // Canciones de fallback en caso de que falle la API
        this.playlist = [
            {
                id: 'fallback1',
                title: 'SoundHelix Song 1',
                artist: 'SoundHelix',
                duration: 60,
                artwork: 'https://picsum.photos/150/150?random=1',
                streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            },
            {
                id: 'fallback2',
                title: 'SoundHelix Song 2',
                artist: 'SoundHelix',
                duration: 60,
                artwork: 'https://picsum.photos/150/150?random=2',
                streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
            },
            {
                id: 'fallback3',
                title: 'SoundHelix Song 3',
                artist: 'SoundHelix',
                duration: 60,
                artwork: 'https://picsum.photos/150/150?random=3',
                streamUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
            }
        ];

        if (this.playlist.length > 0) {
            this.loadTrack(0);
        }
    }

    initSwiper() {
        // Primero generar las slides con los datos actuales
        this.generateSwiperSlides();
        
        // Inicializar Swiper
        this.swiper = new Swiper(".album-swiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            loop: this.playlist.length > 3, // Solo loop si hay suficientes canciones
            speed: 800,
            slidesPerView: "auto",
            spaceBetween: 30,
            preventClicks: false,
            preventClicksPropagation: false,
            allowTouchMove: true,
            touchRatio: 1,
            touchAngle: 45,
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            on: {
                click: (swiper, event) => {
                    const clickedIndex = swiper.clickedIndex;
                    if (clickedIndex !== undefined && clickedIndex !== swiper.activeIndex) {
                        const realIndex = this.playlist.length > 3 ? swiper.realIndex : clickedIndex;
                        this.selectTrack(realIndex);
                    }
                },
                slideChangeTransitionEnd: (swiper) => {
                    // Solo cambiar canción si es un cambio manual del usuario
                    if (!this.isUpdatingSwiper && swiper.allowSlideNext) {
                        const realIndex = this.playlist.length > 3 ? swiper.realIndex : swiper.activeIndex;
                        if (realIndex !== this.currentTrackIndex) {
                            this.currentTrackIndex = realIndex;
                            this.loadTrack(this.currentTrackIndex);
                        }
                    }
                }
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
            },
        });
    }

    generateSwiperSlides() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (!swiperWrapper || this.playlist.length === 0) return;
        
        swiperWrapper.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="album-art-container" data-index="${index}">
                    <img src="${track.artworkLarge || track.artwork}" 
                         class="album-art" alt="${track.title}">
                    <div class="album-info">
                        <h4>${this.truncateText(track.title, 25)}</h4>
                        <p>${this.truncateText(track.artist, 20)}</p>
                    </div>
                    ${index === this.currentTrackIndex ? 
                        '<div class="playing-indicator">🎵 REPRODUCIENDO</div>' : ''}
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });
    }

    loadTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrackIndex = index;
            const track = this.playlist[index];
            
            // Pausar audio actual antes de cargar nuevo
            if (!this.player.paused) {
                this.player.pause();
            }
            
            // Actualizar reproductor con manejo de errores
            this.player.src = track.streamUrl;
            this.player.load(); // Forzar recarga
            
            // Actualizar información visual
            this.updateTrackInfo(track);
            
            // Actualizar Swiper
            this.updateSwiper();
            
            // Actualizar lista visual
            this.highlightCurrentTrack();
            
            console.log(`Cargando: ${track.title} - ${track.artist}`);
        }
    }

    selectTrack(index) {
        if (index === this.currentTrackIndex) return; // No hacer nada si es la misma canción
        
        this.isUpdatingSwiper = true;
        
        // Cargar nueva canción
        this.loadTrack(index);
        
        // Reproducir si había música reproduciéndose
        const wasPlaying = !this.player.paused;
        if (wasPlaying) {
            // Esperar a que se cargue antes de reproducir
            this.player.addEventListener('loadeddata', () => {
                this.play();
            }, { once: true });
        }
        
        this.isUpdatingSwiper = false;
    }

    updateTrackInfo(track) {
        // Actualizar título y artista
        const titleElement = document.querySelector('h3');
        const artistElement = document.querySelector('p.text-gray-300');
        
        if (titleElement) titleElement.textContent = track.title;
        if (artistElement) artistElement.textContent = track.artist;
        
        // Actualizar carátula pequeña del reproductor
        const currentTrackArt = document.getElementById('currentTrackArt');
        if (currentTrackArt) {
            currentTrackArt.src = track.artwork;
        }
    }

    updateSwiper() {
        if (!this.swiper) return;
        
        // Actualizar indicadores de reproducción
        document.querySelectorAll('.playing-indicator').forEach(indicator => {
            indicator.remove();
        });
        
        // Agregar indicador a la canción actual
        const currentSlide = document.querySelector(`[data-index="${this.currentTrackIndex}"]`);
        if (currentSlide) {
            const indicator = document.createElement('div');
            indicator.className = 'playing-indicator';
            indicator.innerHTML = '🎵 REPRODUCIENDO';
            currentSlide.appendChild(indicator);
        }
        
        // Mover swiper a la slide actual solo si es necesario
        const currentActiveIndex = this.playlist.length > 3 ? this.swiper.realIndex : this.swiper.activeIndex;
        if (currentActiveIndex !== this.currentTrackIndex) {
            this.isUpdatingSwiper = true;
            this.swiper.slideTo(this.currentTrackIndex);
            setTimeout(() => {
                this.isUpdatingSwiper = false;
            }, 300);
        }
    }

    async play() {
        if (this.player.src) {
            try {
                // Pausar cualquier reproducción anterior
                this.player.pause();
                
                // Esperar un momento antes de reproducir
                await new Promise(resolve => setTimeout(resolve, 100));
                
                await this.player.play();
                this.playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M7 6v8h2V6zm4 0v8h2V6z" />
                </svg>`;
                this.playBtn.classList.add('playing');
            } catch (error) {
                console.warn('Error al reproducir:', error);
                // Si falla, intentar una vez más después de un breve delay
                setTimeout(async () => {
                    try {
                        await this.player.play();
                        this.playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                            <path fill="currentColor" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M7 6v8h2V6zm4 0v8h2V6z" />
                        </svg>`;
                        this.playBtn.classList.add('playing');
                    } catch (retryError) {
                        console.error('Error definitivo al reproducir:', retryError);
                    }
                }, 500);
            }
        }
    }

    pause() {
        this.player.pause();
        this.playBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path fill="currentColor" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235" />
            </g>
        </svg>`;
        this.playBtn.classList.remove('playing');
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.selectTrack(nextIndex);
    }

    previousTrack() {
        const prevIndex = this.currentTrackIndex === 0 ? 
            this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.selectTrack(prevIndex);
    }

    renderPlaylist() {
        const listContainer = document.querySelector('ul.space-y-2');
        if (!listContainer || this.playlist.length === 0) return;
        
        listContainer.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors';
            listItem.dataset.index = index;
            
            listItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${track.artwork}" class="w-10 h-10 rounded-lg object-cover" loading="lazy">
                    <div>
                        <p class="text-sm font-medium">${this.truncateText(track.title, 20)}</p>
                        <span class="text-xs text-gray-300">${this.truncateText(track.artist, 15)}</span>
                    </div>
                </div>
                <span class="text-xs">${this.formatTime(track.duration)}</span>
            `;
            
            // Evento click para cambiar canción
            listItem.addEventListener('click', () => {
                this.loadTrack(index);
                this.play();
            });
            
            listContainer.appendChild(listItem);
        });
    }

    highlightCurrentTrack() {
        // Remover highlight anterior
        document.querySelectorAll('li[data-index]').forEach(item => {
            item.classList.remove('bg-blue-500/30', 'ring-1', 'ring-blue-400');
        });
        
        // Highlight canción actual
        const currentItem = document.querySelector(`li[data-index="${this.currentTrackIndex}"]`);
        if (currentItem) {
            currentItem.classList.add('bg-blue-500/30', 'ring-1', 'ring-blue-400');
        }
    }

    updateVisualizer() {
        // Actualizar visualizador simple
        const bars = document.querySelectorAll('.h-12 .w-1');
        bars.forEach((bar, index) => {
            const height = Math.random() * 40 + 10; // Altura aleatoria entre 10-50px
            bar.style.height = `${height}px`;
            bar.style.opacity = this.player.paused ? '0.3' : '1';
        });
    }

    async searchTracks(query) {
        if (query.length < 2) {
            this.renderPlaylist();
            return;
        }

        try {
            const response = await fetch(`https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();
            
            if (data && data.data) {
                const searchResults = data.data.map(track => ({
                    id: track.id,
                    title: track.title,
                    artist: track.user.name,
                    duration: track.duration,
                    artwork: track.artwork ? 
                        (track.artwork['480x480'] || track.artwork['150x150'] || 'https://via.placeholder.com/480') : 
                        'https://via.placeholder.com/480',
                    artworkLarge: track.artwork ? 
                        (track.artwork['1000x1000'] || track.artwork['480x480'] || track.artwork['150x150'] || 'https://via.placeholder.com/1000') : 
                        'https://via.placeholder.com/1000',
                    streamUrl: `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`,
                    permalink: track.permalink
                }));

                // Renderizar resultados de búsqueda
                this.renderSearchResults(searchResults);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }

    renderSearchResults(results) {
        const listContainer = document.querySelector('ul.space-y-2');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        if (results.length === 0) {
            listContainer.innerHTML = '<li class="text-center text-gray-400 py-4">No se encontraron resultados</li>';
            return;
        }
        
        results.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors';
            
            listItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${track.artwork}" class="w-10 h-10 rounded-lg object-cover" loading="lazy">
                    <div>
                        <p class="text-sm font-medium">${this.truncateText(track.title, 20)}</p>
                        <span class="text-xs text-gray-300">${this.truncateText(track.artist, 15)}</span>
                    </div>
                </div>
                <span class="text-xs">${this.formatTime(track.duration)}</span>
            `;
            
            listItem.addEventListener('click', () => {
                // Agregar a playlist y reproducir
                this.playlist.push(track);
                this.generateSwiperSlides(); // Regenerar slides
                if (this.swiper) {
                    this.swiper.update(); // Actualizar swiper
                }
                this.loadTrack(this.playlist.length - 1);
                this.play();
            });
            
            listContainer.appendChild(listItem);
        });
    }

    formatTime(sec) {
        if (!sec || sec === 0) return '0:00';
        let minutes = Math.floor(sec / 60);
        let seconds = Math.floor(sec % 60);
        if (seconds < 10) seconds = "0" + seconds;
        return `${minutes}:${seconds}`;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

// Inicializar reproductor cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
    
    // Agregar controles de teclado
    document.addEventListener('keydown', (e) => {
        if (window.musicPlayer) {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (window.musicPlayer.player.paused) {
                        window.musicPlayer.play();
                    } else {
                        window.musicPlayer.pause();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    window.musicPlayer.nextTrack();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    window.musicPlayer.previousTrack();
                    break;
            }
        }
    });
});

// Agregar estilos CSS adicionales
const additionalStyles = `
<style>
.playing {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.w-1 {
    transition: height 0.1s ease-in-out;
}

li[data-index] {
    transition: all 0.2s ease;
}

#seekBar::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fbbf24;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

#seekBar::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fbbf24;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.loading {
    opacity: 0.6;
    pointer-events: none;
}

/* Mejoras adicionales para Swiper */
.swiper-slide {
    cursor: pointer;
}

.swiper-slide:hover .album-art {
    filter: brightness(1.1);
}

.album-art {
    transition: filter 0.3s ease;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);