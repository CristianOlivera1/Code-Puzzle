<?php
require_once '../config/database.php';

class Nivel
{
    private $conn;
    private $table = 'nivel';

    public $idNivel;
    public $idLenguaje;
    public $titulo;
    public $ayudaDescripcion;
    public $tiempoLimite;
    public $codigo;
    public $estado;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Obtener todos los niveles
    public function obtenerTodos()
    {
        $query = "SELECT n.*, l.nombre as nombreLenguaje, l.foto as fotoLenguaje 
                  FROM " . $this->table . " n 
                  INNER JOIN lenguaje l ON n.idLenguaje = l.idLenguaje 
                  ORDER BY n.idLenguaje, n.idNivel";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener niveles por lenguaje
    public function obtenerPorLenguaje($idLenguaje)
    {
        $query = "SELECT n.*, l.nombre as nombreLenguaje, l.foto as fotoLenguaje 
                  FROM " . $this->table . " n 
                  INNER JOIN lenguaje l ON n.idLenguaje = l.idLenguaje 
                  WHERE n.idLenguaje = :idLenguaje 
                  ORDER BY n.idNivel";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idLenguaje', $idLenguaje);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener nivel por ID
    public function obtenerPorId($id)
    {
        $query = "SELECT n.*, l.nombre as nombreLenguaje, l.foto as fotoLenguaje 
                  FROM " . $this->table . " n 
                  INNER JOIN lenguaje l ON n.idLenguaje = l.idLenguaje 
                  WHERE n.idNivel = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Desordenar código para el juego
    public function desordenarCodigo($codigo)
    {
        // Usar el mismo procesamiento que verificarOrden
        $lineas = array_map('trim', explode("\n", trim($codigo)));

        // Filtrar líneas vacías
        $lineas = array_filter($lineas, function ($linea) {
            return !empty($linea);
        });

        // Reindexar el array
        $lineas = array_values($lineas);

        // Desordenar
        shuffle($lineas);
        return $lineas;
    }

    // Verificar si el código está correctamente ordenado
    public function verificarOrden($codigoOriginal, $codigoOrdenado)
    {
        // Dividir el código original en líneas y limpiar espacios
        $lineasOriginales = array_map('trim', explode("\n", trim($codigoOriginal)));

        // Limpiar las líneas ordenadas
        $lineasOrdenadas = array_map('trim', $codigoOrdenado);

        // Filtrar líneas vacías de ambos arrays
        $lineasOriginales = array_filter($lineasOriginales, function ($linea) {
            return !empty($linea);
        });

        $lineasOrdenadas = array_filter($lineasOrdenadas, function ($linea) {
            return !empty($linea);
        });

        // Reindexar arrays para comparación correcta
        $lineasOriginales = array_values($lineasOriginales);
        $lineasOrdenadas = array_values($lineasOrdenadas);

        // Verificar que tengan la misma cantidad de líneas
        if (count($lineasOriginales) !== count($lineasOrdenadas)) {
            return false;
        }

        // Comparar línea por línea
        for ($i = 0; $i < count($lineasOriginales); $i++) {
            if ($lineasOriginales[$i] !== $lineasOrdenadas[$i]) {
                return false;
            }
        }

        return true;
    }
}
