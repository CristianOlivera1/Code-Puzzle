-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-08-2025 a las 14:27:21
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `puzzle`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lenguaje`
--

CREATE TABLE `lenguaje` (
  `idLenguaje` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `foto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lenguaje`
--

INSERT INTO `lenguaje` (`idLenguaje`, `nombre`, `foto`) VALUES
(1, 'JavaScript', 'js'),
(2, 'Python', 'python'),
(3, 'Java', 'java'),
(4, 'C++', 'c++'),
(5, 'HTML/CSS', 'html');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel`
--

CREATE TABLE `nivel` (
  `idNivel` int(11) NOT NULL,
  `idLenguaje` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `ayudaDescripcion` varchar(100) NOT NULL,
  `tiempoLimite` int(11) NOT NULL,
  `codigo` text NOT NULL,
  `estado` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nivel`
--

INSERT INTO `nivel` (`idNivel`, `idLenguaje`, `titulo`, `ayudaDescripcion`, `tiempoLimite`, `codigo`, `estado`) VALUES
(1, 1, 'Hola Mundo', 'Ordena las líneas para mostrar un mensaje en consola', 300, 'console.log(\"Hola Mundo\");', 0),
(2, 1, 'Variables', 'Declara una variable y asigna un valor', 180, 'let nombre = \"Juan\";\nconsole.log(\"Hola \" + nombre);', 0),
(3, 1, 'Función simple', 'Crea una función que sume dos números', 240, 'function sumar(a, b) {\n  return a + b;\n}\nconsole.log(sumar(5, 3));', 0),
(4, 2, 'Hola Mundo Python', 'Ordena las líneas para mostrar un mensaje', 300, 'print(\"Hola Mundo\")', 0),
(5, 2, 'Variables en Python', 'Declara variables y muestra su contenido', 240, 'nombre = \"Python\"\nprint(f\"Hola {nombre}\")', 0),
(6, 3, 'Hola Mundo Java', 'Ordena las líneas para crear un programa Java básico', 360, 'public class HolaMundo {\n    public static void main(String[] args) {\n        System.out.println(\"Hola Mundo\");\n    }\n}', 0),
(7, 4, 'Hola Mundo C++', 'Ordena las líneas para crear un programa C++ básico', 300, '#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hola Mundo\" << endl;\n    return 0;\n}', 0),
(8, 5, 'Estructura HTML básica', 'Ordena las líneas para crear una página HTML', 240, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Mi página</title>\n</head>\n<body>\n    <h1>Hola Mundo</h1>\n</body>\n</html>', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progresousuario`
--

CREATE TABLE `progresousuario` (
  `idProgresoUsuario` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `idNivel` int(11) DEFAULT NULL,
  `estrellas` int(11) DEFAULT NULL,
  `tiempoSegundos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `progresousuario`
--

INSERT INTO `progresousuario` (`idProgresoUsuario`, `idUsuario`, `idNivel`, `estrellas`, `tiempoSegundos`) VALUES
(1, 5, 1, 3, 1),
(2, 5, 4, 3, 2),
(3, 5, 5, 3, 4),
(4, 6, 4, 3, 1),
(5, 6, 1, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Jugador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) DEFAULT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `estadoConexion` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `idRol`, `nombreUsuario`, `correo`, `contrasena`, `foto`, `estadoConexion`) VALUES
(1, 1, 'admin', 'admin@puzzlecode.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin.png', 0),
(2, 2, 'cris', 'cris@gmail.com', '$2y$10$zmiLgDDVux5dQDYWGSCM8uVfYMCUu0jn.jdREFroxCQn8FwiK3wza', 'default.png', 0),
(5, 2, 'Cristian Olivera Chavez', '221181@unamba.edu.pe', '', 'https://lh3.googleusercontent.com/a/ACg8ocJet4WEJdQp62eH6vT4oHSVEQfA05sDhOReU1YLLmAQrM9zPCfk=s96-c', 0),
(6, 2, 'Cristian Oner', 'oliverachavezcristian@gmail.com', '', 'https://lh3.googleusercontent.com/a/ACg8ocJRA-aaHKrIql3FaqMeg6oGEge2FK7kfiN0MDcKFIAG-l4T_qoz=s96-c', 0),
(8, 2, 'dani e', '123@gmail.com', '$2y$10$nX7G2cAkPpto1z.n8ymmNOuPycsNFpevRH9BePLCtC0CVz3c3nh8u', 'https://ui-avatars.com/api/?name=dani%2Be&size=200&background=EC4899&color=ffffff&format=png&rounded=true&bold=true&font-size=0.5', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `lenguaje`
--
ALTER TABLE `lenguaje`
  ADD PRIMARY KEY (`idLenguaje`);

--
-- Indices de la tabla `nivel`
--
ALTER TABLE `nivel`
  ADD PRIMARY KEY (`idNivel`),
  ADD KEY `idLenguaje` (`idLenguaje`);

--
-- Indices de la tabla `progresousuario`
--
ALTER TABLE `progresousuario`
  ADD PRIMARY KEY (`idProgresoUsuario`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idNivel` (`idNivel`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `idRol` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `lenguaje`
--
ALTER TABLE `lenguaje`
  MODIFY `idLenguaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `nivel`
--
ALTER TABLE `nivel`
  MODIFY `idNivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `progresousuario`
--
ALTER TABLE `progresousuario`
  MODIFY `idProgresoUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `nivel`
--
ALTER TABLE `nivel`
  ADD CONSTRAINT `nivel_ibfk_1` FOREIGN KEY (`idLenguaje`) REFERENCES `lenguaje` (`idLenguaje`);

--
-- Filtros para la tabla `progresousuario`
--
ALTER TABLE `progresousuario`
  ADD CONSTRAINT `progresousuario_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `progresousuario_ibfk_2` FOREIGN KEY (`idNivel`) REFERENCES `nivel` (`idNivel`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
