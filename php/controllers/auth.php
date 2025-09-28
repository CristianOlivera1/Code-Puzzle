<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../models/Usuario.php';

$database = new Database();
$db = $database->connect();
$usuario = new Usuario($db);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        login();
        break;
    case 'register':
        register();
        break;
    case 'logout':
        logout();
        break;
    case 'googleAuth':
    case 'google_auth':
        googleAuth();
        break;
    case 'verify_google_token':
        verifyGoogleToken();
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function login()
{
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

function register()
{
    global $usuario;

    $nombreUsuario = $_POST['nombreUsuario'] ?? '';
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';
    $foto = $_POST['foto'] ?? ''; // Dejar vacío para generar automáticamente

    if (empty($nombreUsuario) || empty($correo) || empty($contrasena)) {
        echo json_encode(['error' => 'Todos los campos son requeridos']);
        return;
    }

    $usuario->nombreUsuario = $nombreUsuario;
    $usuario->correo = $correo;
    $usuario->contrasena = $contrasena;
    $usuario->foto = $foto; // Se generará automáticamente en el modelo
    $usuario->idRol = 2; // Rol de jugador por defecto

    if ($usuario->crear()) {
        echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente']);
    } else {
        echo json_encode(['error' => 'Error al registrar usuario. Es posible que el correo ya esté en uso.']);
    }
}

function logout()
{
    if (isset($_SESSION['usuario'])) {
        global $usuario;
        $usuario->actualizarEstadoConexion($_SESSION['usuario']['idUsuario'], 0);
        session_destroy();
    }
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
}

function googleAuth()
{
    // Cargar variables de entorno
    $env_path = __DIR__ . '/../../.env';

    // Debug: verificar si el archivo .env existe
    if (!file_exists($env_path)) {
        echo json_encode(['error' => 'Archivo .env no encontrado en: ' . $env_path]);
        return;
    }

    loadEnv($env_path);

    $client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? '';

    if (empty($client_id)) {
        echo json_encode([
            'error' => 'Configuración de Google OAuth no encontrada',
            'debug' => [
                'env_file_exists' => file_exists($env_path),
                'env_file_path' => $env_path,
                'client_id_set' => isset($_ENV['GOOGLE_CLIENT_ID']),
                'client_id_value' => $client_id,
                'env_vars' => array_keys($_ENV),
                'action_received' => $_GET['action'] ?? 'no_action'
            ]
        ]);
        return;
    }

    $redirect_uri = getRedirectUri();

    $params = [
        'client_id' => $client_id,
        'redirect_uri' => $redirect_uri,
        'scope' => 'email profile',
        'response_type' => 'code',
        'access_type' => 'online'
    ];

    $auth_url = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query($params);

    echo json_encode([
        'success' => true,
        'auth_url' => $auth_url
    ]);
}

function verifyGoogleToken()
{
    if (!isset($_GET['token'])) {
        echo json_encode(['error' => 'Token no proporcionado']);
        return;
    }

    $token = $_GET['token'];

    try {
        $data = json_decode(base64_decode($token), true);

        if (!$data || !isset($data['user']) || (time() - $data['timestamp']) > 300) { // 5 minutos de validez
            echo json_encode(['error' => 'Token inválido o expirado']);
            return;
        }

        // Verificar que el usuario existe en la base de datos
        global $usuario;
        $userExists = $usuario->obtenerPorId($data['user']['id']);

        if (!$userExists) {
            echo json_encode(['error' => 'Usuario no encontrado']);
            return;
        }

        // Actualizar sesión
        $_SESSION['usuario'] = $userExists;

        echo json_encode([
            'success' => true,
            'usuario' => [
                'id' => $userExists['idUsuario'],
                'nombre' => $userExists['nombreUsuario'],
                'correo' => $userExists['correo'],
                'rol' => $userExists['nombreRol'],
                'foto' => $userExists['foto']
            ],
            'isNewUser' => $data['isNewUser'] ?? false
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error al verificar token: ' . $e->getMessage()]);
    }
}

function loadEnv($path)
{
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

function getRedirectUri()
{
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];

    // Para desarrollo local
    if (strpos($host, 'localhost') !== false) {
        return $protocol . '://' . $host . '/puzzle/php/controllers/google.php?action=callback';
    }

    // Para producción
    return $protocol . '://' . $host . '/php/controllers/google.php?action=callback';
}
