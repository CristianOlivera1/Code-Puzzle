<?php
// Script para insertar datos de prueba en la base de datos

require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "Insertando datos de prueba...\n";
    
    // Insertar algunos niveles completados de prueba si no existen
    $query = "INSERT INTO ProgresoUsuario (idUsuario, idNivel, estrellas, tiempoSegundos) 
              SELECT u.idUsuario, n.idNivel, 
                     CASE 
                         WHEN RAND() > 0.7 THEN 3
                         WHEN RAND() > 0.4 THEN 2
                         ELSE 1
                     END as estrellas,
                     FLOOR(60 + RAND() * 240) as tiempoSegundos
              FROM Usuario u 
              CROSS JOIN Nivel n 
              INNER JOIN rol r ON u.idRol = r.idRol
              WHERE r.nombre = 'Jugador' 
              AND NOT EXISTS (
                  SELECT 1 FROM ProgresoUsuario p 
                  WHERE p.idUsuario = u.idUsuario AND p.idNivel = n.idNivel
              )
              AND RAND() > 0.3
              ORDER BY RAND()
              LIMIT 20";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    echo "Datos de prueba insertados correctamente.\n";
    echo "Registros insertados: " . $stmt->rowCount() . "\n";
    
} catch (Exception $e) {
    echo "Error al insertar datos de prueba: " . $e->getMessage() . "\n";
}
?>
