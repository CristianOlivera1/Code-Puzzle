-- Crear base de datos
CREATE DATABASE IF NOT EXISTS puzzle;
USE puzzle;

-- Tabla de roles
CREATE TABLE rol (
  idRol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE Usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  idRol INT,
  nombreUsuario VARCHAR(50) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  foto VARCHAR(255) NOT NULL,
  estadoConexion TINYINT DEFAULT 0, -- 0: Desconectado, 1: Conectado
  FOREIGN KEY (idRol) REFERENCES rol(idRol)
);

-- Tabla de lenguajes de programación
CREATE TABLE Lenguaje (
  idLenguaje INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  foto VARCHAR(255) NOT NULL
);

-- Tabla de niveles
CREATE TABLE Nivel (
  idNivel INT AUTO_INCREMENT PRIMARY KEY,
  idLenguaje INT,
  titulo VARCHAR(100) NOT NULL,
  ayudaDescripcion VARCHAR(100) NOT NULL,
  tiempoLimite INT NOT NULL,
  codigo TEXT NOT NULL,
  estado TINYINT DEFAULT 0, -- 0: Completado, 1: Bloqueado
  FOREIGN KEY (idLenguaje) REFERENCES Lenguaje(idLenguaje)
);

-- Tabla de progreso de usuario
CREATE TABLE ProgresoUsuario (
  idProgresoUsuario INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT,
  idNivel INT,
  estrellas INT,
  tiempoSegundos INT,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
  FOREIGN KEY (idNivel) REFERENCES Nivel(idNivel)
);

-- Insertar datos iniciales
INSERT INTO rol (nombre) VALUES 
('Administrador'),
('Jugador');

INSERT INTO Lenguaje (nombre, foto) VALUES 
('JavaScript', 'js.png'),
('Python', 'python.png'),
('Java', 'java.png'),
('C++', 'cpp.png'),
('HTML/CSS', 'html.png');

-- Insertar usuario administrador por defecto
INSERT INTO Usuario (idRol, nombreUsuario, correo, contrasena, foto, estadoConexion) VALUES 
(1, 'admin', 'admin@puzzlecode.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin.png', 0);
-- Contraseña: password

-- Insertar algunos niveles de ejemplo para JavaScript
INSERT INTO Nivel (idLenguaje, titulo, ayudaDescripcion, tiempoLimite, codigo, estado) VALUES 
(1, 'Hola Mundo', 'Ordena las líneas para mostrar un mensaje en consola', 300, 'console.log("Hola Mundo");', 0),
(1, 'Variables', 'Declara una variable y asigna un valor', 180, 'let nombre = "Juan";\nconsole.log("Hola " + nombre);', 1),
(1, 'Función simple', 'Crea una función que sume dos números', 240, 'function sumar(a, b) {\n  return a + b;\n}\nconsole.log(sumar(5, 3));', 1);

-- Insertar más niveles para diferentes lenguajes
INSERT INTO Nivel (idLenguaje, titulo, ayudaDescripcion, tiempoLimite, codigo, estado) VALUES 
(2, 'Hola Mundo Python', 'Ordena las líneas para mostrar un mensaje', 300, 'print("Hola Mundo")', 0),
(2, 'Variables en Python', 'Declara variables y muestra su contenido', 240, 'nombre = "Python"\nprint(f"Hola {nombre}")', 1),
(3, 'Hola Mundo Java', 'Ordena las líneas para crear un programa Java básico', 360, 'public class HolaMundo {\n    public static void main(String[] args) {\n        System.out.println("Hola Mundo");\n    }\n}', 0),
(4, 'Hola Mundo C++', 'Ordena las líneas para crear un programa C++ básico', 300, '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hola Mundo" << endl;\n    return 0;\n}', 0),
(5, 'Estructura HTML básica', 'Ordena las líneas para crear una página HTML', 240, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Mi página</title>\n</head>\n<body>\n    <h1>Hola Mundo</h1>\n</body>\n</html>', 0);
