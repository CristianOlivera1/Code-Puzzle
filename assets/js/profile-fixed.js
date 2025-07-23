document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;

    // Inicializar
    init();

    function init() {
        loadProfileData();
        setupEventListeners();
        setupModals();
        loadLanguageProgress();
        loadRecentAchievements();
    }

    function setupEventListeners() {
        // Avatar container - abrir modal
        const avatarContainer = document.querySelector('.avatar-container');
        if (avatarContainer) {
            avatarContainer.addEventListener('click', openAvatarModal);
        }

        // Input directo de archivo
        const avatarUpload = document.getElementById('avatar-upload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', handleDirectUpload);
        }

        // Botones de navegación
        const backToGameBtn = document.getElementById('back-to-game');
        if (backToGameBtn) {
            backToGameBtn.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Botones de configuración
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', openPasswordModal);
        }

        const exportBtn = document.getElementById('export-progress-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportProgress);
        }
    }

    function setupModals() {
        // Configurar modal de avatar
        const avatarModal = document.getElementById('avatar-modal');
        const passwordModal = document.getElementById('password-modal');

        // Cerrar modales con X
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Cerrar modal haciendo clic fuera
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Selección de avatares predefinidos
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                document.getElementById('save-avatar-btn').disabled = false;
            });
        });

        // Guardar avatar seleccionado
        const saveAvatarBtn = document.getElementById('save-avatar-btn');
        if (saveAvatarBtn) {
            saveAvatarBtn.addEventListener('click', saveSelectedAvatar);
        }

        // Formulario de contraseña
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                changePassword();
            });
        }

        // Agregar área de subida al modal
        addUploadArea();
    }

    function addUploadArea() {
        const avatarOptions = document.querySelector('.avatar-options');
        if (!avatarOptions) return;

        const uploadDiv = document.createElement('div');
        uploadDiv.className = 'upload-section';
        uploadDiv.innerHTML = `
            <h4>O sube tu propia imagen:</h4>
            <div class="upload-area" id="upload-area">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Haz clic para seleccionar una imagen o arrastra aquí</p>
                <small>JPG, PNG, GIF, WebP - Máximo 5MB</small>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            </div>
        `;

        const avatarGrid = document.querySelector('.avatar-grid');
        avatarOptions.insertBefore(uploadDiv, avatarGrid);

        // Configurar eventos de subida
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }

    function loadProfileData() {
        fetch('../php/controllers/profile.php?action=get_profile_data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentUser = data.user;
                    displayUserInfo(data.user);
                    displayUserStats(data.stats);
                } else {
                    showNotification('Error al cargar datos del perfil', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión', 'error');
            });
    }

    function displayUserInfo(user) {
        document.getElementById('profile-name').textContent = user.nombre;
        document.getElementById('profile-email').textContent = user.correo;
        
        const avatarImg = document.getElementById('profile-image');
        if (user.foto.startsWith('avatar_')) {
            avatarImg.src = `../uploads/avatars/${user.foto}`;
        } else {
            avatarImg.src = `../assets/images/${user.foto}`;
        }
    }

    function displayUserStats(stats) {
        document.getElementById('total-completed').textContent = stats.totalCompleted;
        document.getElementById('total-stars').textContent = stats.totalStars;
        document.getElementById('best-time').textContent = stats.bestTime ? formatTime(stats.bestTime) : '--:--';
    }

    function openAvatarModal() {
        document.getElementById('avatar-modal').style.display = 'block';
    }

    function openPasswordModal() {
        document.getElementById('password-modal').style.display = 'block';
    }

    function saveSelectedAvatar() {
        const selected = document.querySelector('.avatar-option.selected');
        if (!selected) {
            showNotification('Selecciona un avatar', 'error');
            return;
        }

        const avatar = selected.dataset.avatar;
        const formData = new FormData();
        formData.append('avatar', avatar);

        fetch('../php/controllers/profile.php?action=update_avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Avatar actualizado correctamente', 'success');
                document.getElementById('profile-image').src = `../assets/images/${data.newAvatar}`;
                document.getElementById('avatar-modal').style.display = 'none';
                currentUser.foto = data.newAvatar;
            } else {
                showNotification('Error: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error de conexión', 'error');
        });
    }

    function handleDirectUpload(event) {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }

    function handleFileUpload(file) {
        // Validar archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Tipo de archivo no permitido. Solo JPG, PNG, GIF, WebP', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showNotification('El archivo es demasiado grande. Máximo 5MB', 'error');
            return;
        }

        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadArea = document.getElementById('upload-area');
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <div class="file-preview">
                        <img src="${e.target.result}" style="max-width: 100px; max-height: 100px; border-radius: 10px;">
                        <p>${file.name}</p>
                        <small>${(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                        <button class="btn btn-primary" onclick="uploadFile()">Subir Imagen</button>
                        <button class="btn btn-secondary" onclick="resetUploadArea()">Cancelar</button>
                    </div>
                `;
                
                // Guardar archivo para subir
                uploadArea.pendingFile = file;
            }
        };
        reader.readAsDataURL(file);
    }

    window.uploadFile = function() {
        const uploadArea = document.getElementById('upload-area');
        const file = uploadArea.pendingFile;
        
        if (!file) {
            showNotification('No hay archivo seleccionado', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        // Mostrar loading
        uploadArea.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Subiendo...</p>';

        fetch('../php/controllers/profile.php?action=upload_avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Foto actualizada correctamente', 'success');
                document.getElementById('profile-image').src = `../${data.avatarUrl}?t=${Date.now()}`;
                document.getElementById('avatar-modal').style.display = 'none';
                currentUser.foto = data.newAvatar;
                resetUploadArea();
            } else {
                showNotification('Error: ' + data.error, 'error');
                resetUploadArea();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error de conexión', 'error');
            resetUploadArea();
        });
    };

    window.resetUploadArea = function() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Haz clic para seleccionar una imagen o arrastra aquí</p>
                <small>JPG, PNG, GIF, WebP - Máximo 5MB</small>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            `;
            
            // Reconfigurar eventos
            const fileInput = document.getElementById('file-input');
            uploadArea.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                }
            });
        }
    };

    function changePassword() {
        const form = document.getElementById('password-form');
        const formData = new FormData(form);

        // Validar contraseñas
        if (formData.get('newPassword') !== formData.get('confirmPassword')) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        fetch('../php/controllers/profile.php?action=change_password', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Contraseña actualizada correctamente', 'success');
                document.getElementById('password-modal').style.display = 'none';
                form.reset();
            } else {
                showNotification('Error: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error de conexión', 'error');
        });
    }

    function logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            fetch('../php/controllers/auth.php?action=logout', {
                method: 'POST'
            })
            .then(() => {
                window.location.href = '../index.html';
            });
        }
    }

    function loadLanguageProgress() {
        fetch('../php/controllers/profile.php?action=get_progress_by_language')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayLanguageProgress(data.languages);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function displayLanguageProgress(languages) {
        const container = document.getElementById('progress-by-language');
        container.innerHTML = '';

        if (languages.length === 0) {
            container.innerHTML = '<p>No has completado ningún nivel aún</p>';
            return;
        }

        languages.forEach(language => {
            const card = document.createElement('div');
            card.className = 'language-progress-card';
            card.innerHTML = `
                <div class="language-icon">
                    <img src="../assets/images/${language.fotoLenguaje}" alt="${language.nombreLenguaje}">
                </div>
                <div class="language-info">
                    <h4>${language.nombreLenguaje}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${language.porcentajeCompletado}%"></div>
                    </div>
                    <div class="language-stats">
                        <span>${language.nivelesCompletados}/${language.totalNiveles} niveles</span>
                        <span>${language.estrellasObtenidas}/${language.estrellasMaximas} ⭐</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function loadRecentAchievements() {
        fetch('../php/controllers/profile.php?action=get_recent_achievements')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayRecentAchievements(data.achievements);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function displayRecentAchievements(achievements) {
        const container = document.getElementById('recent-achievements');
        container.innerHTML = '';

        if (achievements.length === 0) {
            container.innerHTML = '<p>No tienes logros recientes</p>';
            return;
        }

        achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.tipo}`;
            card.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.nivelTitulo}</h4>
                    <p>${achievement.descripcion}</p>
                    <div class="achievement-details">
                        <span>⭐ ${achievement.estrellas}</span>
                        <span>⏱️ ${achievement.tiempoFormateado}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function exportProgress() {
        fetch('../php/controllers/profile.php?action=export_progress')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const dataStr = JSON.stringify(data.data, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(dataBlob);
                    link.download = `progreso_puzzle_code_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    
                    showNotification('Progreso exportado correctamente', 'success');
                } else {
                    showNotification('Error al exportar progreso', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión', 'error');
            });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function showNotification(message, type) {
        // Remover notificaciones existentes
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Funciones globales para usar desde HTML
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };
});

// Estilos CSS adicionales
const styles = `
<style>
.upload-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.upload-section h4 {
    margin: 0 0 15px 0;
    color: #333;
}

.upload-area {
    border: 2px dashed #ccc;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9f9f9;
}

.upload-area:hover, .upload-area.drag-over {
    border-color: #007bff;
    background: #f0f8ff;
}

.upload-area i {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 10px;
    display: block;
}

.upload-area p {
    margin: 0 0 5px 0;
    color: #666;
}

.upload-area small {
    color: #999;
}

.file-preview {
    text-align: center;
}

.file-preview img {
    margin-bottom: 10px;
    border: 2px solid #007bff;
}

.file-preview p {
    margin: 5px 0;
    font-weight: bold;
}

.file-preview .btn {
    margin: 5px;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    opacity: 0;
    transform: translateX(300px);
    transition: all 0.3s ease;
    max-width: 400px;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #28a745;
}

.notification.error {
    border-left: 4px solid #dc3545;
}

.notification-content {
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification.success i {
    color: #28a745;
}

.notification.error i {
    color: #dc3545;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    margin-left: auto;
    color: #666;
}

.language-progress-card, .achievement-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.language-progress-card {
    display: flex;
    align-items: center;
    gap: 15px;
}

.language-icon img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
}

.language-info h4 {
    margin: 0 0 10px 0;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    transition: width 0.3s ease;
}

.language-stats {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: #666;
}

.achievement-card {
    display: flex;
    align-items: center;
    gap: 15px;
}

.achievement-card.gold {
    border-left: 4px solid #ffc107;
}

.achievement-card.silver {
    border-left: 4px solid #6c757d;
}

.achievement-card.bronze {
    border-left: 4px solid #fd7e14;
}

.achievement-icon {
    font-size: 24px;
    color: #ffc107;
}

.achievement-info h4 {
    margin: 0 0 5px 0;
}

.achievement-info p {
    margin: 0 0 8px 0;
    color: #666;
}

.achievement-details {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #888;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', styles);
