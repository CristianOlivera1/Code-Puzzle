<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../models/Usuario.php';

$database = new Database();
$db = $database->connect();
$usuario = new Usuario($db);

$action = $_GET['action'] ?? '';

switch($action) {
    case 'login':
        login();
        break;
    case 'register':
        register();
        break;
    case 'logout':
        logout();
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function login() {
    global $usuario;
    
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';
    
    if (empty($correo) || empty($contrasena)) {
        echo json_encode(['error' => 'Correo y contraseña son requeridos']);
        return;
    }
    
    $result = $usuario->login($correo, $contrasena);
    
    if ($result) {
        $_SESSION['usuario'] = $result;
        echo json_encode([
            'success' => true,
            'usuario' => [
                'id' => $result['idUsuario'],
                'nombre' => $result['nombreUsuario'],
                'correo' => $result['correo'],
                'rol' => $result['nombreRol'],
                'foto' => $result['foto']
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Credenciales incorrectas']);
    }
}

function register() {
    global $usuario;
    
    $nombreUsuario = $_POST['nombreUsuario'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';
    $foto = $_POST['foto'] ?? 'default.png';
    
    if (empty($nombreUsuario) || empty($correo) || empty($contrasena)) {
        echo json_encode(['error' => 'Todos los campos son requeridos']);
        return;
    }
    
    $usuario->nombreUsuario = $nombreUsuario;
    $usuario->correo = $correo;
    $usuario->contrasena = $contrasena;
    $usuario->foto = $foto;
    $usuario->idRol = 2; // Rol de jugador por defecto
    
    if ($usuario->crear()) {
        echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente']);
    } else {
        echo json_encode(['error' => 'Error al registrar usuario. Es posible que el correo ya esté en uso.']);
    }
}

function logout() {
    if (isset($_SESSION['usuario'])) {
        global $usuario;
        $usuario->actualizarEstadoConexion($_SESSION['usuario']['idUsuario'], 0);
        session_destroy();
    }
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
}
?>
