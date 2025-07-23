<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../models/Usuario.php';
require_once '../models/ProgresoUsuario.php';

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['usuario'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$database = new Database();
$db = $database->connect();
$usuario = new Usuario($db);
$progreso = new ProgresoUsuario($db);

$action = $_GET['action'] ?? '';

switch($action) {
    case 'get_profile_data':
        getProfileData();
        break;
    case 'update_avatar':
        updateAvatar();
        break;
    case 'change_password':
        changePassword();
        break;
    case 'get_progress_by_language':
        getProgressByLanguage();
        break;
    case 'get_recent_achievements':
        getRecentAchievements();
        break;
    case 'export_progress':
        exportProgress();
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function getProfileData() {
    global $usuario, $progreso;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        
        // Obtener datos del usuario
        $userData = $usuario->obtenerPorId($userId);
        
        if (!$userData) {
            echo json_encode(['error' => 'Usuario no encontrado']);
            return;
        }
        
        // Obtener estadísticas del usuario
        $stats = getUserStats($userId);
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $userData['idUsuario'],
                'nombre' => $userData['nombreUsuario'],
                'correo' => $userData['correo'],
                'foto' => $userData['foto'],
                'rol' => $userData['nombreRol']
            ],
            'stats' => $stats
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al obtener datos del perfil: ' . $e->getMessage()]);
    }
}

function getUserStats($userId) {
    global $db;
    
    try {
        // Total de niveles completados
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM ProgresoUsuario WHERE idUsuario = ?");
        $stmt->execute([$userId]);
        $totalCompleted = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Total de estrellas
        $stmt = $db->prepare("SELECT SUM(estrellas) as total FROM ProgresoUsuario WHERE idUsuario = ?");
        $stmt->execute([$userId]);
        $totalStars = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
        
        // Mejor tiempo
        $stmt = $db->prepare("SELECT MIN(tiempoSegundos) as mejor FROM ProgresoUsuario WHERE idUsuario = ?");
        $stmt->execute([$userId]);
        $bestTime = $stmt->fetch(PDO::FETCH_ASSOC)['mejor'];
        
        return [
            'totalCompleted' => $totalCompleted,
            'totalStars' => $totalStars,
            'bestTime' => $bestTime
        ];
        
    } catch (Exception $e) {
        return [
            'totalCompleted' => 0,
            'totalStars' => 0,
            'bestTime' => null
        ];
    }
}

function updateAvatar() {
    global $db;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        $newAvatar = $_POST['avatar'] ?? '';
        
        if (empty($newAvatar)) {
            echo json_encode(['error' => 'Avatar requerido']);
            return;
        }
        
        // Lista de avatares válidos
        $validAvatars = [
            'default.png',
            'avatar1.png',
            'avatar2.png',
            'avatar3.png',
            'avatar4.png',
            'avatar5.png',
            'admin.png',
            'cpp.png',
            'java.png',
            'python.png',
            'js.png',
            'html.png'
        ];
        
        if (!in_array($newAvatar, $validAvatars)) {
            echo json_encode(['error' => 'Avatar no válido']);
            return;
        }
        
        $stmt = $db->prepare("UPDATE Usuario SET foto = ? WHERE idUsuario = ?");
        
        if ($stmt->execute([$newAvatar, $userId])) {
            // Actualizar sesión
            $_SESSION['usuario']['foto'] = $newAvatar;
            
            echo json_encode([
                'success' => true,
                'message' => 'Avatar actualizado correctamente',
                'newAvatar' => $newAvatar
            ]);
        } else {
            echo json_encode(['error' => 'Error al actualizar avatar']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al actualizar avatar: ' . $e->getMessage()]);
    }
}

function changePassword() {
    global $db;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        $currentPassword = $_POST['currentPassword'] ?? '';
        $newPassword = $_POST['newPassword'] ?? '';
        $confirmPassword = $_POST['confirmPassword'] ?? '';
        
        if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
            echo json_encode(['error' => 'Todos los campos son requeridos']);
            return;
        }
        
        if ($newPassword !== $confirmPassword) {
            echo json_encode(['error' => 'Las contraseñas no coinciden']);
            return;
        }
        
        if (strlen($newPassword) < 6) {
            echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
            return;
        }
        
        // Verificar contraseña actual
        $stmt = $db->prepare("SELECT contrasena FROM Usuario WHERE idUsuario = ?");
        $stmt->execute([$userId]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!password_verify($currentPassword, $userData['contrasena'])) {
            echo json_encode(['error' => 'La contraseña actual es incorrecta']);
            return;
        }
        
        // Actualizar contraseña
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $db->prepare("UPDATE Usuario SET contrasena = ? WHERE idUsuario = ?");
        
        if ($stmt->execute([$hashedPassword, $userId])) {
            echo json_encode([
                'success' => true,
                'message' => 'Contraseña actualizada correctamente'
            ]);
        } else {
            echo json_encode(['error' => 'Error al actualizar contraseña']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al cambiar contraseña: ' . $e->getMessage()]);
    }
}

function getProgressByLanguage() {
    global $db;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        
        $stmt = $db->prepare("
            SELECT 
                l.idLenguaje,
                l.nombre as nombreLenguaje,
                l.foto as fotoLenguaje,
                COUNT(DISTINCT n.idNivel) as totalNiveles,
                COUNT(DISTINCT p.idNivel) as nivelesCompletados,
                COALESCE(SUM(p.estrellas), 0) as estrellasObtenidas,
                COALESCE(AVG(p.tiempoSegundos), 0) as tiempoPromedio
            FROM Lenguaje l
            LEFT JOIN Nivel n ON l.idLenguaje = n.idLenguaje
            LEFT JOIN ProgresoUsuario p ON n.idNivel = p.idNivel AND p.idUsuario = ?
            GROUP BY l.idLenguaje, l.nombre, l.foto
            ORDER BY l.nombre
        ");
        
        $stmt->execute([$userId]);
        $languages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calcular porcentajes
        foreach ($languages as &$language) {
            $language['porcentajeCompletado'] = $language['totalNiveles'] > 0 
                ? round(($language['nivelesCompletados'] / $language['totalNiveles']) * 100, 1)
                : 0;
            $language['estrellasMaximas'] = $language['totalNiveles'] * 3;
        }
        
        echo json_encode([
            'success' => true,
            'languages' => $languages
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al obtener progreso por lenguaje: ' . $e->getMessage()]);
    }
}

function getRecentAchievements() {
    global $db;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        
        $stmt = $db->prepare("
            SELECT 
                n.titulo as nivelTitulo,
                l.nombre as lenguaje,
                p.estrellas,
                p.tiempoSegundos,
                p.idProgresoUsuario as timestamp
            FROM ProgresoUsuario p
            INNER JOIN Nivel n ON p.idNivel = n.idNivel
            INNER JOIN Lenguaje l ON n.idLenguaje = l.idLenguaje
            WHERE p.idUsuario = ?
            ORDER BY p.idProgresoUsuario DESC
            LIMIT 10
        ");
        
        $stmt->execute([$userId]);
        $achievements = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Procesar logros para agregar tipos y descripciones
        foreach ($achievements as &$achievement) {
            $achievement['tipo'] = getAchievementType($achievement['estrellas']);
            $achievement['descripcion'] = "Completaste '{$achievement['nivelTitulo']}' en {$achievement['lenguaje']}";
            $achievement['tiempoFormateado'] = formatTime($achievement['tiempoSegundos']);
        }
        
        echo json_encode([
            'success' => true,
            'achievements' => $achievements
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al obtener logros recientes: ' . $e->getMessage()]);
    }
}

function getAchievementType($stars) {
    switch ($stars) {
        case 3:
            return 'gold';
        case 2:
            return 'silver';
        case 1:
            return 'bronze';
        default:
            return 'bronze';
    }
}

function formatTime($seconds) {
    $minutes = floor($seconds / 60);
    $remainingSeconds = $seconds % 60;
    return sprintf('%d:%02d', $minutes, $remainingSeconds);
}

function exportProgress() {
    global $db;
    
    try {
        $userId = $_SESSION['usuario']['idUsuario'];
        
        // Obtener todo el progreso del usuario
        $stmt = $db->prepare("
            SELECT 
                u.nombreUsuario,
                u.correo,
                l.nombre as lenguaje,
                n.titulo as nivel,
                n.ayudaDescripcion,
                p.estrellas,
                p.tiempoSegundos
            FROM ProgresoUsuario p
            INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
            INNER JOIN Nivel n ON p.idNivel = n.idNivel
            INNER JOIN Lenguaje l ON n.idLenguaje = l.idLenguaje
            WHERE p.idUsuario = ?
            ORDER BY l.nombre, n.titulo
        ");
        
        $stmt->execute([$userId]);
        $progress = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Preparar datos para exportación
        $exportData = [
            'usuario' => $progress[0]['nombreUsuario'] ?? 'Usuario',
            'correo' => $progress[0]['correo'] ?? '',
            'fechaExportacion' => date('Y-m-d H:i:s'),
            'progreso' => $progress
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $exportData
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al exportar progreso: ' . $e->getMessage()]);
    }
}
?>
