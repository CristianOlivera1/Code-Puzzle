<?php
echo json_encode([
    'status' => 'OK',
    'message' => 'XAMPP está funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s'),
    'env_loaded' => file_exists(__DIR__ . '/.env') ? 'SI' : 'NO'
]);
?>
