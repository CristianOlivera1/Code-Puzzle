<?php
require_once '../config/database.php';

class Usuario {
    private $conn;
    private $table = 'usuario';

    public $idUsuario;
    public $idRol;
    public $nombreUsuario;
    public $correo;
    public $contrasena;
    public $foto;
    public $estadoConexion;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear usuario
    public function crear() {
        $query = "INSERT INTO " . $this->table . " 
                  SET nombreUsuario=:nombreUsuario, correo=:correo, contrasena=:contrasena, 
                      foto=:foto, idRol=:idRol";
        
        $stmt = $this->conn->prepare($query);
        
        // Limpiar datos
        $this->nombreUsuario = htmlspecialchars(strip_tags($this->nombreUsuario));
        $this->correo = htmlspecialchars(strip_tags($this->correo));
        $this->contrasena = password_hash($this->contrasena, PASSWORD_DEFAULT);
        
        // Generar avatar automático si no se proporciona una foto
        if (empty($this->foto) || $this->foto === 'default.png') {
            $this->foto = $this->generarAvatarAutomatico($this->nombreUsuario);
        } else {
            $this->foto = htmlspecialchars(strip_tags($this->foto));
        }
        
        $this->idRol = htmlspecialchars(strip_tags($this->idRol));
        
        // Bind parameters
        $stmt->bindParam(':nombreUsuario', $this->nombreUsuario);
        $stmt->bindParam(':correo', $this->correo);
        $stmt->bindParam(':contrasena', $this->contrasena);
        $stmt->bindParam(':foto', $this->foto);
        $stmt->bindParam(':idRol', $this->idRol);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Login
    public function login($correo, $contrasena) {
        $query = "SELECT u.*, r.nombre as nombreRol 
                  FROM " . $this->table . " u 
                  INNER JOIN rol r ON u.idRol = r.idRol 
                  WHERE u.correo = :correo";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($usuario && password_verify($contrasena, $usuario['contrasena'])) {
            // Actualizar estado de conexión
            $this->actualizarEstadoConexion($usuario['idUsuario'], 1);
            return $usuario;
        }
        return false;
    }

    // Actualizar estado de conexión
    public function actualizarEstadoConexion($idUsuario, $estado) {
        $query = "UPDATE " . $this->table . " SET estadoConexion = :estado WHERE idUsuario = :idUsuario";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':estado', $estado);
        $stmt->bindParam(':idUsuario', $idUsuario);
        return $stmt->execute();
    }

    // Obtener usuario por ID
    public function obtenerPorId($id) {
        $query = "SELECT u.*, r.nombre as nombreRol 
                  FROM " . $this->table . " u 
                  INNER JOIN rol r ON u.idRol = r.idRol 
                  WHERE u.idUsuario = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por correo (para Google OAuth)
    public function obtenerPorCorreo($correo) {
        $query = "SELECT u.*, r.nombre as nombreRol 
                  FROM " . $this->table . " u 
                  INNER JOIN rol r ON u.idRol = r.idRol 
                  WHERE u.correo = :correo";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Crear usuario con Google OAuth (sin contraseña)
    public function crearConGoogle($nombreUsuario, $correo, $foto) {
        $query = "INSERT INTO " . $this->table . " 
                  SET nombreUsuario=:nombreUsuario, correo=:correo, contrasena='', 
                      foto=:foto, idRol=2, estadoConexion=1";
        
        $stmt = $this->conn->prepare($query);
        
        // Limpiar datos
        $nombreUsuario = htmlspecialchars(strip_tags($nombreUsuario));
        $correo = htmlspecialchars(strip_tags($correo));
        $foto = htmlspecialchars(strip_tags($foto));
        
        // Bind parameters
        $stmt->bindParam(':nombreUsuario', $nombreUsuario);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':foto', $foto);
        
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Actualizar información de Google OAuth
    public function actualizarInfoGoogle($idUsuario, $nombreUsuario, $foto) {
        $query = "UPDATE " . $this->table . " 
                  SET nombreUsuario=:nombreUsuario, foto=:foto, estadoConexion=1 
                  WHERE idUsuario=:idUsuario";
        
        $stmt = $this->conn->prepare($query);
        
        // Limpiar datos
        $nombreUsuario = htmlspecialchars(strip_tags($nombreUsuario));
        $foto = htmlspecialchars(strip_tags($foto));
        
        // Bind parameters
        $stmt->bindParam(':nombreUsuario', $nombreUsuario);
        $stmt->bindParam(':foto', $foto);
        $stmt->bindParam(':idUsuario', $idUsuario);
        
        return $stmt->execute();
    }

    // Generar avatar automático usando UI Avatars API
    private function generarAvatarAutomatico($nombreUsuario) {
        // Limpiar el nombre para la URL
        $nombreLimpio = urlencode($nombreUsuario);
        
        // Array de colores atractivos para los fondos
        $coloresFondo = [
            '4F46E5', // Índigo
            '7C3AED', // Violeta
            'EC4899', // Rosa
            'EF4444', // Rojo
            'F59E0B', // Ámbar
            '10B981', // Esmeralda
            '3B82F6', // Azul
            '8B5CF6', // Púrpura
            'F97316', // Naranja
            '06B6D4'  // Cian
        ];
        
        // Seleccionar color basado en el hash del nombre de usuario
        $hashIndex = abs(crc32($nombreUsuario)) % count($coloresFondo);
        $colorFondo = $coloresFondo[$hashIndex];
        
        // Configuración del avatar
        $parametros = [
            'name' => $nombreLimpio,
            'size' => '200',
            'background' => $colorFondo,
            'color' => 'ffffff', // Texto blanco
            'format' => 'png',
            'rounded' => 'true',
            'bold' => 'true',
            'font-size' => '0.5' // Tamaño de fuente relativo
        ];
        
        // Construir URL
        $avatarUrl = 'https://ui-avatars.com/api/?' . http_build_query($parametros);
        
        return $avatarUrl;
    }
}
?>
