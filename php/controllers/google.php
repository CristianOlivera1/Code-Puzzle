<?php
session_start();

// NO establecer header JSON aquí porque podríamos enviar HTML más tarde

// Cargar variables de entorno
function loadEnv($path)
{
    if (!file_exists($path)) {
        throw new Exception("Archivo .env no encontrado en: $path");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

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

// Cargar el archivo .env
try {
    loadEnv(__DIR__ . '/../../.env');
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error cargando configuración: ' . $e->getMessage()]);
    exit;
}

require_once '../config/database.php';
require_once '../models/Usuario.php';

$database = new Database();
$db = $database->connect();
$usuario = new Usuario($db);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'callback':
        handleGoogleCallback();
        break;
    case 'auth':
        header('Content-Type: application/json');
        initiateGoogleAuth();
        break;
    default:
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function initiateGoogleAuth()
{
    $client_id = $_ENV['GOOGLE_CLIENT_ID'];
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

function handleGoogleCallback()
{
    if (!isset($_GET['code'])) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Código de autorización no recibido']);
        return;
    }

    $code = $_GET['code'];
    $client_id = $_ENV['GOOGLE_CLIENT_ID'];
    $client_secret = $_ENV['GOOGLE_CLIENT_SECRET'];
    $redirect_uri = getRedirectUri();

    // Solicitar el token de acceso
    $url = 'https://oauth2.googleapis.com/token';
    $data = [
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code',
        'code' => $code,
    ];

    $options = [
        'http' => [
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data),
        ],
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error al comunicarse con Google OAuth']);
        return;
    }

    $response = json_decode($result, true);

    if (!isset($response['access_token'])) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'No se pudo obtener el token de acceso']);
        return;
    }

    $access_token = $response['access_token'];

    // Obtener la información del usuario
    $user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    $user_info_options = [
        'http' => [
            'header' => "Authorization: Bearer $access_token\r\n",
            'method' => 'GET',
        ],
    ];

    $user_info_context = stream_context_create($user_info_options);
    $user_info_result = file_get_contents($user_info_url, false, $user_info_context);

    if ($user_info_result === FALSE) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error al obtener información del usuario']);
        return;
    }

    $user_info = json_decode($user_info_result, true);

    if (!$user_info) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'No se pudo obtener la información del usuario']);
        return;
    }

    // Procesar los datos del usuario
    $email = $user_info['email'];
    $name = $user_info['name']; // Nombre + Apellido de Google
    $picture = $user_info['picture'] ?? 'default.png';

    try {
        // Verificar si el usuario ya existe
        $existingUser = checkUserExists($email);

        if ($existingUser) {
            // Usuario existe, actualizar información y hacer login
            updateUserGoogleInfo($existingUser['idUsuario'], $name, $picture);
            $userData = getUserById($existingUser['idUsuario']);

            $_SESSION['usuario'] = $userData;

            // Redirigir con éxito
            redirectWithSuccess($userData, false); // false = login
        } else {
            // Usuario no existe, registrarlo
            $userId = createGoogleUser($name, $email, $picture);

            if ($userId) {
                $userData = getUserById($userId);
                $_SESSION['usuario'] = $userData;

                // Redirigir con éxito
                redirectWithSuccess($userData, true); // true = registro
            } else {
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Error al crear el usuario']);
            }
        }
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Error en el proceso: ' . $e->getMessage()]);
    }
}

function checkUserExists($email)
{
    global $db;

    $query = "SELECT * FROM usuario WHERE correo = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createGoogleUser($name, $email, $picture)
{
    global $db;

    $query = "INSERT INTO usuario (nombreUsuario, correo, contrasena, foto, idRol, estadoConexion) 
              VALUES (:nombre, :correo, '', :foto, 2, 1)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':nombre', $name);
    $stmt->bindParam(':correo', $email);
    $stmt->bindParam(':foto', $picture);

    if ($stmt->execute()) {
        return $db->lastInsertId();
    }

    return false;
}

function updateUserGoogleInfo($userId, $name, $picture)
{
    global $db;

    $query = "UPDATE usuario SET nombreUsuario = :nombre, foto = :foto, estadoConexion = 1 
              WHERE idUsuario = :userId";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':nombre', $name);
    $stmt->bindParam(':foto', $picture);
    $stmt->bindParam(':userId', $userId);

    return $stmt->execute();
}

function getUserById($userId)
{
    global $db;

    $query = "SELECT u.*, r.nombre as nombreRol 
              FROM usuario u 
              INNER JOIN rol r ON u.idRol = r.idRol 
              WHERE u.idUsuario = :userId";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getRedirectUri()
{
    // Determinar la URI de redirección basada en el entorno
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];

    // Para desarrollo local
    if (strpos($host, 'localhost') !== false) {
        return $protocol . '://' . $host . '/puzzle/php/controllers/google.php?action=callback';
    }

    // Para producción, ajustar según tu dominio
    return $protocol . '://' . $host . '/php/controllers/google.php?action=callback';
}

function redirectWithSuccess($userData, $isNewUser)
{
    $userResponse = [
        'id' => $userData['idUsuario'],
        'nombre' => $userData['nombreUsuario'],
        'correo' => $userData['correo'],
        'rol' => $userData['nombreRol'],
        'foto' => $userData['foto']
    ];

    // Crear un token temporal para pasar los datos de forma segura
    $token = base64_encode(json_encode([
        'success' => true,
        'user' => $userResponse,
        'isNewUser' => $isNewUser,
        'timestamp' => time()
    ]));

    // En lugar de redirigir, mostrar una página que cierre la ventana popup
?>
    <!DOCTYPE html>
    <html>

    <head>
        <title>Autenticación exitosa</title>
        <meta charset="UTF-8">
    </head>

    <body>
        <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
            <h3>✅ Autenticación exitosa</h3>
            <p>Esta ventana se cerrará automáticamente...</p>
        </div>

        <script>
            console.log('Callback ejecutándose...');

            // Función para enviar mensaje y cerrar
            function sendMessageAndClose() {
                try {
                    if (window.opener && !window.opener.closed) {
                        console.log('Enviando mensaje a ventana padre...');
                        window.opener.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            token: '<?php echo $token; ?>'
                        }, window.location.origin);

                        // Esperar un poco antes de cerrar para asegurar que el mensaje se envíe
                        setTimeout(() => {
                            console.log('Cerrando ventana popup...');
                            window.close();
                        }, 100);
                    } else {
                        console.log('No hay ventana padre, redirigiendo...');
                        // Si no hay ventana padre, redirigir normalmente
                        window.location.href = '<?php echo "http" . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 's' : '') . "://" . $_SERVER['HTTP_HOST'] . "/puzzle/?google_auth=" . $token; ?>';
                    }
                } catch (error) {
                    console.error('Error en callback:', error);
                    // En caso de error, redirigir
                    window.location.href = '<?php echo "http" . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 's' : '') . "://" . $_SERVER['HTTP_HOST'] . "/puzzle/?google_auth=" . $token; ?>';
                }
            }

            // Ejecutar cuando el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', sendMessageAndClose);
            } else {
                sendMessageAndClose();
            }
        </script>
    </body>

    </html>
<?php
    exit;
}
?>