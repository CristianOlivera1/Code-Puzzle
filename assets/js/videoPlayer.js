// Reproductor de videos con API de Pexels
class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('videoPlayer');
        this.videoContainer = document.getElementById('videoContainer');
        this.playBtn = document.getElementById('playVideoBtn');
        this.seekBar = document.getElementById('videoSeekBar');
        this.currentTime = document.getElementById('currentTime');
        this.totalDuration = document.getElementById('totalDuration');
        this.volumeBar = document.getElementById('volumeBar');
        this.muteBtn = document.getElementById('muteBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.videoList = document.getElementById('videoList');
        this.searchInput = document.getElementById('searchInput');
        
        this.apiKey = '2COOjZTvKPlnCwvNhFnuYlAkcPA8zsETz798QZO1kMiIyfTwAKtm5HDQ';
        this.videos = [];
        this.currentVideoIndex = 0;
        this.currentQuality = 'hd';
        this.isLoading = false;
        this.controlsTimer = null;
        this.isMouseMoving = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadPopularVideos();
        this.renderVideoList();
    }

    setupEventListeners() {
        // Controles de reproducción
        this.playBtn.addEventListener('click', () => this.togglePlay());
        document.getElementById('prevVideoBtn').addEventListener('click', () => this.previousVideo());
        document.getElementById('nextVideoBtn').addEventListener('click', () => this.nextVideo());

        // Click en video para pausar/reproducir
        this.videoElement.addEventListener('click', () => this.togglePlay());

        // Controles de video
        this.videoElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.videoElement.addEventListener('timeupdate', () => this.updateProgress());
        this.videoElement.addEventListener('ended', () => this.nextVideo());
        this.videoElement.addEventListener('play', () => this.onPlay());
        this.videoElement.addEventListener('pause', () => this.onPause());

        // Seek bar
        this.seekBar.addEventListener('input', () => this.seek());

        // Volumen
        this.volumeBar.addEventListener('input', () => this.updateVolume());
        this.muteBtn.addEventListener('click', () => this.toggleMute());

        // Pantalla completa
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Búsqueda
        this.searchInput.addEventListener('input', (e) => this.searchVideos(e.target.value));

        // Filtros de calidad
        document.querySelectorAll('.quality-filter').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByQuality(e.target.dataset.quality));
        });

        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Control automático de overlays
        this.setupControlsVisibility();

        // Volumen inicial
        this.videoElement.volume = 0.7;
    }

    setupControlsVisibility() {
        // Mostrar controles al mover el mouse
        this.videoContainer.addEventListener('mousemove', () => {
            this.showControls();
            this.resetControlsTimer();
        });

        // Mostrar controles al entrar al contenedor
        this.videoContainer.addEventListener('mouseenter', () => {
            this.showControls();
        });

        // Ocultar controles al salir del contenedor (solo si está reproduciendo)
        this.videoContainer.addEventListener('mouseleave', () => {
            if (!this.videoElement.paused) {
                this.hideControlsDelayed();
            }
        });

        // Pausar timer cuando mouse está sobre controles
        const overlays = ['videoTopOverlay', 'videoBottomOverlay', 'videoCenterOverlay'];
        overlays.forEach(id => {
            const overlay = document.getElementById(id);
            if (overlay) {
                overlay.addEventListener('mouseenter', () => this.clearControlsTimer());
                overlay.addEventListener('mouseleave', () => {
                    if (!this.videoElement.paused) {
                        this.resetControlsTimer();
                    }
                });
            }
        });

        // Doble click para pantalla completa
        this.videoElement.addEventListener('dblclick', () => this.toggleFullscreen());
    }

    showControls() {
        this.videoContainer.classList.remove('hide-controls');
    }

    hideControls() {
        if (!this.videoElement.paused) {
            this.videoContainer.classList.add('hide-controls');
        }
    }

    resetControlsTimer() {
        this.clearControlsTimer();
        if (!this.videoElement.paused) {
            this.controlsTimer = setTimeout(() => {
                this.hideControls();
            }, 3000); // Ocultar después de 3 segundos
        }
    }

    clearControlsTimer() {
        if (this.controlsTimer) {
            clearTimeout(this.controlsTimer);
            this.controlsTimer = null;
        }
    }

    hideControlsDelayed() {
        this.clearControlsTimer();
        this.controlsTimer = setTimeout(() => {
            this.hideControls();
        }, 1000); // Ocultar después de 1 segundo al salir
    }

    onPlay() {
        this.updatePlayButton(false);
        this.videoContainer.classList.add('playing');
        this.resetControlsTimer();
    }

    onPause() {
        this.updatePlayButton(true);
        this.videoContainer.classList.remove('playing');
        this.showControls();
        this.clearControlsTimer();
    }

    async loadPopularVideos(query = 'nature') {
        try {
            this.showLoading(true);
            console.log('Cargando videos populares...');
            
            const response = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=20&orientation=landscape`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (data && data.videos) {
                this.videos = data.videos.map(video => ({
                    id: video.id,
                    title: `Video ${video.id}`,
                    author: video.user.name,
                    duration: video.duration,
                    width: video.width,
                    height: video.height,
                    thumbnail: video.image,
                    url: video.url,
                    videoFiles: video.video_files.map(file => ({
                        id: file.id,
                        quality: file.quality,
                        width: file.width,
                        height: file.height,
                        link: file.link,
                        fileType: file.file_type
                    }))
                }));

                console.log(`Cargados ${this.videos.length} videos`);
                
                if (this.videos.length > 0) {
                    this.loadVideo(0);
                }
            }
        } catch (error) {
            console.error('Error al cargar videos:', error);
            this.loadFallbackVideos();
        } finally {
            this.showLoading(false);
        }
    }

    loadFallbackVideos() {
        // Videos de fallback en caso de error
        this.videos = [
            {
                id: 'fallback1',
                title: 'Video de Prueba 1',
                author: 'Sample',
                duration: 30,
                thumbnail: 'https://via.placeholder.com/640x360/333/fff?text=Video+1',
                videoFiles: [{
                    quality: 'hd',
                    link: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
                }]
            }
        ];

        if (this.videos.length > 0) {
            this.loadVideo(0);
        }
    }

    loadVideo(index) {
        if (index >= 0 && index < this.videos.length) {
            this.currentVideoIndex = index;
            const video = this.videos[index];
            
            // Pausar video actual
            if (!this.videoElement.paused) {
                this.videoElement.pause();
            }

            // Buscar mejor calidad disponible
            const videoFile = this.getBestQuality(video.videoFiles);
            
            if (videoFile) {
                this.videoElement.src = videoFile.link;
                this.videoElement.poster = video.thumbnail;
                this.videoElement.load();
                
                // Actualizar información
                this.updateVideoInfo(video, videoFile);
                this.highlightCurrentVideo();
                
                console.log(`Cargando video: ${video.title} - ${video.author}`);
            }
        }
    }

    getBestQuality(videoFiles) {
        // Priorizar calidad HD y formato MP4
        const mp4Files = videoFiles.filter(file => 
            file.fileType === 'video/mp4' && file.link && !file.link.includes('.m3u8')
        );
        
        // Buscar por calidad preferida
        let selectedFile = mp4Files.find(file => file.quality === this.currentQuality);
        
        // Si no hay de la calidad preferida, buscar HD
        if (!selectedFile) {
            selectedFile = mp4Files.find(file => file.quality === 'hd');
        }
        
        // Si no hay HD, tomar SD
        if (!selectedFile) {
            selectedFile = mp4Files.find(file => file.quality === 'sd');
        }
        
        // Si no hay nada, tomar el primero disponible
        if (!selectedFile && mp4Files.length > 0) {
            selectedFile = mp4Files[0];
        }
        
        return selectedFile;
    }

    updateVideoInfo(video, videoFile) {
        // Actualizar título y autor en overlay
        document.getElementById('videoTitle').textContent = video.title;
        document.getElementById('videoAuthor').textContent = `Por ${video.author}`;
        
        // Actualizar información en controles
        document.getElementById('currentVideoTitle').textContent = video.title;
        document.getElementById('currentVideoInfo').textContent = `Por ${video.author}`;
        document.getElementById('currentVideoThumb').src = video.thumbnail;
        document.getElementById('currentVideoQuality').textContent = videoFile.quality.toUpperCase();
        document.getElementById('currentVideoDuration').textContent = this.formatTime(video.duration);
    }

    async togglePlay() {
        try {
            if (this.videoElement.paused) {
                await this.videoElement.play();
            } else {
                this.videoElement.pause();
            }
        } catch (error) {
            console.error('Error al reproducir video:', error);
        }
    }

    updatePlayButton(isPaused) {
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        
        if (isPaused) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
    }

    nextVideo() {
        const nextIndex = (this.currentVideoIndex + 1) % this.videos.length;
        this.loadVideo(nextIndex);
    }

    previousVideo() {
        const prevIndex = this.currentVideoIndex === 0 ? 
            this.videos.length - 1 : this.currentVideoIndex - 1;
        this.loadVideo(prevIndex);
    }

    updateDuration() {
        this.seekBar.max = this.videoElement.duration;
        this.totalDuration.textContent = this.formatTime(this.videoElement.duration);
    }

    updateProgress() {
        this.seekBar.value = this.videoElement.currentTime;
        this.currentTime.textContent = this.formatTime(this.videoElement.currentTime);
    }

    seek() {
        this.videoElement.currentTime = this.seekBar.value;
    }

    updateVolume() {
        this.videoElement.volume = this.volumeBar.value / 100;
        this.updateVolumeIcon();
    }

    toggleMute() {
        if (this.videoElement.muted) {
            this.videoElement.muted = false;
            this.volumeBar.value = this.videoElement.volume * 100;
        } else {
            this.videoElement.muted = true;
        }
        this.updateVolumeIcon();
    }

    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volumeIcon');
        const muteIcon = document.getElementById('muteIcon');
        
        if (this.videoElement.muted || this.videoElement.volume === 0) {
            volumeIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
        } else {
            volumeIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
        }
    }

    toggleFullscreen() {
        const videoContainer = this.videoContainer;
        
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen?.() ||
            videoContainer.webkitRequestFullscreen?.() ||
            videoContainer.mozRequestFullScreen?.();
        } else {
            document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.mozCancelFullScreen?.();
        }
    }

    renderVideoList() {
        this.videoList.innerHTML = '';
        
        this.videos.forEach((video, index) => {
            const listItem = document.createElement('li');
            listItem.className = `video-item bg-white/5 p-3 rounded-lg ${index === this.currentVideoIndex ? 'active' : ''}`;
            
            listItem.innerHTML = `
                <div class="flex gap-3">
                    <img src="${video.thumbnail}" 
                         class="w-16 h-12 rounded-lg object-cover flex-shrink-0" 
                         loading="lazy">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-sm truncate">${video.title}</p>
                        <p class="text-xs text-gray-300 truncate">Por ${video.author}</p>
                        <div class="flex justify-between items-center mt-1">
                            <span class="text-xs text-blue-400">${video.width}x${video.height}</span>
                            <span class="text-xs text-gray-400">${this.formatTime(video.duration)}</span>
                        </div>
                    </div>
                </div>
            `;
            
            listItem.addEventListener('click', () => {
                this.loadVideo(index);
            });
            
            this.videoList.appendChild(listItem);
        });
    }

    highlightCurrentVideo() {
        document.querySelectorAll('.video-item').forEach((item, index) => {
            if (index === this.currentVideoIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    async searchVideos(query) {
        if (query.length < 2) {
            await this.loadPopularVideos();
            this.renderVideoList();
            return;
        }

        try {
            this.showLoading(true);
            const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            const data = await response.json();
            
            if (data && data.videos) {
                this.videos = data.videos.map(video => ({
                    id: video.id,
                    title: `${query} Video ${video.id}`,
                    author: video.user.name,
                    duration: video.duration,
                    width: video.width,
                    height: video.height,
                    thumbnail: video.image,
                    url: video.url,
                    videoFiles: video.video_files.map(file => ({
                        id: file.id,
                        quality: file.quality,
                        width: file.width,
                        height: file.height,
                        link: file.link,
                        fileType: file.file_type
                    }))
                }));

                this.renderVideoList();
                
                if (this.videos.length > 0) {
                    this.loadVideo(0);
                }
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
        } finally {
            this.showLoading(false);
        }
    }

    filterByQuality(quality) {
        // Actualizar botones activos
        document.querySelectorAll('.quality-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-red-500');
            btn.classList.add('bg-white/20');
        });
        
        const activeBtn = document.querySelector(`[data-quality="${quality}"]`);
        activeBtn.classList.add('active', 'bg-red-500');
        activeBtn.classList.remove('bg-white/20');
        
        this.currentQuality = quality === 'all' ? 'hd' : quality;
        
        // Recargar video actual con nueva calidad
        if (this.videos.length > 0) {
            this.loadVideo(this.currentVideoIndex);
        }
    }

    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextVideo();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousVideo();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        } else {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }

    formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Inicializar reproductor cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.videoPlayer = new VideoPlayer();
    
    console.log('🎬 Reproductor de Videos iniciado');
});

// Agregar estilos CSS adicionales
const additionalStyles = `
<style>
/* Animaciones para controles */
.video-item {
    transition: all 0.2s ease;
}

.video-item:hover {
    transform: translateX(4px);
}

.quality-filter {
    transition: all 0.2s ease;
}

/* Personalizar controles de video */
video::-webkit-media-controls {
    display: none !important;
}

video::-webkit-media-controls-enclosure {
    display: none !important;
}

/* Efectos de hover */
button:hover {
    transform: scale(1.05);
}

button:active {
    transform: scale(0.95);
}

/* Scrollbar personalizado */
#videoList::-webkit-scrollbar {
    width: 6px;
}

#videoList::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

#videoList::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.6);
    border-radius: 3px;
}

#videoList::-webkit-scrollbar-thumb:hover {
    background: rgba(239, 68, 68, 0.8);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);