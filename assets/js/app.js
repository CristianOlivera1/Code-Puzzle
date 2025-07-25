// Estado global de la aplicación
const App = {
    currentUser: null,
    currentLanguage: null,
    currentLevel: null,
    currentLevels: [], // Array de todos los niveles del lenguaje actual
    timer: null,
    startTime: null,
    sortable: null,
    errorsCount: 0, // Contador de errores
    maxErrors: 3,   // Máximo de errores permitidos
    gameOver: false, // Estado del juego

    // Inicialización
    init() {
        this.setupEventListeners();
        this.checkGoogleAuthToken(); // Verificar token de Google OAuth
        this.checkSession();
        this.loadLanguages();
    },

    // Verificar token de Google OAuth en la URL
    checkGoogleAuthToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const googleToken = urlParams.get('google_auth');

        if (googleToken) {
            console.log('Token de Google encontrado en URL:', googleToken);

            // Limpiar la URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Manejar el token de Google
            this.handleGoogleAuthSuccess(googleToken);
        } else {

        }
    },

    // Configurar event listeners
    setupEventListeners() {
        // Navegación
        document.getElementById('start-game-btn').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.onButtonClick();
            if (this.currentUser) {
                this.showScreen('language-screen');
            } else {
                this.showAuthModal();
            }
        });

        document.getElementById('back-to-languages').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.onButtonClick();
            this.showScreen('language-screen');
        });

        document.getElementById('back-to-levels').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.onButtonClick();
            this.showScreen('level-screen');
        });

        // Autenticación
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showAuthModal('login');
        });

        document.getElementById('register-btn').addEventListener('click', () => {
            this.showAuthModal('register');
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Botón de perfil
        document.getElementById('profile-btn').addEventListener('click', () => {
            window.location.href = 'pages/profile.html';
        });

        // Panel de administración
        document.getElementById('admin-panel-btn').addEventListener('click', () => {
            window.open('pages/admin.html', '_blank');
        });

        // Modal de autenticación
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('register');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('login');
        });

        document.querySelector('.close').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Formularios de autenticación
        document.querySelector('#login-form form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.querySelector('#register-form form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // Botones de Google OAuth
        document.querySelectorAll('.google-auth-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.googleLogin();
            });
        });

        // Dropdown de usuario
        this.setupUserDropdown();

        // Juego
        document.getElementById('check-solution').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.onButtonClick();
            this.checkSolution();
        });

        document.getElementById('reset-puzzle').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.onButtonClick();
            this.resetPuzzle();
        });

        // Modal de resultado
        document.getElementById('next-level').addEventListener('click', () => {
            this.nextLevel();
        });

        document.getElementById('retry-level').addEventListener('click', () => {
            this.retryLevel();
        });

        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.backToMenu();
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    },

    // Configurar dropdown de usuario
    setupUserDropdown() {
        const userTrigger = document.getElementById('user-trigger');
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        const dropdownArrow = document.getElementById('dropdown-arrow');
        const userDropdown = document.getElementById('user-dropdown');

        if (userTrigger && dropdownMenu) {
            // Toggle dropdown al hacer clic
            userTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = !dropdownMenu.classList.contains('hidden');
                if (isVisible) {
                    this.hideUserDropdown();
                } else {
                    this.showUserDropdown();
                }
            });

            // Efectos de hover
            userDropdown.addEventListener('mouseenter', () => {
                dropdownArrow.classList.remove('opacity-0');
                dropdownArrow.classList.add('opacity-100');
            });

            userDropdown.addEventListener('mouseleave', () => {
                if (dropdownMenu.classList.contains('hidden')) {
                    dropdownArrow.classList.remove('opacity-100');
                    dropdownArrow.classList.add('opacity-0');
                }
            });

            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target)) {
                    this.hideUserDropdown();
                }
            });
        }
    },

    // Mostrar dropdown de usuario
    showUserDropdown() {
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        const dropdownArrow = document.getElementById('dropdown-arrow');

        if (dropdownMenu) {
            dropdownMenu.classList.remove('hidden');
            dropdownArrow.classList.remove('opacity-0');
            dropdownArrow.classList.add('opacity-100');

            // Rotar flecha
            dropdownArrow.querySelector('i').style.transform = 'rotate(180deg)';
        }
    },

    // Ocultar dropdown de usuario
    hideUserDropdown() {
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        const dropdownArrow = document.getElementById('dropdown-arrow');

        if (dropdownMenu) {
            dropdownMenu.classList.add('hidden');
            dropdownArrow.classList.remove('opacity-100');
            dropdownArrow.classList.add('opacity-0');

            // Rotar flecha de vuelta
            dropdownArrow.querySelector('i').style.transform = 'rotate(0deg)';
        }
    },

    // Verificar sesión existente
    async checkSession() {
        const userData = localStorage.getItem('puzzleCodeUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    },

    // Mostrar modal de autenticación
    showAuthModal(type = 'login') {
        const modal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (type === 'register') {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        } else {
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
        }
    },

    // Ocultar modal de autenticación
    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    },

    // Login
    async login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('php/controllers/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `correo=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(password)}`
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.usuario;
                localStorage.setItem('puzzleCodeUser', JSON.stringify(data.usuario));
                this.updateUI();
                this.hideAuthModal();
                this.showNotification('¡Bienvenido de vuelta!', 'success');
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    },

    // Registro
    async register() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('php/controllers/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `nombreUsuario=${encodeURIComponent(username)}&correo=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(password)}`
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
                this.showAuthModal('login');
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    },

    // Logout
    async logout() {
        try {
            await fetch('php/controllers/auth.php?action=logout');
            this.currentUser = null;
            localStorage.removeItem('puzzleCodeUser');
            this.updateUI();
            this.showScreen('home-screen');
            this.showNotification('Sesión cerrada', 'info');
        } catch (error) {
            this.showNotification('Error al cerrar sesión', 'error');
        }
    },

    // Google OAuth Login
    async googleLogin() {
        try {
            const response = await fetch('php/controllers/auth.php?action=googleAuth');
            const data = await response.json();

            if (data.success && data.auth_url) {
                // Calcular posición central del popup
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const popupWidth = 500;
                const popupHeight = 600;
                const left = (screenWidth - popupWidth) / 2;
                const top = (screenHeight - popupHeight) / 2;

                // Abrir ventana para autenticación centrada
                const popup = window.open(
                    data.auth_url,
                    'google-auth',
                    `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,menubar=no,toolbar=no`
                );

                // Función para manejar mensajes del popup
                const handleMessage = (event) => {
                    // Verificar origen por seguridad
                    if (event.origin !== window.location.origin) return;

                    if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
                        // Remover el event listener
                        window.removeEventListener('message', handleMessage);

                        // Limpiar el interval de verificación
                        if (checkClosed) {
                            clearInterval(checkClosed);
                        }

                        // Cerrar popup si aún está abierto (con manejo de errores)
                        try {
                            if (popup && !popup.closed) {
                                popup.close();
                            }
                        } catch (e) {
                            // Ignorar errores de CORS al cerrar popup
                            console.log('Popup se cerró automáticamente por la política de CORS');
                        }

                        // Procesar autenticación exitosa
                        this.handleGoogleAuthSuccess(event.data.token);
                    } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
                        // Remover el event listener
                        window.removeEventListener('message', handleMessage);

                        // Limpiar el interval de verificación
                        if (checkClosed) {
                            clearInterval(checkClosed);
                        }

                        // Cerrar popup si aún está abierto (con manejo de errores)
                        try {
                            if (popup && !popup.closed) {
                                popup.close();
                            }
                        } catch (e) {
                            // Ignorar errores de CORS al cerrar popup
                            console.log('Popup se cerró automáticamente por la política de CORS');
                        }

                        this.showNotification('Error en la autenticación con Google', 'error');
                    }
                };

                // Agregar el event listener
                window.addEventListener('message', handleMessage);

                // Verificar si la ventana se cerró manualmente (con manejo mejorado de errores)
                const checkClosed = setInterval(() => {
                    try {
                        if (popup.closed) {
                            clearInterval(checkClosed);
                            // Remover el event listener si la ventana se cerró manualmente
                            window.removeEventListener('message', handleMessage);
                            console.log('Popup cerrado manualmente por el usuario');
                        }
                    } catch (e) {
                        // Si no podemos acceder a popup.closed debido a CORS, asumir que está cerrado
                        clearInterval(checkClosed);
                        window.removeEventListener('message', handleMessage);
                        console.log('No se puede verificar el estado del popup debido a políticas de CORS');
                    }
                }, 1000);

            } else {
                this.showNotification('Error al inicializar Google OAuth', 'error');
                console.error('Respuesta del servidor:', data);
            }
        } catch (error) {
            this.showNotification('Error de conexión con Google', 'error');
            console.error('Error:', error);
        }
    },

    // Manejar éxito de autenticación Google
    async handleGoogleAuthSuccess(token) {
        try {

            // Decodificar el token que viene del popup
            let tokenData;
            try {
                tokenData = JSON.parse(atob(token));
            } catch (decodeError) {
                console.error('Error al decodificar token:', decodeError);
                throw new Error('Token inválido');
            }

            // Verificar que el token sea válido y no haya expirado
            if (!tokenData.success || !tokenData.user) {
                throw new Error('Token no contiene datos de usuario válidos');
            }

            // Verificar expiración (5 minutos)
            const now = Math.floor(Date.now() / 1000);
            if (now - tokenData.timestamp > 300) {
                throw new Error('Token expirado');
            }

            // Usar los datos del usuario directamente del token
            this.currentUser = tokenData.user;

            // Guardar en localStorage
            localStorage.setItem('puzzleCodeUser', JSON.stringify(tokenData.user));

            this.updateUI();

            this.hideAuthModal();

            // Mostrar notificación de éxito
            if (tokenData.isNewUser) {
                this.showNotification('¡Cuenta creada exitosamente con Google! Bienvenido a Code Puzzle.', 'success');
            } else {
                this.showNotification(`¡Bienvenido de vuelta, ${tokenData.user.nombre}!`, 'success');
            }

        } catch (error) {
            console.error('Error en handleGoogleAuthSuccess:', error);
            this.showNotification('Error al procesar la autenticación: ' + error.message, 'error');
        }
    },

    // Actualizar interfaz de usuario
    updateUI() {
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        const username = document.getElementById('username');
        const adminMenuItem = document.getElementById('admin-menu-item');

        // Elementos del dropdown
        const userAvatar = document.getElementById('user-avatar');
        const userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');
        const dropdownAvatar = document.getElementById('dropdown-avatar');
        const dropdownAvatarPlaceholder = document.getElementById('dropdown-avatar-placeholder');
        const dropdownUsername = document.getElementById('dropdown-username');
        const dropdownEmail = document.getElementById('dropdown-email');

        if (this.currentUser) {
            console.log('Actualizando UI con usuario:', this.currentUser);

            // Mostrar información del usuario en el header
            if (username) {
                username.textContent = this.currentUser.nombre || this.currentUser.nombreUsuario;
            }

            // Actualizar avatares
            if (this.currentUser.foto && this.currentUser.foto !== '') {
                // Mostrar imagen de avatar
                if (userAvatar) {
                    userAvatar.src = this.currentUser.foto;
                    userAvatar.style.display = 'block';
                }
                if (userAvatarPlaceholder) {
                    userAvatarPlaceholder.style.display = 'none';
                }
                if (dropdownAvatar) {
                    dropdownAvatar.src = this.currentUser.foto;
                    dropdownAvatar.style.display = 'block';
                }
                if (dropdownAvatarPlaceholder) {
                    dropdownAvatarPlaceholder.style.display = 'none';
                }
            } else {
                // Mostrar placeholder de avatar
                if (userAvatar) {
                    userAvatar.style.display = 'none';
                }
                if (userAvatarPlaceholder) {
                    userAvatarPlaceholder.style.display = 'flex';
                }
                if (dropdownAvatar) {
                    dropdownAvatar.style.display = 'none';
                }
                if (dropdownAvatarPlaceholder) {
                    dropdownAvatarPlaceholder.style.display = 'flex';
                }
            }

            // Actualizar información del dropdown
            if (dropdownUsername) {
                dropdownUsername.textContent = this.currentUser.nombre || this.currentUser.nombreUsuario;
            }
            if (dropdownEmail) {
                dropdownEmail.textContent = this.currentUser.correo || this.currentUser.email || '';
            }

            // Mostrar/ocultar elementos principales
            if (userInfo) {
                userInfo.style.display = 'flex';
            }

            if (authButtons) {
                authButtons.style.display = 'none';
            }

            // Mostrar opción de admin solo si es administrador
            if (adminMenuItem) {
                if (this.currentUser.rol === 'Administrador' || this.currentUser.nombreRol === 'Administrador') {
                    adminMenuItem.style.display = 'block';
                } else {
                    adminMenuItem.style.display = 'none';
                }
            }

        } else {
            console.log('Ocultando UI de usuario - no hay usuario logueado');

            if (userInfo) {
                userInfo.style.display = 'none';
            }

            if (authButtons) {
                authButtons.style.display = 'flex';
            }

            // Ocultar dropdown si está visible
            this.hideUserDropdown();
        }

        console.log('UI actualizada');
    },

    // Función de debug para verificar el estado
    debugState() {
        console.log('=== DEBUG ESTADO APLICACIÓN ===');
        console.log('Usuario actual:', this.currentUser);
        console.log('localStorage:', localStorage.getItem('puzzleCodeUser'));
        console.log('Elementos UI:');
        console.log('- user-info:', document.getElementById('user-info')?.style.display);
        console.log('- auth-buttons:', document.getElementById('auth-buttons')?.style.display);
        console.log('- username:', document.getElementById('username')?.textContent);
        console.log('- dropdown-username:', document.getElementById('dropdown-username')?.textContent);
        console.log('- dropdown-email:', document.getElementById('dropdown-email')?.textContent);
        console.log('==============================');
    },

    // Cargar lenguajes
    async loadLanguages() {
        try {
            const response = await fetch('php/controllers/game.php?action=obtener_niveles');
            const data = await response.json();

            if (data.niveles) {
                this.renderLanguages(data.niveles);
            }
        } catch (error) {
            this.showNotification('Error al cargar lenguajes', 'error');
        }
    },

    // Renderizar lenguajes
    renderLanguages(niveles) {
        const languages = {};

        // Agrupar por lenguaje
        niveles.forEach(nivel => {
            if (!languages[nivel.idLenguaje]) {
                languages[nivel.idLenguaje] = {
                    id: nivel.idLenguaje,
                    nombre: nivel.nombreLenguaje,
                    foto: nivel.fotoLenguaje,
                    niveles: []
                };
            }
            languages[nivel.idLenguaje].niveles.push(nivel);
        });

        const container = document.getElementById('languages-grid');
        container.innerHTML = '';

        Object.values(languages).forEach(language => {
            const card = document.createElement('article');
            card.className = 'language-card';

            card.innerHTML = `
    <div>
      <p>${language.niveles.length} Niveles</p>
      <h3>${language.nombre}</h3>
    </div>
    <img src="assets/images/${language.foto}.svg" alt="${language.nombre}" onerror="this.src='assets/images/default.png'" />
  `;

            card.addEventListener('click', () => {
                this.selectLanguage(language);
            });

            container.appendChild(card);
        });
    },

    // Seleccionar lenguaje
    async selectLanguage(language) {
        this.currentLanguage = language;
        document.getElementById('language-title').textContent = language.nombre;

        // Mostrar personaje específico del lenguaje
        if (window.characterManager) {
            window.characterManager.showLanguageCharacter(language.nombre.toLowerCase());
            window.characterManager.showSpeech(`¡Perfecto! Vamos a programar en ${language.nombre}. ¡Será muy divertido!`);
        }

        try {
            const response = await fetch(`php/controllers/game.php?action=obtener_niveles&idLenguaje=${language.id}`);
            const data = await response.json();

            if (data.niveles) {
                this.currentLevels = data.niveles; // Almacenar todos los niveles
                this.renderLevels(data.niveles);
                this.showScreen('level-screen');
            }
        } catch (error) {
            this.showNotification('Error al cargar niveles', 'error');
        }
    },

    // Renderizar niveles
    renderLevels(niveles) {
        const container = document.getElementById('levels-grid');
        container.innerHTML = '';

        niveles.forEach((nivel, index) => {
            const card = document.createElement('div');
            card.className = `level-card ${nivel.estado === 1 ? 'locked' : ''}`;

            const stars = this.renderStars(0); // TODO: Obtener progreso real

            card.innerHTML = `
                <div class="level-number">${index + 1}</div>
                <div class="level-title">${nivel.titulo}</div>
                <div class="level-description">${nivel.ayudaDescripcion}</div>
                <div class="level-stats">
                    <div class="stars">${stars}</div>
                    <div class="time-limit">
                        <i class="fas fa-clock"></i> ${this.formatTime(nivel.tiempoLimite)}
                    </div>
                </div>
            `;

            if (nivel.estado === 0) { // No bloqueado
                card.addEventListener('click', () => {
                    this.selectLevel(nivel);
                });
            }

            container.appendChild(card);
        });
    },

    // Renderizar estrellas
    renderStars(count) {
        let html = '';
        for (let i = 1; i <= 3; i++) {
            if (i <= count) {
                html += '<i class="fas fa-star star"></i>';
            } else {
                html += '<i class="fas fa-star star empty"></i>';
            }
        }
        return html;
    },

    // Seleccionar nivel
    async selectLevel(nivel) {
        if (!this.currentUser) {
            this.showAuthModal();
            return;
        }

        try {
            const response = await fetch(`php/controllers/game.php?action=obtener_nivel&idNivel=${nivel.idNivel}`);
            const data = await response.json();

            if (data.nivel) {
                this.currentLevel = data.nivel;
                this.setupGame();
                this.showScreen('game-screen');

                // Iniciar música de fondo cuando se selecciona un nivel
                if (window.audioManager && !window.audioManager.isMuted) {
                    window.audioManager.playBackgroundMusic();
                }

                // Mostrar personaje y mensaje de ánimo
                if (window.characterManager) {
                    window.characterManager.setExpression('thinking');
                    window.characterManager.showSpeech(`¡Nivel ${nivel.idNivel}! ${nivel.titulo}. ¡Puedes hacerlo! Ordena las líneas correctamente.`);
                }
            }
        } catch (error) {
            this.showNotification('Error al cargar nivel', 'error');
        }
    },

    // Configurar juego
    setupGame() {
        document.getElementById('level-title').textContent = this.currentLevel.titulo;
        document.getElementById('help-description').textContent = this.currentLevel.ayudaDescripcion;

        // Reiniciar estado del juego
        this.errorsCount = 0;
        this.gameOver = false;
        this.updateErrorsDisplay();

        // Mostrar botón de verificar al inicio
        this.showVerifyButton();

        // Configurar bloques de código y drag and drop
        this.initializeDragAndDrop();

        // DEBUG: Mostrar información del nivel
        this.debugNivel();

        // Inicializar otros elementos del juego
        this.startTimer();
        this.updateStarsDisplay(0);
        this.updateProgressDisplay();

        // Mensaje inicial del personaje
        if (window.characterManager) {
            window.characterManager.setExpression('idle');
            window.characterManager.showSpeech('¡Arrastra las líneas de código en el orden correcto!', 3000);
        }
    },

    // Inicializar sistema completo de drag and drop
    initializeDragAndDrop() {
        const sourceContainer = document.getElementById('code-source-blocks');
        const solutionContainer = document.getElementById('code-solution-blocks');

        // Limpiar contenedores
        this.clearContainers(sourceContainer, solutionContainer);

        // Crear placeholder para área de solución
        this.createSolutionPlaceholder(solutionContainer);

        // Crear bloques de código en área fuente
        this.createSourceBlocks(sourceContainer);

        // Configurar eventos de drag and drop
        this.setupDragDropEvents(sourceContainer, solutionContainer);
    },

    // Limpiar contenedores
    clearContainers(sourceContainer, solutionContainer) {
        sourceContainer.innerHTML = '';
        solutionContainer.innerHTML = '';

        // Destruir instancia de Sortable anterior si existe
        if (this.sortable) {
            this.sortable.destroy();
            this.sortable = null;
        }
    },

    // Crear placeholder para área de solución
    createSolutionPlaceholder(container) {
        const placeholder = document.createElement('div');
        placeholder.className = 'drop-zone-placeholder';
        placeholder.innerHTML = `
            <i class="fas fa-mouse-pointer"></i>
            <p>Arrastra las líneas de código aquí en orden</p>
        `;
        container.appendChild(placeholder);
    },

    // Crear bloques en área fuente
    createSourceBlocks(container) {
        this.currentLevel.lineasDesordenadas.forEach((linea, index) => {
            const block = this.createCodeBlock(linea, index);
            container.appendChild(block);
        });
    },

    // Crear un bloque de código individual
    createCodeBlock(linea, index) {
        const block = document.createElement('div');
        block.className = 'code-block';
        block.innerHTML = this.escapeHtml(linea);
        block.setAttribute('data-line', linea);
        block.setAttribute('data-index', index);
        block.draggable = true;

        // Configurar eventos de drag para este bloque
        this.setupBlockDragEvents(block);

        return block;
    },

    // Configurar eventos de drag para un bloque
    setupBlockDragEvents(block) {
        block.addEventListener('dragstart', (e) => this.onDragStart(e));
        block.addEventListener('dragend', (e) => this.onDragEnd(e));
    },

    // Configurar eventos de drag and drop para contenedores
    setupDragDropEvents(sourceContainer, solutionContainer) {
        // Configurar área de solución
        this.setupDropZone(solutionContainer, 'solution');
        // Configurar área fuente (para devolver elementos)
        this.setupDropZone(sourceContainer, 'source');
        // Configurar reordenamiento dentro del área de solución
        this.setupSortableArea(solutionContainer);
    },

    // Configurar zona de drop
    setupDropZone(container, type) {
        container.addEventListener('dragover', (e) => this.onDragOver(e, type));
        container.addEventListener('drop', (e) => this.onDrop(e, type));
        container.addEventListener('dragenter', (e) => this.onDragEnter(e));
        container.addEventListener('dragleave', (e) => this.onDragLeave(e));
    },

    // Configurar área sortable (reordenamiento)
    setupSortableArea(container) {
        this.sortable = Sortable.create(container, {
            animation: 200,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            filter: '.drop-zone-placeholder',
            preventOnFilter: false,
            onStart: () => {
                container.classList.add('sorting');
                if (window.audioManager) window.audioManager.onDragStart();
            },
            onEnd: (evt) => {
                container.classList.remove('sorting');
                this.updatePlaceholderVisibility();
                if (window.audioManager) window.audioManager.onDragDrop();

                // Si cambió de posición, verificar la nueva posición
                if (evt.oldIndex !== evt.newIndex) {
                    const movedBlock = evt.item;
                    this.verifyBlockPosition(movedBlock, evt.newIndex);
                }
            }
        });
    },

    // ===== EVENTOS DE DRAG AND DROP =====

    // Inicio de arrastre
    onDragStart(e) {
        const block = e.target;
        this.draggedElement = block;

        // Configurar datos de transferencia
        e.dataTransfer.setData('text/plain', block.getAttribute('data-line'));
        e.dataTransfer.setData('block-index', block.getAttribute('data-index'));
        e.dataTransfer.effectAllowed = 'move';

        // Efectos visuales
        block.classList.add('dragging');

        // Sonido
        if (window.audioManager) window.audioManager.onDragStart();

        // Mostrar zonas de drop válidas
        this.highlightDropZones(true);
    },

    // Fin de arrastre
    onDragEnd(e) {
        const block = e.target;
        block.classList.remove('dragging');
        this.draggedElement = null;

        // Limpiar efectos visuales
        this.highlightDropZones(false);
        this.clearDragOverEffects();
    },

    // Arrastre sobre zona válida
    onDragOver(e, type) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const container = e.currentTarget;
        container.classList.add('drag-over');
    },

    // Entrada en zona de drop
    onDragEnter(e) {
        e.preventDefault();
    },

    // Salida de zona de drop
    onDragLeave(e) {
        const container = e.currentTarget;
        if (!container.contains(e.relatedTarget)) {
            container.classList.remove('drag-over');
        }
    },

    // Drop del elemento
    onDrop(e, type) {
        e.preventDefault();
        const container = e.currentTarget;
        container.classList.remove('drag-over');

        if (!this.draggedElement) return;

        const sourceContainer = this.draggedElement.parentNode;
        const targetContainer = container;

        // Determinar acción basada en origen y destino
        if (type === 'solution' && sourceContainer.id === 'code-source-blocks') {
            // Mover de fuente a solución
            this.moveBlockToSolution(this.draggedElement);
        } else if (type === 'source' && sourceContainer.id === 'code-solution-blocks') {
            // Devolver de solución a fuente
            this.moveBlockToSource(this.draggedElement);
        }

        // Sonido de drop
        if (window.audioManager) window.audioManager.onDragDrop();
    },

    // ===== MOVIMIENTO DE BLOQUES =====

    // Mover bloque al área de solución con verificación
    async moveBlockToSolution(block) {
        if (this.gameOver) {
            this.showNotification('¡Juego terminado! Reinicia el nivel.', 'error');
            return;
        }

        const solutionContainer = document.getElementById('code-solution-blocks');
        const currentBlocks = solutionContainer.querySelectorAll('.code-block');
        const position = currentBlocks.length;

        // Mover físicamente el bloque
        this.moveBlockToContainer(block, solutionContainer);

        // Verificar si la línea es correcta en esta posición
        await this.verifyBlockPosition(block, position);

        // Actualizar interfaz
        this.updateGameState();
    },

    // Devolver bloque al área fuente (NO cuenta como error)
    moveBlockToSource(block) {
        const sourceContainer = document.getElementById('code-source-blocks');

        // Limpiar estados visuales del bloque (sin contabilizar error)
        this.clearBlockStates(block);

        // Restablecer completamente las propiedades de arrastre
        const restoredBlock = this.resetBlockDragProperties(block);

        // Mover físicamente el bloque restaurado
        this.moveBlockToContainer(restoredBlock, sourceContainer);

        // Actualizar interfaz
        this.updateGameState();

        // Mostrar feedback positivo por reorganizar
        if (window.characterManager) {
            window.characterManager.setExpression('thinking', 1000);
            window.characterManager.showSpeech('¡Bien! Puedes reorganizar las piezas.', 1500);
        }

        // Sonido neutral
        if (window.audioManager) window.audioManager.onDragDrop();
    },

    // Mover bloque físicamente a un contenedor
    moveBlockToContainer(block, targetContainer) {
        // Limpiar transiciones previas
        block.style.transition = '';
        block.style.transform = '';
        block.style.opacity = '';

        // Asegurar que el bloque mantenga sus propiedades de arrastre
        block.draggable = true;

        // Agregar clase de estado según el contenedor
        if (targetContainer.id === 'code-solution-blocks') {
            block.classList.add('in-solution');
            block.classList.remove('in-source');
        } else {
            block.classList.add('in-source');
            block.classList.remove('in-solution');
        }

        // Mover el elemento
        targetContainer.appendChild(block);

        // Animación suave
        this.animateBlockPlacement(block);
    },

    // Animar colocación del bloque
    animateBlockPlacement(block) {
        block.style.opacity = '0.7';
        block.style.transform = 'scale(0.95)';

        requestAnimationFrame(() => {
            block.style.transition = 'all 0.3s ease';
            block.style.opacity = '1';
            block.style.transform = 'scale(1)';
        });

        // Limpiar estilos después de la animación
        setTimeout(() => {
            block.style.transition = '';
            block.style.transform = '';
            block.style.opacity = '';
        }, 300);
    },

    // Verificar posición de un bloque
    async verifyBlockPosition(block, position) {
        const lineText = block.getAttribute('data-line');
        const isCorrect = await this.verificarLineaEnTiempoReal(position, lineText);

        if (isCorrect) {
            this.handleCorrectPlacement(block);
        } else {
            this.handleIncorrectPlacement(block);
        }
    },

    // Manejar colocación correcta
    handleCorrectPlacement(block) {
        // Estados visuales
        block.classList.add('correct-line');
        block.classList.remove('incorrect-line');

        // Feedback visual
        this.showLineaFeedback(block, true, '✅ ¡Correcto!');

        // Feedback del personaje
        if (window.characterManager) {
            window.characterManager.setExpression('cheering', 1500);
            window.characterManager.showSpeech('¡Excelente! Esa línea está en su lugar.', 2000);
        }

        // Sonido de éxito
        if (window.audioManager) window.audioManager.onSuccess();
    },

    // Manejar colocación incorrecta
    handleIncorrectPlacement(block) {
        // Incrementar errores
        this.errorsCount++;
        this.updateErrorsDisplay();

        // Ocultar botón de verificar solución después del primer error
        this.hideVerifyButton();

        // Estados visuales
        block.classList.add('incorrect-line');
        block.classList.remove('correct-line');

        // Feedback visual
        this.showLineaFeedback(block, false, `❌ Error ${this.errorsCount}/${this.maxErrors}`);

        // Verificar game over
        if (this.errorsCount >= this.maxErrors) {
            this.gameOver = true;
            this.showGameOver();
            return;
        }

        // Feedback del personaje
        if (window.characterManager) {
            window.characterManager.setExpression('sad', 2000);
            window.characterManager.showSpeech(`Esa línea no va ahí. Te quedan ${this.maxErrors - this.errorsCount} intentos.`, 3000);
        }

        // Sonido de error
        if (window.audioManager) window.audioManager.onError();
    },

    // ===== FUNCIONES AUXILIARES =====

    // Ocultar botón de verificar solución
    hideVerifyButton() {
        const verifyButton = document.getElementById('check-solution');
        if (verifyButton) {
            verifyButton.style.display = 'none';
            verifyButton.disabled = true;
        }
    },

    // Mostrar botón de verificar solución
    showVerifyButton() {
        const verifyButton = document.getElementById('check-solution');
        if (verifyButton) {
            verifyButton.style.display = 'inline-flex';
            verifyButton.disabled = false;
        }
    },

    // Limpiar estados visuales de un bloque
    clearBlockStates(block) {
        block.classList.remove('correct-line', 'incorrect-line', 'in-solution', 'in-source');

        // Remover feedback visual existente
        const feedback = block.querySelector('.line-feedback');
        if (feedback) feedback.remove();
    },

    // Restablecer propiedades de arrastre de un bloque
    resetBlockDragProperties(block) {
        // Asegurar que el bloque sea arrastrable
        block.draggable = true;

        // Limpiar cualquier event listener duplicado
        const clonedBlock = block.cloneNode(true);

        // Preserve los atributos importantes
        clonedBlock.setAttribute('data-line', block.getAttribute('data-line'));
        clonedBlock.setAttribute('data-index', block.getAttribute('data-index'));
        clonedBlock.draggable = true;

        // Reemplazar el bloque original con el clonado
        if (block.parentNode) {
            block.parentNode.replaceChild(clonedBlock, block);
        }

        // Reconfigurar eventos de drag para el bloque clonado
        this.setupBlockDragEvents(clonedBlock);

        // Limpiar estilos que puedan interferir
        clonedBlock.style.pointerEvents = '';
        clonedBlock.style.opacity = '';
        clonedBlock.style.transform = '';
        clonedBlock.style.transition = '';

        return clonedBlock;
    },

    // Resaltar zonas de drop
    highlightDropZones(show) {
        const containers = [
            document.getElementById('code-source-blocks'),
            document.getElementById('code-solution-blocks')
        ];

        containers.forEach(container => {
            if (show) {
                container.classList.add('drop-zone-active');
            } else {
                container.classList.remove('drop-zone-active');
            }
        });
    },

    // Limpiar efectos visuales de drag over
    clearDragOverEffects() {
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    },

    // Actualizar estado general del juego
    updateGameState() {
        this.updatePlaceholderVisibility();
        this.updateProgressDisplay();

        // Verificar si el nivel está completo
        this.checkLevelCompletion();
    },

    // Verificar si el nivel está completo
    checkLevelCompletion() {
        const solutionContainer = document.getElementById('code-solution-blocks');
        const codeBlocks = solutionContainer.querySelectorAll('.code-block');
        const totalLines = this.currentLevel.lineasDesordenadas.length;

        if (codeBlocks.length === totalLines && !this.gameOver) {
            // Verificar si todas las líneas están correctas
            const correctBlocks = solutionContainer.querySelectorAll('.code-block.correct-line');
            if (correctBlocks.length === totalLines) {
                this.handleLevelComplete();
            }
        }
    },

    // Manejar nivel completado
    async handleLevelComplete() {
        this.stopTimer();

        // Calcular tiempo transcurrido
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);

        // Calcular estrellas basado en tiempo y errores
        const stars = this.calculateStars(timeElapsed);

        // Si llegamos aquí, el nivel está completado correctamente
        const successResult = {
            correcto: true,
            estrellas: stars,
            tiempo: timeElapsed,
            message: '¡Felicitaciones! ¡Has completado el nivel correctamente!'
        };

        // Obtener solución ordenada para enviar al servidor (opcional)
        const solutionContainer = document.getElementById('code-solution-blocks');
        const codeBlocks = solutionContainer.querySelectorAll('.code-block');
        const solution = Array.from(codeBlocks).map(block => block.getAttribute('data-line'));

        // Mostrar resultado exitoso inmediatamente
        this.showResult(successResult);

        // Enviar al servidor en segundo plano (no afecta la experiencia del usuario)
        try {
            fetch('php/controllers/game.php?action=verificar_solucion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `idNivel=${this.currentLevel.idNivel}&solucion=${JSON.stringify(solution)}&tiempoSegundos=${timeElapsed}`
            });
        } catch (error) {
            console.log('Error al guardar en servidor (no crítico):', error);
        }

        // Feedback del personaje
        if (window.characterManager) {
            window.characterManager.setExpression('celebrating', 3000);
            window.characterManager.showSpeech('¡Felicitaciones! ¡Has completado el nivel!', 3000);
        }

        // Sonido de victoria
        if (window.audioManager) window.audioManager.onLevelComplete();
    },

    // Calcular estrellas basado en tiempo y errores
    calculateStars(timeElapsed) {
        // Si no hay errores, dar al menos 2 estrellas
        if (this.errorsCount === 0) {
            // Verificar si completó rápido (menos del 50% del tiempo límite)
            const timeLimit = this.currentLevel.tiempoLimite || 300; // 5 minutos por defecto
            if (timeElapsed <= timeLimit * 0.5) {
                return 3; // 3 estrellas: sin errores y rápido
            } else if (timeElapsed <= timeLimit * 0.75) {
                return 2; // 2 estrellas: sin errores pero tiempo medio
            } else {
                return 2; // 2 estrellas: sin errores pero lento
            }
        } else {
            // Con errores, solo 1 estrella
            return 1;
        }
    },

    // Actualizar visibilidad del placeholder
    updatePlaceholderVisibility() {
        const solutionContainer = document.getElementById('code-solution-blocks');
        const placeholder = solutionContainer.querySelector('.drop-zone-placeholder');
        const codeBlocks = solutionContainer.querySelectorAll('.code-block');

        if (codeBlocks.length > 0) {
            solutionContainer.classList.add('has-blocks');
            if (placeholder) placeholder.style.display = 'none';
        } else {
            solutionContainer.classList.remove('has-blocks');
            if (placeholder) placeholder.style.display = 'flex';
        }

        // Actualizar indicador de progreso
        this.updateProgressDisplay();
    },

    // Actualizar display de progreso
    updateProgressDisplay() {
        const solutionContainer = document.getElementById('code-solution-blocks');
        const codeBlocks = solutionContainer.querySelectorAll('.code-block');
        const totalLines = this.currentLevel.lineasDesordenadas.length;
        const currentLines = codeBlocks.length;

        document.getElementById('progress-display').textContent = `${currentLines}/${totalLines}`;

        // Cambiar color según progreso
        const progressElement = document.querySelector('.progress-indicator');
        if (currentLines === 0) {
            progressElement.style.color = '#7f8c8d';
        } else if (currentLines === totalLines) {
            progressElement.style.color = '#27ae60';
        } else {
            progressElement.style.color = '#ffd700';
        }
    },

    // DEBUG: Mostrar información del nivel
    async debugNivel() {
        try {
            const response = await fetch(`php/controllers/game.php?action=debug_nivel&idNivel=${this.currentLevel.idNivel}`);
            const debug = await response.json();

            console.log('=== DEBUG INFORMACIÓN DEL NIVEL ===');
            console.log('ID:', debug.nivel_id);
            console.log('Título:', debug.titulo);
            console.log('Código original completo:');
            console.log(debug.codigo_original);
            console.log('Líneas procesadas por el servidor:');
            debug.lineas_procesadas.forEach((linea, i) => {
                console.log(`[${i}]: "${linea}"`);
            });
            console.log('Total líneas:', debug.total_lineas);
            console.log('Líneas desordenadas en frontend:');
            this.currentLevel.lineasDesordenadas.forEach((linea, i) => {
                console.log(`[${i}]: "${linea}"`);
            });
            console.log('===================================');
        } catch (error) {
            console.error('Error en debug:', error);
        }
    },

    // Verificar línea en tiempo real
    async verificarLineaEnTiempoReal(posicion, lineaTexto) {
        try {
            console.log('=== VERIFICACIÓN EN TIEMPO REAL ===');
            console.log('Posición:', posicion);
            console.log('Línea a verificar:', JSON.stringify(lineaTexto));
            console.log('Nivel ID:', this.currentLevel.idNivel);

            const response = await fetch('php/controllers/game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=verificar_linea&idNivel=${this.currentLevel.idNivel}&posicion=${posicion}&linea=${encodeURIComponent(lineaTexto)}`
            });

            const result = await response.json();

            console.log('Respuesta del servidor:', result);
            console.log('¿Es correcta?:', result.correcta);
            console.log('================================');

            return result.correcta === true;
        } catch (error) {
            console.error('Error al verificar línea:', error);
            return false;
        }
    },

    // Mostrar feedback visual en la línea
    showLineaFeedback(block, esCorrecta, mensaje) {
        // Crear elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = `line-feedback ${esCorrecta ? 'correct' : 'incorrect'}`;
        feedback.textContent = mensaje;

        // Posicionar feedback
        feedback.style.position = 'absolute';
        feedback.style.right = '-120px';
        feedback.style.top = '50%';
        feedback.style.transform = 'translateY(-50%)';
        feedback.style.fontSize = '12px';
        feedback.style.fontWeight = 'bold';
        feedback.style.padding = '4px 8px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '1000';
        feedback.style.whiteSpace = 'nowrap';

        if (esCorrecta) {
            feedback.style.background = 'rgba(34, 197, 94, 0.9)';
            feedback.style.color = 'white';
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.9)';
            feedback.style.color = 'white';
        }

        // Asegurar posición relativa en el bloque
        block.style.position = 'relative';
        block.appendChild(feedback);

        // Animación de entrada
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-50%) scale(0.8)';
        setTimeout(() => {
            feedback.style.transition = 'all 0.3s ease';
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(-50%) scale(1)';
        }, 50);

        // Remover después de 3 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-50%) scale(0.8)';
                setTimeout(() => {
                    if (feedback.parentNode) {
                        feedback.parentNode.removeChild(feedback);
                    }
                }, 300);
            }
        }, 3000);
    },

    // Mostrar pantalla de game over
    showGameOver() {
        // Personaje muestra tristeza
        if (window.characterManager) {
            window.characterManager.setExpression('sad', 5000);
            window.characterManager.showSpeech('No te preocupes, ¡puedes intentarlo de nuevo!', 4000);
        }

        // Crear modal de Game Over
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over-overlay';
        gameOverDiv.innerHTML = `
            <div class="game-over-content">
                <h2>¡Game Over!</h2>
                <p>Has agotado tus 3 intentos en este nivel.</p>
                <div class="game-over-buttons">
                    <button id="reintentar-btn" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Reintentar Nivel
                    </button>
                    <button id="elegir-otro-btn" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Elegir Otro Nivel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(gameOverDiv);

        // Agregar event listeners
        document.getElementById('reintentar-btn').addEventListener('click', () => {
            this.reiniciarNivel();
        });

        document.getElementById('elegir-otro-btn').addEventListener('click', () => {
            this.volverALenguajes();
        });

        // Bloquear interacción con el juego
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.pointerEvents = 'none';
            gameContainer.style.opacity = '0.5';
        }
    },

    // Reiniciar el nivel actual
    reiniciarNivel() {
        // Remover overlay de game over
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Restaurar interacción con el juego
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.pointerEvents = 'auto';
            gameContainer.style.opacity = '1';
        }

        // Reiniciar estado del juego
        this.gameOver = false;
        this.errorsCount = 0;
        this.updateErrorsDisplay();

        // Mostrar botón de verificar de nuevo
        this.showVerifyButton();

        // Limpiar clases de líneas incorrectas
        document.querySelectorAll('.code-block').forEach(block => {
            block.classList.remove('correct-line', 'incorrect-line');
        });

        // Recargar el nivel
        this.setupGame();

        // Personaje vuelve a estado normal
        if (window.characterManager) {
            window.characterManager.setExpression('idle');
            window.characterManager.showSpeech('¡Perfecto! Vamos a intentarlo de nuevo.', 2000);
        }

        // Mostrar notificación de reinicio
        this.showNotification('Nivel reiniciado. ¡Tienes 3 nuevos intentos!', 'success');
    },

    // Volver a la selección de lenguajes
    volverALenguajes() {
        // Remover overlay de game over
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Restaurar interacción
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.pointerEvents = 'auto';
            gameContainer.style.opacity = '1';
        }

        // Resetear estado
        this.gameOver = false;
        this.errorsCount = 0;
        this.currentLevel = null;

        // Limpiar temporizador si existe
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Mostrar selector de lenguajes
        document.getElementById('language-selection').style.display = 'block';
        document.getElementById('level-selection').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';

        // Personaje saluda
        if (window.characterManager) {
            window.characterManager.setExpression('idle');
            window.characterManager.showSpeech('¿Qué lenguaje quieres practicar ahora?', 2000);
        }

        // Mostrar notificación
        this.showNotification('Puedes elegir otro nivel para practicar', 'info');
    },

    // Iniciar temporizador
    startTimer() {
        this.startTime = Date.now();
        this.updateTimer();

        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    },

    // Actualizar temporizador
    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // Actualizar display de estrellas
    updateStarsDisplay(count) {
        document.getElementById('stars-display').textContent = count;
    },

    // Actualizar display de errores
    updateErrorsDisplay() {
        const errorsDisplay = document.getElementById('errors-display');
        if (errorsDisplay) {
            errorsDisplay.textContent = `${this.errorsCount}/${this.maxErrors}`;

            // Cambiar color según el número de errores
            if (this.errorsCount === 0) {
                errorsDisplay.style.color = '#27ae60';
            } else if (this.errorsCount < this.maxErrors) {
                errorsDisplay.style.color = '#f39c12';
            } else {
                errorsDisplay.style.color = '#e74c3c';
            }
        }
    },

    // Verificar solución (OBSOLETA - ahora es automática línea por línea)
    async checkSolution() {
        // Esta función ya no se usa porque la verificación es automática
        // cuando se arrastra cada línea al área de solución
        this.showNotification('La verificación es automática al arrastrar cada línea', 'info');

        // Si se llama por accidente, revisar si el nivel está completo
        this.checkLevelCompletion();
    },

    // Mostrar resultado
    showResult(result) {
        const modal = document.getElementById('result-modal');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');
        const stars = document.getElementById('result-stars');
        const nextBtn = document.getElementById('next-level');
        const retryBtn = document.getElementById('retry-level');
        const backBtn = document.getElementById('back-to-menu');

        if (result.correcto) {
            icon.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 4rem;"></i>';
            title.textContent = '¡Felicidades!';
            message.textContent = result.message;
            stars.innerHTML = this.renderStars(result.estrellas);

            // Mostrar todos los botones en caso de éxito con estilos específicos
            nextBtn.style.display = 'inline-block';
            nextBtn.style.backgroundColor = '#4CAF50';
            nextBtn.style.color = 'white';
            nextBtn.style.border = 'none';
            nextBtn.style.padding = '12px 24px';
            nextBtn.style.borderRadius = '8px';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.fontSize = '16px';
            nextBtn.style.fontWeight = 'bold';
            nextBtn.style.margin = '8px';

            retryBtn.style.display = 'inline-block';
            retryBtn.style.backgroundColor = '#2196F3';
            retryBtn.style.color = 'white';
            retryBtn.style.border = 'none';
            retryBtn.style.padding = '12px 24px';
            retryBtn.style.borderRadius = '8px';
            retryBtn.style.cursor = 'pointer';
            retryBtn.style.fontSize = '16px';
            retryBtn.style.fontWeight = 'bold';
            retryBtn.style.margin = '8px';

            backBtn.style.display = 'inline-block';
            backBtn.style.backgroundColor = '#6c757d';
            backBtn.style.color = 'white';
            backBtn.style.border = 'none';
            backBtn.style.padding = '12px 24px';
            backBtn.style.borderRadius = '8px';
            backBtn.style.cursor = 'pointer';
            backBtn.style.fontSize = '16px';
            backBtn.style.fontWeight = 'bold';
            backBtn.style.margin = '8px';

            // Celebración del personaje
            if (window.characterManager) {
                window.characterManager.setExpression('celebrating');
                window.characterManager.celebrate('confetti');

                // Mensaje de felicitación basado en estrellas
                let celebrationMessage = '';
                if (result.estrellas === 3) {
                    celebrationMessage = '¡INCREÍBLE! ¡3 estrellas! ¡Eres un genio de la programación!';
                } else if (result.estrellas === 2) {
                    celebrationMessage = '¡Muy bien! ¡2 estrellas! ¡Excelente trabajo!';
                } else {
                    celebrationMessage = '¡Genial! ¡1 estrella! ¡Sigue así!';
                }

                setTimeout(() => {
                    window.characterManager.showSpeech(celebrationMessage);
                }, 1500);
            }

            // Reproducir sonidos de éxito
            if (window.audioManager) {
                window.audioManager.onSuccess();
                window.audioManager.onLevelComplete();

                // Reproducir sonido de estrella por cada estrella obtenida
                setTimeout(() => {
                    for (let i = 0; i < result.estrellas; i++) {
                        setTimeout(() => {
                            window.audioManager.onStarEarned();
                        }, i * 300);
                    }
                }, 500);
            }
        } else {
            icon.innerHTML = '<i class="fas fa-times-circle" style="color: #f44336; font-size: 4rem;"></i>';
            title.textContent = 'Intenta de nuevo';
            message.textContent = result.message;
            stars.innerHTML = '';

            // En caso de error, ocultar "Siguiente Nivel" pero mostrar los otros con estilos
            nextBtn.style.display = 'none';

            retryBtn.style.display = 'inline-block';
            retryBtn.style.backgroundColor = '#ff9800';
            retryBtn.style.color = 'white';
            retryBtn.style.border = 'none';
            retryBtn.style.padding = '12px 24px';
            retryBtn.style.borderRadius = '8px';
            retryBtn.style.cursor = 'pointer';
            retryBtn.style.fontSize = '16px';
            retryBtn.style.fontWeight = 'bold';
            retryBtn.style.margin = '8px';

            backBtn.style.display = 'inline-block';
            backBtn.style.backgroundColor = '#6c757d';
            backBtn.style.color = 'white';
            backBtn.style.border = 'none';
            backBtn.style.padding = '12px 24px';
            backBtn.style.borderRadius = '8px';
            backBtn.style.cursor = 'pointer';
            backBtn.style.fontSize = '16px';
            backBtn.style.fontWeight = 'bold';
            backBtn.style.margin = '8px';

            // Personaje triste y mensaje de ánimo
            if (window.characterManager) {
                window.characterManager.setExpression('sad');
                window.characterManager.showSpeech('¡No te preocupes! Los errores nos ayudan a aprender. ¡Inténtalo de nuevo!');
            }

            // Reproducir sonido de error
            if (window.audioManager) {
                window.audioManager.onError();
            }
        }

        modal.style.display = 'block';
    },

    // Detener temporizador
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    // Reiniciar puzzle
    resetPuzzle() {
        this.stopTimer();

        // Limpiar áreas
        const sourceContainer = document.getElementById('code-source-blocks');
        const solutionContainer = document.getElementById('code-solution-blocks');

        sourceContainer.innerHTML = '';
        solutionContainer.innerHTML = '<div class="drop-zone-placeholder"><i class="fas fa-mouse-pointer"></i><p>Arrastra las líneas de código aquí</p></div>';

        // Re-configurar el juego
        this.setupGame();

        // Personaje da ánimo para reintentar
        if (window.characterManager) {
            window.characterManager.setExpression('cheering');
            window.characterManager.showSpeech('¡Vamos a intentarlo de nuevo! Tómate tu tiempo y piensa bien el orden.');
        }

        this.showNotification('Puzzle reiniciado', 'info');
    },

    // Siguiente nivel
    nextLevel() {
        if (!this.currentLevel || !this.currentLevels) {
            this.hideResultModal();
            this.showScreen('level-screen');
            return;
        }

        // Encontrar el índice del nivel actual
        const currentIndex = this.currentLevels.findIndex(nivel => nivel.idNivel === this.currentLevel.idNivel);

        // Verificar si hay un siguiente nivel
        if (currentIndex >= 0 && currentIndex < this.currentLevels.length - 1) {
            const nextLevel = this.currentLevels[currentIndex + 1];

            // Verificar si el siguiente nivel está desbloqueado
            if (nextLevel.estado === 0) { // 0 = desbloqueado
                this.hideResultModal();
                this.selectLevel(nextLevel);
            } else {
                // Si el siguiente nivel está bloqueado, desbloquearlo
                this.unlockNextLevel(nextLevel).then(() => {
                    this.hideResultModal();
                    this.selectLevel(nextLevel);
                });
            }
        } else {
            // No hay más niveles, volver a la pantalla de niveles
            this.showNotification('¡Felicidades! Has completado todos los niveles de este lenguaje', 'success');
            this.hideResultModal();
            this.showScreen('level-screen');
        }
    },

    // Escapar HTML para evitar problemas con entidades
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Desbloquear siguiente nivel
    async unlockNextLevel(nivel) {
        try {
            const response = await fetch('php/controllers/game.php?action=desbloquear_nivel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `idNivel=${nivel.idNivel}`
            });

            const data = await response.json();

            if (data.success) {
                // Actualizar el estado del nivel en el array local
                nivel.estado = 0;
                this.showNotification('¡Nuevo nivel desbloqueado!', 'success');
            }

            return data.success;
        } catch (error) {
            console.error('Error al desbloquear nivel:', error);
            return false;
        }
    },

    // Reintentar nivel
    retryLevel() {
        this.hideResultModal();
        this.resetPuzzle();
    },

    // Volver al menú
    backToMenu() {
        this.hideResultModal();
        this.showScreen('level-screen');
    },

    // Ocultar modal de resultado
    hideResultModal() {
        document.getElementById('result-modal').style.display = 'none';
    },

    // Mostrar pantalla
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');

        // Controlar música de fondo según la pantalla
        if (window.audioManager) {
            if (screenId === 'game-screen') {
                // La música ya se inicia en selectLevel, no hacer nada aquí
            } else {
                // Detener música cuando no estamos en el juego
                window.audioManager.stopBackgroundMusic();
            }
        }
    },

    // Formatear tiempo
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Estilos de la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '3000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Color según tipo
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// Inicializar aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
