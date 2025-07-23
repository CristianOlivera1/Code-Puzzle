document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentUser = null;
    let avatarModal = null;
    let passwordModal = null;

    // Inicializar página
    init();

    function init() {
        // Crear modales
        createAvatarModal();
        createPasswordModal();
        
        // Cargar datos del perfil
        loadProfileData();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Cargar progreso por lenguaje
        loadLanguageProgress();
        
        // Cargar logros recientes
        loadRecentAchievements();
    }

    function setupEventListeners() {
        // Avatar - Tanto el overlay como la imagen
        const avatarContainer = document.querySelector('.avatar-container');
        const avatarUpload = document.getElementById('avatar-upload');
        
        if (avatarContainer) {
            avatarContainer.addEventListener('click', openAvatarModal);
        }
        
        if (avatarUpload) {
            avatarUpload.addEventListener('change', handleAvatarUpload);
        }

        // Cambiar contraseña
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', openPasswordModal);
        }

        // Exportar progreso
        const exportBtn = document.getElementById('exportProgressBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportProgress);
        }

        // Cerrar perfil
        const closeBtn = document.querySelector('.close-profile');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                window.location.href = '../index.html';
            });
        }
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
                    showError('Error al cargar datos del perfil: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error de conexión al cargar el perfil');
            });
    }

    function displayUserInfo(user) {
        // Actualizar nombre en el header del perfil
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = user.nombre;
        }

        // Actualizar email en el header del perfil
        const profileEmail = document.getElementById('profile-email');
        if (profileEmail) {
            profileEmail.textContent = user.correo;
        }

        // Avatar
        const avatarImg = document.querySelector('#profile-image');
        if (avatarImg && user.foto) {
            // Verificar si es un avatar subido o predefinido
            if (user.foto.startsWith('avatar_')) {
                avatarImg.src = `../uploads/avatars/${user.foto}`;
            } else {
                avatarImg.src = `../assets/images/${user.foto}`;
            }
            avatarImg.alt = `Avatar de ${user.nombre}`;
        }
    }

    function displayUserStats(stats) {
        // Niveles completados
        const completedElement = document.querySelector('#total-completed');
        if (completedElement) {
            completedElement.textContent = stats.totalCompleted;
        }

        // Total de estrellas
        const starsElement = document.querySelector('#total-stars');
        if (starsElement) {
            starsElement.textContent = stats.totalStars;
        }

        // Mejor tiempo
        const timeElement = document.querySelector('#best-time');
        if (timeElement) {
            timeElement.textContent = stats.bestTime ? formatTime(stats.bestTime) : '--:--';
        }
    }

    function createAvatarModal() {
        avatarModal = document.createElement('div');
        avatarModal.className = 'modal avatar-modal';
        avatarModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Cambiar Foto de Perfil</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="avatar-upload-section">
                        <h4>Subir tu propia imagen</h4>
                        <div class="upload-area" id="upload-area">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Haz clic para seleccionar una imagen o arrastra aquí</p>
                            <small>JPG, PNG, GIF, WebP - Máximo 5MB</small>
                            <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
                        </div>
                    </div>
                    
                    <div class="divider">
                        <span>O elige un avatar predefinido</span>
                    </div>
                    
                    <div class="avatar-grid">
                        <div class="avatar-option" data-avatar="default.png">
                            <img src="../assets/images/default.png" alt="Avatar por defecto">
                        </div>
                        <div class="avatar-option" data-avatar="avatar1.png">
                            <img src="../assets/images/avatar1.png" alt="Avatar 1">
                        </div>
                        <div class="avatar-option" data-avatar="avatar2.png">
                            <img src="../assets/images/avatar2.png" alt="Avatar 2">
                        </div>
                        <div class="avatar-option" data-avatar="avatar3.png">
                            <img src="../assets/images/avatar3.png" alt="Avatar 3">
                        </div>
                        <div class="avatar-option" data-avatar="avatar4.png">
                            <img src="../assets/images/avatar4.png" alt="Avatar 4">
                        </div>
                        <div class="avatar-option" data-avatar="avatar5.png">
                            <img src="../assets/images/avatar5.png" alt="Avatar 5">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeAvatarModal()">Cancelar</button>
                    <button class="btn btn-primary" id="saveAvatarBtn">Guardar</button>
                </div>
            </div>
        `;

        document.body.appendChild(avatarModal);

        // Event listeners para el modal de avatar
        avatarModal.querySelector('.close-modal').addEventListener('click', closeAvatarModal);
        avatarModal.addEventListener('click', function(e) {
            if (e.target === avatarModal) {
                closeAvatarModal();
            }
        });

        // Upload area
        const uploadArea = avatarModal.querySelector('#upload-area');
        const fileInput = avatarModal.querySelector('#avatar-file-input');
        
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
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelection(e.target.files[0]);
            }
        });

        // Selección de avatar predefinido
        const avatarOptions = avatarModal.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.addEventListener('click', function() {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                // Limpiar selección de archivo
                fileInput.value = '';
                uploadArea.classList.remove('file-selected');
            });
        });

        // Guardar avatar
        document.getElementById('saveAvatarBtn').addEventListener('click', saveAvatar);
    }

    function createPasswordModal() {
        passwordModal = document.createElement('div');
        passwordModal.className = 'modal password-modal';
        passwordModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Cambiar Contraseña</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label for="currentPassword">Contraseña actual:</label>
                            <input type="password" id="currentPassword" name="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="newPassword">Nueva contraseña:</label>
                            <input type="password" id="newPassword" name="newPassword" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar contraseña:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closePasswordModal()">Cancelar</button>
                    <button class="btn btn-primary" id="savePasswordBtn">Cambiar Contraseña</button>
                </div>
            </div>
        `;

        document.body.appendChild(passwordModal);

        // Event listeners para el modal de contraseña
        passwordModal.querySelector('.close-modal').addEventListener('click', closePasswordModal);
        passwordModal.addEventListener('click', function(e) {
            if (e.target === passwordModal) {
                closePasswordModal();
            }
        });

        // Guardar contraseña
        document.getElementById('savePasswordBtn').addEventListener('click', changePassword);
    }

    function openAvatarModal() {
        avatarModal.style.display = 'flex';
        
        // Marcar avatar actual como seleccionado si es predefinido
        if (currentUser && currentUser.foto && !currentUser.foto.startsWith('avatar_')) {
            const currentOption = avatarModal.querySelector(`[data-avatar="${currentUser.foto}"]`);
            if (currentOption) {
                avatarModal.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                currentOption.classList.add('selected');
            }
        }
    }

    function closeAvatarModal() {
        avatarModal.style.display = 'none';
        // Resetear el área de upload
        const uploadArea = avatarModal.querySelector('#upload-area');
        const fileInput = avatarModal.querySelector('#avatar-file-input');
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Haz clic para seleccionar una imagen o arrastra aquí</p>
            <small>JPG, PNG, GIF, WebP - Máximo 5MB</small>
            <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
        `;
        uploadArea.classList.remove('file-selected');
        fileInput.value = '';
    }

    function openPasswordModal() {
        passwordModal.style.display = 'flex';
        
        // Limpiar formulario
        document.getElementById('passwordForm').reset();
    }

    function closePasswordModal() {
        passwordModal.style.display = 'none';
    }

    function saveAvatar() {
        const selectedOption = avatarModal.querySelector('.avatar-option.selected');
        const fileInput = avatarModal.querySelector('#avatar-file-input');
        
        if (fileInput.files.length > 0) {
            // Subir archivo personalizado
            uploadCustomAvatar(fileInput.files[0]);
        } else if (selectedOption) {
            // Usar avatar predefinido
            const newAvatar = selectedOption.dataset.avatar;
            
            const formData = new FormData();
            formData.append('avatar', newAvatar);

            fetch('../php/controllers/profile.php?action=update_avatar', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess('Avatar actualizado correctamente');
                    
                    // Actualizar avatar en la página
                    const avatarImg = document.querySelector('#profile-image');
                    if (avatarImg) {
                        avatarImg.src = `../assets/images/${data.newAvatar}`;
                    }
                    
                    currentUser.foto = data.newAvatar;
                    closeAvatarModal();
                } else {
                    showError('Error al actualizar avatar: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error de conexión al actualizar avatar');
            });
        } else {
            showError('Por favor selecciona un avatar o sube una imagen');
        }
    }

    function handleFileSelection(file) {
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showError('Tipo de archivo no permitido. Solo se permiten JPG, PNG, GIF y WebP');
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showError('El archivo es demasiado grande. Máximo 5MB');
            return;
        }
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadArea = avatarModal.querySelector('#upload-area');
            uploadArea.innerHTML = `
                <div class="file-preview">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 10px;">
                    <p>${file.name}</p>
                    <small>${(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                </div>
            `;
            uploadArea.classList.add('file-selected');
            
            // Deseleccionar avatares predefinidos
            avatarModal.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
        };
        reader.readAsDataURL(file);
        
        // Guardar archivo en el input
        const fileInput = avatarModal.querySelector('#avatar-file-input');
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
    }

    function uploadCustomAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        // Mostrar loader
        const saveBtn = document.getElementById('saveAvatarBtn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Subiendo...';
        saveBtn.disabled = true;

        fetch('../php/controllers/profile.php?action=upload_avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Foto de perfil actualizada correctamente');
                
                // Actualizar avatar en la página
                const avatarImg = document.querySelector('#profile-image');
                if (avatarImg) {
                    avatarImg.src = `../${data.avatarUrl}?t=${Date.now()}`; // Cache bust
                }
                
                currentUser.foto = data.newAvatar;
                closeAvatarModal();
            } else {
                showError('Error al subir la imagen: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error de conexión al subir la imagen');
        })
        .finally(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        });
    }

    function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            uploadCustomAvatar(file);
        }
    }

    function changePassword() {
        const form = document.getElementById('passwordForm');
        const formData = new FormData(form);

        // Validar que las contraseñas coincidan
        if (formData.get('newPassword') !== formData.get('confirmPassword')) {
            showError('Las contraseñas no coinciden');
            return;
        }

        fetch('../php/controllers/profile.php?action=change_password', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Contraseña actualizada correctamente');
                closePasswordModal();
            } else {
                showError('Error al cambiar contraseña: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Error de conexión al cambiar contraseña');
        });
    }

    function loadLanguageProgress() {
        fetch('../php/controllers/profile.php?action=get_progress_by_language')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayLanguageProgress(data.languages);
                } else {
                    console.error('Error al cargar progreso por lenguaje:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayLanguageProgress(languages) {
        const progressContainer = document.querySelector('.progress-languages');
        
        if (!progressContainer) {
            return;
        }

        progressContainer.innerHTML = '';

        if (languages.length === 0) {
            progressContainer.innerHTML = '<p class="no-progress">No has completado ningún nivel aún</p>';
            return;
        }

        languages.forEach(language => {
            const languageCard = document.createElement('div');
            languageCard.className = 'language-progress-card';
            languageCard.innerHTML = `
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
            progressContainer.appendChild(languageCard);
        });
    }

    function loadRecentAchievements() {
        fetch('../php/controllers/profile.php?action=get_recent_achievements')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayRecentAchievements(data.achievements);
                } else {
                    console.error('Error al cargar logros recientes:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayRecentAchievements(achievements) {
        const achievementsContainer = document.querySelector('.achievements-list');
        
        if (!achievementsContainer) {
            return;
        }

        achievementsContainer.innerHTML = '';

        if (achievements.length === 0) {
            achievementsContainer.innerHTML = '<p class="no-achievements">No tienes logros recientes</p>';
            return;
        }

        achievements.forEach(achievement => {
            const achievementCard = document.createElement('div');
            achievementCard.className = `achievement-card ${achievement.tipo}`;
            achievementCard.innerHTML = `
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
            achievementsContainer.appendChild(achievementCard);
        });
    }

    function exportProgress() {
        fetch('../php/controllers/profile.php?action=export_progress')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Crear y descargar archivo JSON
                    const dataStr = JSON.stringify(data.data, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(dataBlob);
                    link.download = `progreso_puzzle_code_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    
                    showSuccess('Progreso exportado correctamente');
                } else {
                    showError('Error al exportar progreso: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error de conexión al exportar progreso');
            });
    }

    // Funciones utilitarias
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type) {
        // Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

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

        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Cerrar automáticamente después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);

        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // Hacer funciones globales para los modales
    window.closeAvatarModal = closeAvatarModal;
    window.closePasswordModal = closePasswordModal;
});

// Estilos CSS adicionales
const additionalStyles = `
<style>
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.close-modal {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-modal:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.avatar-upload-section {
    margin-bottom: 25px;
}

.avatar-upload-section h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
}

.upload-area {
    border: 2px dashed #ccc;
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.5);
}

.upload-area:hover, .upload-area.drag-over {
    border-color: #2196F3;
    background: rgba(33, 150, 243, 0.05);
}

.upload-area i {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 15px;
    display: block;
}

.upload-area p {
    margin: 0 0 5px 0;
    color: #666;
    font-weight: 600;
}

.upload-area small {
    color: #999;
    font-size: 12px;
}

.upload-area.file-selected {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.05);
}

.file-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.file-preview img {
    border: 2px solid #4CAF50;
}

.file-preview p {
    font-weight: 600;
    color: #333;
    margin: 0;
}

.file-preview small {
    color: #666;
}

.divider {
    text-align: center;
    margin: 25px 0;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
}

.divider span {
    background: white;
    padding: 0 15px;
    color: #666;
    font-size: 14px;
    position: relative;
    z-index: 1;
}

.avatar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 20px;
}

.avatar-option {
    aspect-ratio: 1;
    border: 3px solid transparent;
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.5);
}

.avatar-option img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-option:hover {
    border-color: #4CAF50;
    transform: scale(1.05);
}

.avatar-option.selected {
    border-color: #2196F3;
    background: rgba(33, 150, 243, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #2196F3;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-primary {
    background: linear-gradient(135deg, #2196F3, #1976D2);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1976D2, #1565C0);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
}

.btn-secondary:hover {
    background: rgba(0, 0, 0, 0.2);
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    opacity: 0;
    transform: translateX(400px);
    transition: all 0.3s ease;
    max-width: 400px;
}

.notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification.success {
    border-left: 5px solid #4CAF50;
}

.notification.error {
    border-left: 5px solid #f44336;
}

.notification-content {
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 20px;
}

.notification.success i {
    color: #4CAF50;
}

.notification.error i {
    color: #f44336;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    margin-left: auto;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
`;

// Insertar estilos adicionales en el head
document.head.insertAdjacentHTML('beforeend', additionalStyles);
