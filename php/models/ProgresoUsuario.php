<?php
require_once '../config/database.php';

class ProgresoUsuario {
    private $conn;
    private $table = 'progresousuario';

    public $idProgresoUsuario;
    public $idUsuario;
    public $idNivel;
    public $estrellas;
    public $tiempoSegundos;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Guardar progreso
    public function guardarProgreso() {
        // Verificar si ya existe progreso para este usuario y nivel
        $query = "SELECT idProgresoUsuario FROM " . $this->table . " 
                  WHERE idUsuario = :idUsuario AND idNivel = :idNivel";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idUsuario', $this->idUsuario);
        $stmt->bindParam(':idNivel', $this->idNivel);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            // Actualizar progreso existente solo si es mejor
            $query = "UPDATE " . $this->table . " 
                      SET estrellas = GREATEST(estrellas, :estrellas), 
                          tiempoSegundos = LEAST(tiempoSegundos, :tiempoSegundos) 
                      WHERE idUsuario = :idUsuario AND idNivel = :idNivel";
        } else {
            // Crear nuevo progreso
            $query = "INSERT INTO " . $this->table . " 
                      SET idUsuario=:idUsuario, idNivel=:idNivel, 
                          estrellas=:estrellas, tiempoSegundos=:tiempoSegundos";
        }
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idUsuario', $this->idUsuario);
        $stmt->bindParam(':idNivel', $this->idNivel);
        $stmt->bindParam(':estrellas', $this->estrellas);
        $stmt->bindParam(':tiempoSegundos', $this->tiempoSegundos);
        
        return $stmt->execute();
    }

    // Obtener progreso del usuario
    public function obtenerProgresoUsuario($idUsuario) {
        $query = "SELECT p.*, n.titulo, n.idLenguaje, l.nombre as nombreLenguaje 
                  FROM " . $this->table . " p 
                  INNER JOIN nivel n ON p.idNivel = n.idNivel 
                  INNER JOIN lenguaje l ON n.idLenguaje = l.idLenguaje 
                  WHERE p.idUsuario = :idUsuario 
                  ORDER BY l.idLenguaje, n.idNivel";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idUsuario', $idUsuario);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Calcular estrellas basado en tiempo
    public function calcularEstrellas($tiempoSegundos, $tiempoLimite) {
        $porcentajeTiempo = ($tiempoSegundos / $tiempoLimite) * 100;
        
        if ($porcentajeTiempo <= 50) {
            return 3; // 3 estrellas
        } elseif ($porcentajeTiempo <= 75) {
            return 2; // 2 estrellas
        } else {
            return 1; // 1 estrella
        }
    }
}
?>
