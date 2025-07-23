// Estado global del panel de administración
const AdminApp = {
    currentSection: 'dashboard',
    usuarios: [],
    lenguajes: [],
    niveles: [],
    
    // Inicialización
    init() {
        this.checkAdminAccess();
        this.setupEventListeners();
        this.loadDashboard();
    },
    
    // Verificar acceso de administrador
    async checkAdminAccess() {
        const userData = localStorage.getItem('puzzleCodeUser');
        if (!userData) {
            window.location.href = '../index.html';
            return;
        }
        
        const user = JSON.parse(userData);
        if (user.rol !== 'Administrador') {
            alert('Acceso denegado. Se requieren permisos de administrador.');
            window.location.href = '../index.html';
            return;
        }
        
        document.getElementById('admin-name').textContent = user.nombre;
    },
    
    // Configurar event listeners
    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.showSection(section);
            });
        });
        
        // Logout
        document.getElementById('admin-logout').addEventListener('click', () => {
            this.logout();
        });
        
        // Botones de crear
        document.getElementById('crear-usuario-btn').addEventListener('click', () => {
            this.showUsuarioModal();
        });
        
        document.getElementById('crear-lenguaje-btn').addEventListener('click', () => {
            this.showLenguajeModal();
        });
        
        document.getElementById('crear-nivel-btn').addEventListener('click', () => {
            this.showNivelModal();
        });
        
        // Formularios
        document.getElementById('usuario-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUsuario();
        });
        
        document.getElementById('lenguaje-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLenguaje();
        });
        
        document.getElementById('nivel-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNivel();
        });
        
        // Filtros
        document.getElementById('filtro-lenguaje').addEventListener('change', (e) => {
            this.filterNiveles(e.target.value);
        });
        
        // Cerrar modales
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.style.display = 'none';
            });
        });
    },
    
    // Mostrar sección
    showSection(sectionName) {
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Mostrar contenido
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.currentSection = sectionName;
        
        // Cargar datos específicos de la sección
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'usuarios':
                this.loadUsuarios();
                break;
            case 'lenguajes':
                this.loadLenguajes();
                break;
            case 'niveles':
                this.loadNiveles();
                break;
            case 'estadisticas':
                this.loadEstadisticas();
                break;
        }
    },
    
    // Cargar dashboard
    async loadDashboard() {
        try {
            // Cargar estadísticas
            const response = await fetch('../php/controllers/admin.php?action=dashboard_stats');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('total-usuarios').textContent = data.stats.usuarios;
                document.getElementById('total-lenguajes').textContent = data.stats.lenguajes;
                document.getElementById('total-niveles').textContent = data.stats.niveles;
                document.getElementById('usuarios-activos').textContent = data.stats.usuarios_activos;
            }
            
            // Cargar actividad reciente
            const activityResponse = await fetch('../php/controllers/admin.php?action=recent_activity');
            const activityData = await activityResponse.json();
            
            if (activityData.success) {
                this.renderRecentActivity(activityData.actividades);
            }
        } catch (error) {
            this.showNotification('Error al cargar dashboard', 'error');
        }
    },
    
    // Renderizar actividad reciente
    renderRecentActivity(actividades) {
        const container = document.getElementById('recent-activity-list');
        container.innerHTML = '';
        
        if (actividades.length === 0) {
            container.innerHTML = '<p>No hay actividad reciente</p>';
            return;
        }
        
        actividades.forEach(actividad => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const stars = '★'.repeat(actividad.estrellas);
            
            item.innerHTML = `
                <div class="activity-icon" style="background: linear-gradient(45deg, #4CAF50, #45a049);">
                    <i class="fas fa-trophy" style="color: white;"></i>
                </div>
                <div class="activity-info">
                    <p><strong>${actividad.nombreUsuario}</strong> completó el nivel 
                       <strong>${actividad.nivelTitulo}</strong> (${actividad.lenguaje})</p>
                    <small>${stars} - ${this.formatTime(actividad.tiempoSegundos)}</small>
                </div>
            `;
            
            container.appendChild(item);
        });
    },
    
    // Cargar usuarios
    async loadUsuarios() {
        try {
            const response = await fetch('../php/controllers/admin.php?action=obtener_usuarios');
            const data = await response.json();
            
            if (data.success) {
                this.usuarios = data.usuarios;
                this.renderUsuarios();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al cargar usuarios', 'error');
        }
    },
    
    // Renderizar usuarios
    renderUsuarios() {
        const tbody = document.getElementById('usuarios-tabla');
        tbody.innerHTML = '';
        
        this.usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            const statusClass = usuario.estadoConexion == 1 ? 'status-online' : 'status-offline';
            const statusText = usuario.estadoConexion == 1 ? 'Conectado' : 'Desconectado';
            
            row.innerHTML = `
                <td>${usuario.idUsuario}</td>
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.nombreRol}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>-</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="AdminApp.editUsuario(${usuario.idUsuario})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${usuario.nombreRol !== 'Administrador' ? `
                        <button class="btn-action btn-delete" onclick="AdminApp.deleteUsuario(${usuario.idUsuario})">
                            <i class="fas fa-trash"></i>
                        </button>
                        ` : ''}
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    // Cargar lenguajes
    async loadLenguajes() {
        try {
            const response = await fetch('../php/controllers/admin.php?action=obtener_lenguajes');
            const data = await response.json();
            
            if (data.success) {
                this.lenguajes = data.lenguajes;
                this.renderLenguajes();
                this.updateLenguajeSelects();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al cargar lenguajes', 'error');
        }
    },
    
    // Renderizar lenguajes
    renderLenguajes() {
        const container = document.getElementById('lenguajes-grid');
        
        if (this.lenguajes.length === 0) {
            container.innerHTML = `
                <div class="no-languages">
                    <i class="fas fa-code"></i>
                    <h3>No hay lenguajes de programación</h3>
                    <p>Comienza creando tu primer lenguaje de programación para los puzzles</p>
                    <button class="btn btn-primary" onclick="AdminApp.showLenguajeModal()">
                        <i class="fas fa-plus"></i> Crear Primer Lenguaje
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.lenguajes.forEach(lenguaje => {
            const card = document.createElement('div');
            card.className = 'language-card-admin';
            
            const totalNiveles = lenguaje.totalNiveles || 0;
            const totalCompletados = lenguaje.totalCompletados || 0;
            const porcentajeCompletado = totalNiveles > 0 ? Math.round((totalCompletados / totalNiveles) * 100) : 0;
            
            card.innerHTML = `
                <div class="language-status ${totalNiveles > 0 ? '' : 'inactive'}"></div>
                
                <div class="language-icon">
                    <img src="../assets/images/${lenguaje.foto}" alt="${lenguaje.nombre}" 
                         onerror="this.src='../assets/images/default.png'">
                </div>
                
                <div class="language-info">
                    <h4>${lenguaje.nombre}</h4>
                    <div class="language-meta">
                        <span><i class="fas fa-code"></i> ID: ${lenguaje.idLenguaje}</span>
                        <span><i class="fas fa-calendar"></i> Lenguaje de Programación</span>
                    </div>
                    <div class="language-stats">
                        <div class="stat-item">
                            <span class="stat-number">${totalNiveles}</span>
                            <span class="stat-label">Niveles</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${totalCompletados}</span>
                            <span class="stat-label">Completados</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${porcentajeCompletado}%</span>
                            <span class="stat-label">Progreso</span>
                        </div>
                    </div>
                </div>
                
                <div class="language-actions">
                    <button class="btn-action btn-view" onclick="AdminApp.viewLenguajeDetails(${lenguaje.idLenguaje})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="AdminApp.editLenguaje(${lenguaje.idLenguaje})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="AdminApp.deleteLenguaje(${lenguaje.idLenguaje})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
    },
    
    // Actualizar selects de lenguajes
    updateLenguajeSelects() {
        const selects = [
            document.getElementById('filtro-lenguaje'),
            document.getElementById('nivel-lenguaje')
        ];
        
        selects.forEach(select => {
            // Limpiar opciones existentes (excepto la primera en filtro)
            if (select.id === 'filtro-lenguaje') {
                select.innerHTML = '<option value="">Todos los lenguajes</option>';
            } else {
                select.innerHTML = '';
            }
            
            this.lenguajes.forEach(lenguaje => {
                const option = document.createElement('option');
                option.value = lenguaje.idLenguaje;
                option.textContent = lenguaje.nombre;
                select.appendChild(option);
            });
        });
    },
    
    // Cargar niveles
    async loadNiveles(idLenguaje = '') {
        try {
            let url = '../php/controllers/admin.php?action=obtener_niveles_admin';
            if (idLenguaje) {
                url += `&idLenguaje=${idLenguaje}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.niveles = data.niveles;
                this.renderNiveles();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al cargar niveles', 'error');
        }
    },
    
    // Renderizar niveles
    renderNiveles() {
        const tbody = document.getElementById('niveles-tabla');
        tbody.innerHTML = '';
        
        this.niveles.forEach(nivel => {
            const row = document.createElement('tr');
            const statusClass = nivel.estado == 0 ? 'status-unlocked' : 'status-locked';
            const statusText = nivel.estado == 0 ? 'Desbloqueado' : 'Bloqueado';
            
            row.innerHTML = `
                <td>${nivel.idNivel}</td>
                <td>${nivel.titulo}</td>
                <td>${nivel.nombreLenguaje}</td>
                <td>${this.formatTime(nivel.tiempoLimite)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${nivel.totalCompletados}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="AdminApp.viewNivel(${nivel.idNivel})" title="Ver código">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="AdminApp.editNivel(${nivel.idNivel})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="AdminApp.deleteNivel(${nivel.idNivel})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    },
    
    // Filtrar niveles
    filterNiveles(idLenguaje) {
        this.loadNiveles(idLenguaje);
    },
    
    // Mostrar modal de usuario
    showUsuarioModal(usuario = null) {
        const modal = document.getElementById('usuario-modal');
        const title = document.getElementById('usuario-modal-title');
        const form = document.getElementById('usuario-form');
        
        if (usuario) {
            title.textContent = 'Editar Usuario';
            document.getElementById('usuario-nombre').value = usuario.nombreUsuario;
            document.getElementById('usuario-correo').value = usuario.correo;
            document.getElementById('usuario-contrasena').value = '';
            document.getElementById('usuario-rol').value = usuario.idRol;
            document.getElementById('usuario-foto').value = usuario.foto;
            form.dataset.userId = usuario.idUsuario;
        } else {
            title.textContent = 'Nuevo Usuario';
            form.reset();
            delete form.dataset.userId;
        }
        
        modal.style.display = 'block';
    },
    
    // Mostrar modal de lenguaje
    showLenguajeModal(lenguaje = null) {
        const modal = document.getElementById('lenguaje-modal');
        const title = document.getElementById('lenguaje-modal-title');
        const form = document.getElementById('lenguaje-form');
        
        if (lenguaje) {
            title.textContent = 'Editar Lenguaje';
            document.getElementById('lenguaje-nombre').value = lenguaje.nombre;
            document.getElementById('lenguaje-foto').value = lenguaje.foto;
            form.dataset.languageId = lenguaje.idLenguaje;
        } else {
            title.textContent = 'Nuevo Lenguaje';
            form.reset();
            delete form.dataset.languageId;
        }
        
        modal.style.display = 'block';
    },
    
    // Mostrar modal de nivel
    showNivelModal(nivel = null) {
        const modal = document.getElementById('nivel-modal');
        const title = document.getElementById('nivel-modal-title');
        const form = document.getElementById('nivel-form');
        
        if (nivel) {
            title.textContent = 'Editar Nivel';
            document.getElementById('nivel-titulo').value = nivel.titulo;
            document.getElementById('nivel-lenguaje').value = nivel.idLenguaje;
            document.getElementById('nivel-descripcion').value = nivel.ayudaDescripcion;
            document.getElementById('nivel-tiempo').value = nivel.tiempoLimite;
            document.getElementById('nivel-codigo').value = nivel.codigo;
            document.getElementById('nivel-estado').value = nivel.estado;
            form.dataset.levelId = nivel.idNivel;
        } else {
            title.textContent = 'Nuevo Nivel';
            form.reset();
            delete form.dataset.levelId;
        }
        
        modal.style.display = 'block';
    },
    
    // Guardar usuario
    async saveUsuario() {
        const form = document.getElementById('usuario-form');
        const formData = new FormData(form);
        
        const isEdit = form.dataset.userId;
        if (isEdit) {
            formData.append('idUsuario', form.dataset.userId);
        }
        
        try {
            const action = isEdit ? 'editar_usuario' : 'crear_usuario';
            const response = await fetch(`../php/controllers/admin.php?action=${action}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                document.getElementById('usuario-modal').style.display = 'none';
                this.loadUsuarios();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al guardar usuario', 'error');
        }
    },
    
    // Guardar lenguaje
    async saveLenguaje() {
        const form = document.getElementById('lenguaje-form');
        const formData = new FormData(form);
        
        const isEdit = form.dataset.languageId;
        if (isEdit) {
            formData.append('idLenguaje', form.dataset.languageId);
        }
        
        try {
            const action = isEdit ? 'editar_lenguaje' : 'crear_lenguaje';
            const response = await fetch(`../php/controllers/admin.php?action=${action}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                document.getElementById('lenguaje-modal').style.display = 'none';
                this.loadLenguajes();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al guardar lenguaje', 'error');
        }
    },
    
    // Guardar nivel
    async saveNivel() {
        const form = document.getElementById('nivel-form');
        const formData = new FormData(form);
        
        const isEdit = form.dataset.levelId;
        if (isEdit) {
            formData.append('idNivel', form.dataset.levelId);
        }
        
        try {
            const action = isEdit ? 'editar_nivel' : 'crear_nivel';
            const response = await fetch(`../php/controllers/admin.php?action=${action}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                document.getElementById('nivel-modal').style.display = 'none';
                this.loadNiveles();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al guardar nivel', 'error');
        }
    },
    
    // Editar usuario
    editUsuario(idUsuario) {
        const usuario = this.usuarios.find(u => u.idUsuario == idUsuario);
        if (usuario) {
            this.showUsuarioModal(usuario);
        }
    },
    
    // Eliminar usuario
    async deleteUsuario(idUsuario) {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('idUsuario', idUsuario);
            
            const response = await fetch('../php/controllers/admin.php?action=eliminar_usuario', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                this.loadUsuarios();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al eliminar usuario', 'error');
        }
    },
    
    // Ver detalles de lenguaje
    viewLenguajeDetails(idLenguaje) {
        const lenguaje = this.lenguajes.find(l => l.idLenguaje == idLenguaje);
        if (!lenguaje) return;
        
        const totalNiveles = lenguaje.totalNiveles || 0;
        const totalCompletados = lenguaje.totalCompletados || 0;
        const porcentajeCompletado = totalNiveles > 0 ? Math.round((totalCompletados / totalNiveles) * 100) : 0;
        
        // Crear modal personalizado para mostrar detalles
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2><i class="fas fa-info-circle"></i> Detalles del Lenguaje</h2>
                    <span class="close">&times;</span>
                </div>
                
                <div class="language-details">
                    <div class="detail-header">
                        <img src="../assets/images/${lenguaje.foto}" alt="${lenguaje.nombre}" 
                             onerror="this.src='../assets/images/default.png'"
                             style="width: 100px; height: 100px; border-radius: 16px; object-fit: cover;">
                        <div>
                            <h3>${lenguaje.nombre}</h3>
                            <p style="color: #6c757d; margin: 0;">Lenguaje de Programación</p>
                        </div>
                    </div>
                    
                    <div class="detail-stats">
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fas fa-puzzle-piece"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">${totalNiveles}</span>
                                <span class="stat-label">Niveles Totales</span>
                            </div>
                        </div>
                        
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">${totalCompletados}</span>
                                <span class="stat-label">Completados</span>
                            </div>
                        </div>
                        
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">${porcentajeCompletado}%</span>
                                <span class="stat-label">Progreso</span>
                            </div>
                        </div>
                        
                        <div class="stat-box">
                            <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">ID: ${lenguaje.idLenguaje}</span>
                                <span class="stat-label">Identificador</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="btn btn-primary" onclick="AdminApp.showSection('niveles'); AdminApp.filterNiveles('${lenguaje.idLenguaje}'); this.closest('.modal').remove();">
                            <i class="fas fa-eye"></i> Ver Niveles
                        </button>
                        <button class="btn btn-secondary" onclick="AdminApp.editLenguaje(${lenguaje.idLenguaje}); this.closest('.modal').remove();">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar eventos
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        document.body.appendChild(modal);
    },
    
    // Editar lenguaje
    editLenguaje(idLenguaje) {
        const lenguaje = this.lenguajes.find(l => l.idLenguaje == idLenguaje);
        if (lenguaje) {
            this.showLenguajeModal(lenguaje);
        }
    },
    
    // Eliminar lenguaje
    async deleteLenguaje(idLenguaje) {
        if (!confirm('¿Estás seguro de que deseas eliminar este lenguaje?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('idLenguaje', idLenguaje);
            
            const response = await fetch('../php/controllers/admin.php?action=eliminar_lenguaje', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                this.loadLenguajes();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al eliminar lenguaje', 'error');
        }
    },
    
    // Ver código del nivel
    viewNivel(idNivel) {
        const nivel = this.niveles.find(n => n.idNivel == idNivel);
        if (nivel) {
            alert(`Código del nivel "${nivel.titulo}":\n\n${nivel.codigo}`);
        }
    },
    
    // Editar nivel
    editNivel(idNivel) {
        const nivel = this.niveles.find(n => n.idNivel == idNivel);
        if (nivel) {
            this.showNivelModal(nivel);
        }
    },
    
    // Eliminar nivel
    async deleteNivel(idNivel) {
        if (!confirm('¿Estás seguro de que deseas eliminar este nivel?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('idNivel', idNivel);
            
            const response = await fetch('../php/controllers/admin.php?action=eliminar_nivel', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification(data.message, 'success');
                this.loadNiveles();
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al eliminar nivel', 'error');
        }
    },
    
    // Cargar estadísticas
    async loadEstadisticas() {
        try {
            const response = await fetch('../php/controllers/admin.php?action=estadisticas_generales');
            const data = await response.json();
            
            if (data.success) {
                this.renderEstadisticas(data.estadisticas);
                this.updateStatsOverview(data.estadisticas.metricas_generales);
            } else {
                this.showNotification(data.error, 'error');
            }
        } catch (error) {
            this.showNotification('Error al cargar estadísticas', 'error');
        }
    },
    
    // Actualizar resumen de estadísticas
    updateStatsOverview(metricas) {
        if (metricas) {
            // Usar métricas reales de la base de datos
            document.getElementById('total-completados-stat').textContent = metricas.total_completados || 0;
            document.getElementById('promedio-estrellas-stat').textContent = metricas.promedio_estrellas || '0.0';
            document.getElementById('tiempo-promedio-stat').textContent = (metricas.tiempo_promedio || 0) + 's';
            document.getElementById('tasa-completado-stat').textContent = (metricas.tasa_completado || 0) + '%';
        }
    },
    
    // Renderizar estadísticas
    renderEstadisticas(estadisticas) {
        this.renderNivelesPopulares(estadisticas.niveles_populares || []);
        this.renderProgresoLenguajes(estadisticas.progreso_lenguajes || []);
        this.renderTopUsuarios(estadisticas.top_usuarios || []);
        this.renderActividadSemanal(estadisticas.actividad_semanal || []);
    },
    
    // Renderizar niveles populares
    renderNivelesPopulares(niveles) {
        const container = document.getElementById('chart-niveles');
        
        if (!niveles || niveles.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-bar"></i>
                    <h4>No hay datos disponibles</h4>
                    <p>Aún no se han registrado niveles jugados</p>
                </div>
            `;
            return;
        }
        
        const maxVeces = Math.max(...niveles.map(n => n.veces_jugado));
        
        container.innerHTML = `
            <ul class="stats-list">
                ${niveles.map((nivel, index) => `
                    <li class="stats-item">
                        <div class="stats-item-info">
                            <div class="stats-item-rank">${index + 1}</div>
                            <div class="stats-item-details">
                                <h4>${nivel.titulo}</h4>
                                <p>${nivel.lenguaje}</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(nivel.veces_jugado / maxVeces) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stats-item-value">
                            <span class="stats-value-number">${nivel.veces_jugado}</span>
                            <span class="stats-value-label">veces jugado</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    },
    
    // Renderizar progreso por lenguajes
    renderProgresoLenguajes(lenguajes) {
        const container = document.getElementById('chart-lenguajes');
        
        if (!lenguajes || lenguajes.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-code"></i>
                    <h4>No hay datos disponibles</h4>
                    <p>Aún no se han registrado completados por lenguaje</p>
                </div>
            `;
            return;
        }
        
        const maxCompletados = Math.max(...lenguajes.map(l => l.completados));
        
        container.innerHTML = `
            <ul class="stats-list">
                ${lenguajes.map((lenguaje, index) => `
                    <li class="stats-item">
                        <div class="stats-item-info">
                            <div class="stats-item-rank">${index + 1}</div>
                            <div class="stats-item-details">
                                <h4>${lenguaje.nombre}</h4>
                                <p>Lenguaje de programación</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(lenguaje.completados / maxCompletados) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stats-item-value">
                            <span class="stats-value-number">${lenguaje.completados}</span>
                            <span class="stats-value-label">completados</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    },
    
    // Renderizar top usuarios
    renderTopUsuarios(topUsuarios = []) {
        const container = document.getElementById('chart-usuarios');
        
        if (!topUsuarios || topUsuarios.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <h4>No hay datos de usuarios</h4>
                    <p>Aún no hay usuarios con niveles completados</p>
                </div>
            `;
            return;
        }
        
        const maxCompletados = Math.max(...topUsuarios.map(u => u.completados));
        
        container.innerHTML = `
            <ul class="stats-list">
                ${topUsuarios.map((usuario, index) => `
                    <li class="stats-item">
                        <div class="stats-item-info">
                            <div class="stats-item-rank">${index + 1}</div>
                            <div class="stats-item-details">
                                <h4>${usuario.nombreUsuario}</h4>
                                <p>${usuario.estrellas_totales} estrellas obtenidas</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(usuario.completados / maxCompletados) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stats-item-value">
                            <span class="stats-value-number">${usuario.completados}</span>
                            <span class="stats-value-label">completados</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    },
    
    // Renderizar actividad semanal
    renderActividadSemanal(actividadSemanal = []) {
        const container = document.getElementById('chart-actividad');
        
        if (!actividadSemanal || actividadSemanal.length === 0) {
            // Crear datos vacíos para los 7 días de la semana
            const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            actividadSemanal = diasSemana.map(dia => ({
                dia_semana: dia,
                completados: 0
            }));
        }
        
        const maxActividad = Math.max(...actividadSemanal.map(a => a.completados));
        const maxActividadDisplay = maxActividad > 0 ? maxActividad : 1; // Evitar división por 0
        
        container.innerHTML = `
            <ul class="stats-list">
                ${actividadSemanal.map(actividad => `
                    <li class="stats-item">
                        <div class="stats-item-info">
                            <div class="stats-item-details">
                                <h4>${actividad.dia_semana}</h4>
                                <p>Actividad del día</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(actividad.completados / maxActividadDisplay) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="stats-item-value">
                            <span class="stats-value-number">${actividad.completados}</span>
                            <span class="stats-value-label">completados</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    },
    
    // Logout
    async logout() {
        try {
            await fetch('../php/controllers/auth.php?action=logout');
            localStorage.removeItem('puzzleCodeUser');
            window.location.href = '../index.html';
        } catch (error) {
            this.showNotification('Error al cerrar sesión', 'error');
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
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Función global para cerrar modales
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});
