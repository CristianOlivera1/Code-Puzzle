-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-09-2025 a las 23:50:30
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
(1, 'JavaScript', 'js.svg'),
(2, 'Python', 'python.svg'),
(3, 'Java', 'java.svg'),
(4, 'C++', 'c++.svg'),
(5, 'HTML/CSS', 'html.svg');

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
(5, 2, 'Variables en Python', 'Declara variables y muestra su contenido', 240, 'nombre = \"Python\"\r\nprint(f\"Hola {nombre}\")', 0),
(6, 3, 'Hola Mundo Java', 'Ordena las líneas para crear un programa Java básico', 360, 'public class HolaMundo {\n    public static void main(String[] args) {\n        System.out.println(\"Hola Mundo\");\n    }\n}', 0),
(7, 4, 'Hola Mundo C++', 'Ordena las líneas para crear un programa C++ básico', 300, '#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hola Mundo\" << endl;\n    return 0;\n}', 0),
(8, 5, 'Estructura HTML básica', 'Ordena las líneas para crear una página HTML', 240, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Mi página</title>\n</head>\n<body>\n    <h1>Hola Mundo</h1>\n</body>\n</html>', 0),
(10, 2, 'Algoritmo para verificar si un número es par o impar', 'Validar que la entrada sea realmente un número', 50, 'numero = int(input(\"Ingresa un número: \"))\r\nif numero % 2 == 0:\r\n    print(\"El número es par.\")\r\nelse:\r\n    print(\"El número es impar.\")', 0),
(11, 2, 'Bucle while ', 'Imprimir del 1 al 5', 30, 'i = 1\r\nwhile i <= 5:\r\n    print(i)\r\n    i += 1', 1),
(12, 2, 'Función personalizada', 'Definir una función con def', 31, 'def saludo(nombre):\r\n    return f\"Hola, {nombre}\"\r\nprint(saludo(\"Cristian\"))', 1),
(13, 2, 'Lista y recorrido', 'Usar listas y bucles', 33, 'numeros = [1, 2, 3, 4, 5]\r\nfor n in numeros:\r\n    print(n)', 1),
(14, 2, 'Diccionario básico', 'Acceder a claves y valores', 30, 'persona = {\"nombre\": \"Ana\", \"edad\": 25}\r\nprint(persona[\"nombre\"])\r\nprint(persona[\"edad\"])', 1),
(15, 2, 'Manejo de errores', 'Usar try-except', 30, 'try:\r\n    x = 10 / 0\r\nexcept ZeroDivisionError:\r\n    print(\"Error: División por cero\")', 1),
(16, 2, 'Clase y objetos', 'Crear una clase y un objeto', 50, 'class Persona:\r\n    def __init__(self, nombre, edad):\r\n        self.nombre = nombre\r\n        self.edad = edad\r\n\r\np = Persona(\"Luis\", 30)\r\nprint(p.nombre, p.edad)', 1),
(17, 4, 'Condicional', 'mayor o menor de edad', 30, '#include <iostream>\r\nusing namespace std;\r\nint main() {\r\nint edad = 20;\r\nif (edad >= 18) {\r\n    cout << \"Eres mayor de edad.\" << endl;\r\n}\r\n}', 0),
(18, 4, 'Bucle while', 'Imprimir del 1 al 5', 35, '#include <iostream>\r\nusing namespace std;\r\nint main() {\r\n    int i = 1;\r\n    while (i <= 5) {\r\n        cout << i << endl;\r\n        i++;\r\n    }\r\n    return 0;\r\n}', 0),
(19, 4, 'Función personalizada', 'Definir una función con def (aquí en C++)', 50, '#include <iostream>\r\nusing namespace std;\r\nint suma(int a, int b) {\r\n    return a + b;\r\n}\r\nint main() {\r\n    cout << suma(3, 4) << endl;\r\n    return 0;\r\n}', 1),
(20, 4, 'Lista y recorrido', 'Usar listas y bucles', 120, '#include <iostream>\r\n#include <vector>\r\nusing namespace std;\r\nint main() {\r\n    vector<int> numeros = {1, 2, 3, 4, 5};\r\n    for (int n : numeros) {\r\n        cout << n << endl;\r\n    }\r\n    return 0;\r\n}', 1),
(21, 4, 'Diccionario básico', 'Acceder a claves y valores', 110, '#include <iostream>\r\n#include <map>\r\nusing namespace std;\r\nint main() {\r\n    map<string, int> edades;\r\n    edades[\"Ana\"] = 20;\r\n    edades[\"Luis\"] = 25;\r\n    for (auto p : edades) {\r\n        cout << p.first << \" \" << p.second << endl;\r\n    }\r\n    return 0;\r\n}', 1),
(22, 4, 'Manejo de errores', 'Usar try-except', 130, '#include <iostream>\r\n#include <stdexcept>\r\nusing namespace std;\r\nint dividir(int a, int b) {\r\n    if (b == 0) throw runtime_error(\"Division por cero\");\r\n    return a / b;\r\n}\r\nint main() {\r\n    try {\r\n        cout << dividir(10, 0) << endl;\r\n    } catch (exception& e) {\r\n        cout << e.what() << endl;\r\n    }\r\n    return 0;\r\n}', 1),
(23, 4, 'Funciones lambda', 'Operar listas con funciones anónimas', 150, '#include <iostream>\r\n#include <vector>\r\n#include <algorithm>\r\nusing namespace std;\r\nint main() {\r\n    vector<int> numeros = {1, 2, 3, 4, 5};\r\n    for_each(numeros.begin(), numeros.end(), [](int n) {\r\n        cout << n * 2 << endl;\r\n    });\r\n    return 0;\r\n}', 1),
(24, 4, 'Clase y objetos', 'Crear una clase y un objeto', 150, '#include <iostream>\r\nusing namespace std;\r\nclass Persona {\r\npublic:\r\n    string nombre;\r\n    int edad;\r\n    void mostrar() {\r\n        cout << nombre << \" \" << edad << endl;\r\n    }\r\n};\r\nint main() {\r\n    Persona p;\r\n    p.nombre = \"Ana\";\r\n    p.edad = 22;\r\n    p.mostrar();\r\n    return 0;\r\n}', 1),
(25, 1, 'Condicional simple', 'Usar if para evaluar una condición', 35, 'const edad = 20;\nif (edad >= 18) {\n  console.log(\"Mayor de edad\");\n}', 0),
(26, 1, 'Condicional con else', 'Usar if...else para manejar dos casos', 38, 'const hora = 10;\nif (hora < 12) {\n  console.log(\"Buenos días\");\n} else {\n  console.log(\"Buenas tardes\");\n}', 1),
(27, 1, 'Condicional múltiple', 'Usar if...else if...else para múltiples condiciones', 40, 'const nota = 17;\nif (nota >= 18) {\n  console.log(\"Excelente\");\n} else if (nota >= 14) {\n  console.log(\"Aprobado\");\n} else {\n  console.log(\"Desaprobado\");\n}', 1),
(28, 1, 'Bucle for', 'Recorrer elementos con for', 42, 'for (let i = 1; i <= 5; i++) {\n  console.log(\"Iteración \" + i);\n}', 1),
(29, 1, 'Bucle while', 'Usar while para repetir mientras se cumpla una condición', 45, 'let contador = 0;\nwhile (contador < 3) {\n  console.log(\"Contador: \" + contador);\n  contador++;\n}', 1),
(30, 1, 'Array básico', 'Crear y recorrer un arreglo', 48, 'const frutas = [\"manzana\", \"banana\", \"uva\"];\nfor (const fruta of frutas) {\n  console.log(fruta);\n}', 1),
(31, 1, 'Objeto simple', 'Definir un objeto con propiedades', 50, 'const persona = {\n  nombre: \"Cristian\",\n  edad: 25\n};\nconsole.log(persona.nombre);\nconsole.log(persona.edad);', 1),
(32, 1, 'Función flecha', 'Usar una arrow function para simplificar sintaxis', 52, 'const saludar = nombre => `Hola, ${nombre}`;\nconsole.log(saludar(\"Cristian\"));', 1),
(33, 1, 'Método dentro de objeto', 'Definir una función como método de un objeto', 55, 'const usuario = {\n  nombre: \"Cristian\",\n  saludar() {\n    return `Hola, soy ${this.nombre}`;\n  }\n};\nconsole.log(usuario.saludar());', 1),
(34, 3, 'Variable simple', 'Declarar una variable y mostrar su valor', 30, 'int edad = 25;\nSystem.out.println(\"Edad: \" + edad);', 1),
(35, 3, 'Condicional simple', 'Usar if para evaluar una condición', 35, 'int nota = 18;\nif (nota >= 14) {\n    System.out.println(\"Aprobado\");\n}', 1),
(36, 3, 'Condicional con else', 'Usar if...else para manejar dos casos', 38, 'int hora = 10;\nif (hora < 12) {\n    System.out.println(\"Buenos días\");\n} else {\n    System.out.println(\"Buenas tardes\");\n}', 1),
(37, 3, 'Condicional múltiple', 'Usar if...else if...else para múltiples condiciones', 40, 'int nota = 17;\nif (nota >= 18) {\n    System.out.println(\"Excelente\");\n} else if (nota >= 14) {\n    System.out.println(\"Aprobado\");\n} else {\n    System.out.println(\"Desaprobado\");\n}', 1),
(38, 3, 'Bucle for', 'Recorrer elementos con for', 42, 'for (int i = 1; i <= 5; i++) {\n    System.out.println(\"Iteración \" + i);\n}', 1),
(39, 3, 'Bucle while', 'Usar while para repetir mientras se cumpla una condición', 45, 'int contador = 0;\nwhile (contador < 3) {\n    System.out.println(\"Contador: \" + contador);\n    contador++;\n}', 1),
(40, 3, 'Array básico', 'Crear y recorrer un arreglo', 48, 'String[] frutas = {\"manzana\", \"banana\", \"uva\"};\nfor (String fruta : frutas) {\n    System.out.println(fruta);\n}', 1),
(41, 3, 'Clase y método', 'Definir una clase con un método simple', 52, 'class Saludo {\n    String saludar(String nombre) {\n        return \"Hola, \" + nombre;\n    }\n}\n\nSaludo s = new Saludo();\nSystem.out.println(s.saludar(\"Cristian\"));', 1),
(42, 3, 'Método estático', 'Usar un método estático dentro de una clase', 55, 'class Util {\n    static int cuadrado(int x) {\n        return x * x;\n    }\n}\n\nSystem.out.println(Util.cuadrado(5));', 1),
(43, 3, 'Constructor de clase', 'Crear una clase con constructor para inicializar atributos', 58, 'class Persona {\n    String nombre;\n    int edad;\n\n    Persona(String nombre, int edad) {\n        this.nombre = nombre;\n        this.edad = edad;\n    }\n}\n\nPersona p = new Persona(\"Cristian\", 25);\nSystem.out.println(p.nombre);', 1),
(44, 3, 'Herencia básica', 'Extender una clase base con una clase hija', 60, 'class Animal {\n    void sonido() {\n        System.out.println(\"Hace un sonido\");\n    }\n}\n\nclass Perro extends Animal {\n    void sonido() {\n        System.out.println(\"Ladra\");\n    }\n}\n\nPerro p = new Perro();\np.sonido();', 1),
(45, 3, 'Sobrecarga de métodos', 'Definir múltiples métodos con el mismo nombre pero diferentes parámetros', 62, 'class Calculadora {\n    int suma(int a, int b) {\n        return a + b;\n    }\n\n    double suma(double a, double b) {\n        return a + b;\n    }\n}\n\nCalculadora c = new Calculadora();\nSystem.out.println(c.suma(2, 3));\nSystem.out.println(c.suma(2.5, 3.5));', 1),
(46, 3, 'Manejo de excepciones', 'Usar try-catch para capturar errores', 65, 'try {\n    int resultado = 10 / 0;\n    System.out.println(resultado);\n} catch (ArithmeticException e) {\n    System.out.println(\"Error: división por cero\");\n}', 1),
(47, 3, 'ArrayList básico', 'Usar ArrayList para almacenar elementos dinámicamente', 68, 'import java.util.ArrayList;\n\nArrayList<String> nombres = new ArrayList<>();\nnombres.add(\"Cristian\");\nnombres.add(\"Lucía\");\nfor (String nombre : nombres) {\n    System.out.println(nombre);\n}', 1),
(48, 3, 'Iteración con forEach', 'Usar forEach para recorrer una colección', 70, 'import java.util.List;\n\nList<Integer> numeros = List.of(1, 2, 3);\nnumeros.forEach(n -> System.out.println(\"Número: \" + n));', 1),
(49, 3, 'Clase abstracta', 'Definir una clase abstracta con método obligatorio', 72, 'abstract class Figura {\n    abstract double area();\n}\n\nclass Cuadrado extends Figura {\n    double lado = 4;\n    double area() {\n        return lado * lado;\n    }\n}\n\nFigura f = new Cuadrado();\nSystem.out.println(f.area());', 1),
(50, 5, 'Encabezado y párrafo', 'Crear un título con <h1> y un párrafo con <p>', 25, '<h1>Bienvenido</h1>\n<p>Este es un sitio de reservas deportivas.</p>', 1),
(51, 5, 'Lista ordenada', 'Crear una lista numerada con <ol> y <li>', 28, '<ol>\n  <li>Fútbol</li>\n  <li>Vóley</li>\n  <li>Tenis</li>\n</ol>', 1),
(52, 5, 'Lista desordenada', 'Crear una lista con viñetas usando <ul>', 30, '<ul>\n  <li>Inicio</li>\n  <li>Reservas</li>\n  <li>Contacto</li>\n</ul>', 1),
(53, 5, 'Enlace externo', 'Crear un enlace que abra otra página', 32, '<a href=\"https://scrollxui.dev\" target=\"_blank\">Ir a ScrollXUI</a>', 1),
(54, 5, 'Imagen con descripción', 'Insertar una imagen con texto alternativo', 35, '<img src=\"cancha.jpg\" alt=\"Cancha deportiva\">', 1),
(55, 5, 'Estilo en línea', 'Aplicar color y tamaño directamente con style', 38, '<p style=\"color: blue; font-size: 20px;\">Texto destacado</p>', 1),
(56, 5, 'Estilo con clase', 'Usar una clase CSS para aplicar estilos', 40, '<style>\n  .boton {\n    background-color: green;\n    color: white;\n    padding: 10px;\n  }\n</style>\n<button class=\"boton\">Reservar</button>', 1),
(57, 5, 'Contenedor con borde', 'Crear un div con borde y padding', 42, '<style>\n  .caja {\n    border: 2px solid #333;\n    padding: 20px;\n  }\n</style>\n<div class=\"caja\">Contenido destacado</div>', 1),
(58, 5, 'Diseño con flexbox', 'Usar display: flex para alinear elementos', 45, '<style>\n  .fila {\n    display: flex;\n    gap: 10px;\n  }\n</style>\n<div class=\"fila\">\n  <div>Cancha 1</div>\n  <div>Cancha 2</div>\n</div>', 1),
(59, 5, 'Formulario básico', 'Crear un formulario con campos de texto y botón', 50, '<form>\n  <label>Nombre:</label>\n  <input type=\"text\" name=\"nombre\">\n  <button type=\"submit\">Enviar</button>\n</form>', 1),
(60, 5, 'Estilo de formulario', 'Aplicar estilos a campos y botones', 52, '<style>\n  input, button {\n    padding: 8px;\n    margin: 5px;\n    border-radius: 4px;\n  }\n</style>\n<form>\n  <input type=\"email\" placeholder=\"Correo\">\n  <button>Suscribirse</button>\n</form>', 1),
(61, 5, 'Animación con transition', 'Aplicar transición suave al pasar el cursor', 55, '<style>\n  .boton {\n    background: #007bff;\n    color: white;\n    padding: 10px;\n    transition: background 0.3s;\n  }\n  .boton:hover {\n    background: #0056b3;\n  }\n</style>\n<button class=\"boton\">Hover me</button>', 1),
(62, 5, 'Diseño responsivo con media query', 'Adaptar el diseño según el ancho de pantalla', 58, '<style>\n  .caja {\n    background: lightgray;\n    padding: 20px;\n  }\n  @media (max-width: 600px) {\n    .caja {\n      background: lightblue;\n    }\n  }\n</style>\n<div class=\"caja\">Contenido adaptable</div>', 1),
(63, 5, 'Layout con grid', 'Usar CSS Grid para distribuir elementos', 60, '<style>\n  .contenedor {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 10px;\n  }\n</style>\n<div class=\"contenedor\">\n  <div>Cancha A</div>\n  <div>Cancha B</div>\n</div>', 1),
(64, 5, 'Botón con sombra', 'Aplicar sombra y efecto visual a un botón', 62, '<style>\n  .boton {\n    padding: 10px;\n    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);\n  }\n</style>\n<button class=\"boton\">Reservar</button>', 1),
(65, 5, 'Encabezado fijo', 'Crear un header que se mantenga arriba al hacer scroll', 65, '<style>\n  header {\n    position: fixed;\n    top: 0;\n    width: 100%;\n    background: white;\n    padding: 10px;\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n  }\n</style>\n<header>\n  <h1>Reservas Deportivas</h1>\n</header>', 1),
(66, 5, 'Icono con fuente externa', 'Usar Google Fonts y aplicar estilo a texto', 68, '<link href=\"https://fonts.googleapis.com/css2?family=Roboto&display=swap\" rel=\"stylesheet\">\n<style>\n  body {\n    font-family: \"Roboto\", sans-serif;\n  }\n</style>\n<p>Texto con fuente personalizada</p>', 1),
(67, 5, 'Tarjeta con borde redondeado', 'Diseñar una tarjeta visual con imagen y texto', 70, '<style>\n  .tarjeta {\n    border-radius: 10px;\n    overflow: hidden;\n    border: 1px solid #ccc;\n    width: 250px;\n  }\n  .tarjeta img {\n    width: 100%;\n  }\n  .tarjeta p {\n    padding: 10px;\n  }\n</style>\n<div class=\"tarjeta\">\n  <img src=\"cancha.jpg\" alt=\"Cancha\">\n  <p>Reserva tu espacio deportivo</p>\n</div>', 1),
(68, 1, 'Callback básico', 'Pasar una función como argumento y ejecutarla', 58, 'function procesar(nombre, callback) {\n  console.log(\"Procesando usuario...\");\n  callback(nombre);\n}\n\nprocesar(\"Cristian\", function(n) {\n  console.log(\"Bienvenido, \" + n);\n});', 1),
(69, 1, 'Objeto con métodos dinámicos', 'Agregar propiedades y métodos a un objeto en tiempo de ejecución', 60, 'const usuario = {};\nusuario.nombre = \"Cristian\";\nusuario.saludar = function() {\n  return \"Hola, soy \" + this.nombre;\n};\nconsole.log(usuario.saludar());', 1),
(70, 1, 'Desestructuración de objetos', 'Extraer propiedades usando sintaxis moderna', 62, 'const persona = { nombre: \"Cristian\", edad: 25 };\nconst { nombre, edad } = persona;\nconsole.log(nombre);\nconsole.log(edad);', 1),
(71, 1, 'Spread operator', 'Combinar objetos o arrays con el operador ...', 65, 'const base = { rol: \"cliente\" };\nconst perfil = { ...base, nombre: \"Cristian\" };\nconsole.log(perfil);', 1),
(72, 1, 'Map sobre array', 'Transformar elementos de un array con map()', 68, 'const numeros = [1, 2, 3];\nconst dobles = numeros.map(n => n * 2);\nconsole.log(dobles);', 1),
(73, 1, 'Filter sobre array', 'Filtrar elementos que cumplen una condición', 70, 'const edades = [12, 18, 25, 30];\nconst mayores = edades.filter(e => e >= 18);\nconsole.log(mayores);', 1),
(74, 1, 'Reduce para sumar', 'Usar reduce para acumular valores', 72, 'const precios = [10, 20, 30];\nconst total = precios.reduce((acc, val) => acc + val, 0);\nconsole.log(\"Total: \" + total);', 1),
(75, 1, 'Template literals', 'Usar backticks para interpolar variables en texto', 75, 'const nombre = \"Cristian\";\nconst saludo = `Hola, ${nombre}. Bienvenido.`;\nconsole.log(saludo);', 1),
(76, 1, 'Condicional ternario', 'Simplificar una condición con operador ternario', 78, 'const edad = 20;\nconst mensaje = edad >= 18 ? \"Mayor de edad\" : \"Menor de edad\";\nconsole.log(mensaje);', 1);

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
(8, 2, 5, 3, 2),
(9, 2, 10, 2, 31),
(17, 23, 4, 3, 1),
(18, 23, 5, 3, 5),
(19, 2, 7, 3, 7),
(20, 2, 17, 1, 34),
(24, 26, 25, 3, 15),
(25, 26, 8, 3, 28);

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
(2, 1, 'Administrador', 'admin@gmail.com', '$2y$10$zmiLgDDVux5dQDYWGSCM8uVfYMCUu0jn.jdREFroxCQn8FwiK3wza', 'default.png', 1),
(8, 2, 'dani e', '123@gmail.com', '$2y$10$nX7G2cAkPpto1z.n8ymmNOuPycsNFpevRH9BePLCtC0CVz3c3nh8u', 'https://ui-avatars.com/api/?name=dani%2Be&size=200&background=EC4899&color=ffffff&format=png&rounded=true&bold=true&font-size=0.5', 0),
(23, 2, 'prueba', 'prueba@gmail.com', '$2y$10$RF3xqT6gGRglekKcdyLbD.eEC9HlopONbbklnkIbBH1xtmtJgy1oe', 'https://ui-avatars.com/api/?name=prueba&size=200&background=10B981&color=ffffff&format=png&rounded=true&bold=true&font-size=0.5', 1),
(26, 2, 'prueba2', 'pr2@gmail.com', '$2y$10$d8T0B66vCq0RXZBByE5w4u7Xr0RoJZ.sVGZov9qZ6t4Ih4zTwwe7m', 'https://ui-avatars.com/api/?name=prueba2&size=200&background=10B981&color=ffffff&format=png&rounded=true&bold=true&font-size=0.5', 1);

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
  MODIFY `idNivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT de la tabla `progresousuario`
--
ALTER TABLE `progresousuario`
  MODIFY `idProgresoUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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
