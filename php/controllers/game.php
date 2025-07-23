<?php
session_start();
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../models/Nivel.php';
require_once '../models/ProgresoUsuario.php';

$database = new Database();
$db = $database->connect();
$nivel = new Nivel($db);
$progreso = new ProgresoUsuario($db);

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch($action) {
    case 'obtener_niveles':
        obtenerNiveles();
        break;
    case 'obtener_nivel':
        obtenerNivel();
        break;
    case 'verificar_solucion':
        verificarSolucion();
        break;
    case 'verificar_linea':
        verificarLinea();
        break;
    case 'debug_nivel':
        debugNivel();
        break;
    case 'obtener_progreso':
        obtenerProgreso();
        break;
    case 'desbloquear_nivel':
        desbloquearNivel();
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function obtenerNiveles() {
    global $nivel;
    
    $idLenguaje = $_GET['idLenguaje'] ?? null;
    
    if ($idLenguaje) {
        $niveles = $nivel->obtenerPorLenguaje($idLenguaje);
    } else {
        $niveles = $nivel->obtenerTodos();
    }
    
    echo json_encode(['niveles' => $niveles]);
}

function obtenerNivel() {
    global $nivel;
    
    $idNivel = $_GET['idNivel'] ?? '';
    
    if (empty($idNivel)) {
        echo json_encode(['error' => 'ID de nivel requerido']);
        return;
    }
    
    $nivelData = $nivel->obtenerPorId($idNivel);
    
    if ($nivelData) {
        // Desordenar las líneas de código
        $lineasDesordenadas = $nivel->desordenarCodigo($nivelData['codigo']);
        
        $nivelData['lineasDesordenadas'] = $lineasDesordenadas;
        unset($nivelData['codigo']); // No enviar el código correcto al frontend
        
        echo json_encode(['nivel' => $nivelData]);
    } else {
        echo json_encode(['error' => 'Nivel no encontrado']);
    }
}

function verificarSolucion() {
    global $nivel, $progreso;
    
    if (!isset($_SESSION['usuario'])) {
        echo json_encode(['error' => 'Usuario no autenticado']);
        return;
    }
    
    $idNivel = $_POST['idNivel'] ?? '';
    $solucionJson = $_POST['solucion'] ?? '';
    $tiempoSegundos = $_POST['tiempoSegundos'] ?? 0;
    
    if (empty($idNivel) || empty($solucionJson)) {
        echo json_encode(['error' => 'Datos incompletos']);
        return;
    }
    
    // Decodificar el JSON de la solución
    $solucion = json_decode($solucionJson, true);
    
    if (!is_array($solucion)) {
        echo json_encode(['error' => 'Formato de solución inválido']);
        return;
    }
    
    $nivelData = $nivel->obtenerPorId($idNivel);
    
    if (!$nivelData) {
        echo json_encode(['error' => 'Nivel no encontrado']);
        return;
    }
    
    $esCorrecto = $nivel->verificarOrden($nivelData['codigo'], $solucion);
    
    if ($esCorrecto) {
        // Calcular estrellas basado en el tiempo
        $estrellas = $progreso->calcularEstrellas($tiempoSegundos, $nivelData['tiempoLimite']);
        
        // Guardar progreso
        $progreso->idUsuario = $_SESSION['usuario']['idUsuario'];
        $progreso->idNivel = $idNivel;
        $progreso->estrellas = $estrellas;
        $progreso->tiempoSegundos = $tiempoSegundos;
        
        $progreso->guardarProgreso();
        
        echo json_encode([
            'correcto' => true,
            'estrellas' => $estrellas,
            'tiempo' => $tiempoSegundos,
            'message' => '¡Felicidades! Nivel completado correctamente'
        ]);
    } else {
        echo json_encode([
            'correcto' => false,
            'message' => 'El orden no es correcto. ¡Inténtalo de nuevo!'
        ]);
    }
}

function verificarLinea() {
    global $nivel;
    
    if (!isset($_SESSION['usuario'])) {
        echo json_encode(['success' => false, 'error' => 'Usuario no autenticado']);
        return;
    }
    
    $idNivel = $_POST['idNivel'] ?? '';
    $posicion = $_POST['posicion'] ?? -1;
    $lineaTexto = $_POST['linea'] ?? '';
    
    if (empty($idNivel) || $posicion < 0 || empty($lineaTexto)) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
        return;
    }
    
    $nivelData = $nivel->obtenerPorId($idNivel);
    
    if (!$nivelData) {
        echo json_encode(['success' => false, 'error' => 'Nivel no encontrado']);
        return;
    }
    
    $esCorrecta = $nivel->verificarLineaEnPosicion($nivelData['codigo'], $posicion, $lineaTexto);
    
    echo json_encode([
        'success' => true,
        'correcta' => $esCorrecta,
        'posicion' => $posicion,
        'mensaje' => $esCorrecta ? '✅ ¡Correcto!' : '❌ Esta línea no va aquí'
    ]);
}

function obtenerProgreso() {
    global $progreso;
    
    if (!isset($_SESSION['usuario'])) {
        echo json_encode(['error' => 'Usuario no autenticado']);
        return;
    }
    
    $progresoUsuario = $progreso->obtenerProgresoUsuario($_SESSION['usuario']['idUsuario']);
    echo json_encode(['progreso' => $progresoUsuario]);
}

function desbloquearNivel() {
    global $db;
    
    if (!isset($_SESSION['usuario'])) {
        echo json_encode(['error' => 'Usuario no autenticado']);
        return;
    }
    
    $idNivel = $_POST['idNivel'] ?? '';
    
    if (empty($idNivel)) {
        echo json_encode(['error' => 'ID de nivel requerido']);
        return;
    }
    
    try {
        // Actualizar el estado del nivel para desbloquearlo
        $query = "UPDATE Nivel SET estado = 0 WHERE idNivel = :idNivel";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':idNivel', $idNivel);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Nivel desbloqueado correctamente'
            ]);
        } else {
            echo json_encode(['error' => 'Error al desbloquear nivel']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
    }
}

function debugNivel() {
    global $nivel;
    
    $idNivel = $_GET['idNivel'] ?? '';
    
    if (empty($idNivel)) {
        echo json_encode(['error' => 'ID de nivel requerido']);
        return;
    }
    
    $nivelData = $nivel->obtenerPorId($idNivel);
    
    if (!$nivelData) {
        echo json_encode(['error' => 'Nivel no encontrado']);
        return;
    }
    
    // Procesar líneas como lo hace la verificación
    $codigo = $nivelData['codigo'];
    $lineasOriginales = $nivel->obtenerLineasLimpias($codigo);
    
    echo json_encode([
        'nivel_id' => $idNivel,
        'titulo' => $nivelData['titulo'],
        'codigo_original' => $codigo,
        'lineas_procesadas' => $lineasOriginales,
        'total_lineas' => count($lineasOriginales)
    ]);
}
?>
