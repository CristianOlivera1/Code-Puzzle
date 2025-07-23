<?php
require_once '../config/database.php';

class Usuario {
    private $conn;
    private $table = 'Usuario';

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
        $this->foto = htmlspecialchars(strip_tags($this->foto));
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
}
?>
