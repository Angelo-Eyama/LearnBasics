-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-07-2025 a las 14:23:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `basic`
--
CREATE DATABASE IF NOT EXISTS `basic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `basic`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alembic_version`
--

CREATE TABLE IF NOT EXISTS `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('8c0d3d8f6e38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL COMMENT 'Indica si el comentario ha sido aprobado o no',
  PRIMARY KEY (`id`),
  KEY `comments_ibfk_2` (`userID`),
  KEY `comments_ibfk_1` (`problemID`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `content`, `timePosted`, `problemID`, `userID`, `isApproved`) VALUES
(57, 'Este problema fue bastante desafiante.', '2025-07-11 10:58:37', 1, 1, 1),
(58, 'No entiendo la consigna del todo.', '2025-07-11 10:58:37', 1, 2, 0),
(59, '¿Alguien más obtuvo un resultado diferente?', '2025-07-11 10:58:37', 1, 3, 1),
(60, 'Creo que hay un error en la descripción.', '2025-07-11 10:58:37', 1, 4, 0),
(61, 'Muy interesante, me gustó resolverlo.', '2025-07-11 10:58:37', 2, 5, 1),
(62, 'La solución no es obvia, pero se puede deducir.', '2025-07-11 10:58:37', 2, 6, 1),
(63, 'No me funcionó la validación.', '2025-07-11 10:58:37', 2, 6, 0),
(64, '¿Podrían dar más ejemplos?', '2025-07-11 10:58:37', 2, 12, 0),
(65, 'Ya lo había visto en otro lado.', '2025-07-11 10:58:37', 3, 1, 1),
(66, 'Buen ejercicio de lógica.', '2025-07-11 10:58:37', 3, 3, 1),
(67, 'No conseguí resolverlo del todo.', '2025-07-11 10:58:37', 3, 5, 0),
(68, 'Se podría mejorar el enunciado.', '2025-07-11 10:58:37', 3, 5, 0),
(69, 'Excelente problema, muy educativo.', '2025-07-11 10:58:37', 4, 2, 1),
(70, 'Me costó bastante, pero lo logré.', '2025-07-11 10:58:37', 4, 4, 1),
(71, 'No estoy seguro si mi solución es válida.', '2025-07-11 10:58:37', 4, 6, 0),
(72, 'Tal vez faltan casos borde.', '2025-07-11 10:58:37', 4, 12, 0),
(73, 'Divertido de resolver.', '2025-07-11 10:58:37', 5, 1, 1),
(74, 'Demasiado fácil.', '2025-07-11 10:58:37', 5, 2, 1),
(75, 'No entendí el último paso.', '2025-07-11 10:58:37', 5, 3, 0),
(76, 'El test falló con mis datos.', '2025-07-11 10:58:37', 5, 5, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `read` tinyint(1) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `read`, `timePosted`, `userID`, `title`, `description`) VALUES
(2, 0, '2023-10-01 09:00:00', 3, 'Nuevo Comentario', 'Tienes un nuevo comentario en tu problema.'),
(3, 1, '2023-10-01 10:15:00', 3, 'Problema Resuelto', 'Tu problema ha sido marcado como resuelto.'),
(4, 0, '2023-10-01 11:30:00', 3, 'Nueva Mención', 'Has sido mencionado en un comentario.'),
(5, 1, '2023-10-01 12:45:00', 3, 'Actualización de Sistema', 'El sistema se actualizará mañana.'),
(6, 0, '2023-10-01 13:00:00', 4, 'Nuevo Comentario', 'Tienes un nuevo comentario en tu problema.'),
(7, 0, '2023-10-01 14:15:00', 4, 'Problema Resuelto', 'Tu problema ha sido marcado como resuelto.'),
(8, 1, '2023-10-01 15:30:00', 4, 'Nueva Mención', 'Has sido mencionado en un comentario.'),
(9, 0, '2023-10-01 16:45:00', 4, 'Actualización de Sistema', 'El sistema se actualizará mañana.'),
(10, 1, '2023-10-01 17:00:00', 5, 'Nuevo Comentario', 'Tienes un nuevo comentario en tu problema.'),
(11, 1, '2023-10-01 18:15:00', 5, 'Problema Resuelto', 'Tu problema ha sido marcado como resuelto.'),
(12, 1, '2023-10-01 19:30:00', 5, 'Nueva Mención', 'Has sido mencionado en un comentario.'),
(13, 1, '2023-10-01 20:45:00', 5, 'Actualización de Sistema', 'El sistema se actualizará mañana.'),
(14, 0, '2023-10-01 21:00:00', 6, 'Nuevo Comentario', 'Tienes un nuevo comentario en tu problema.'),
(15, 1, '2023-10-01 22:15:00', 6, 'Problema Resuelto', 'Tu problema ha sido marcado como resuelto.'),
(16, 0, '2023-10-01 23:30:00', 6, 'Nueva Mención', 'Has sido mencionado en un comentario.'),
(17, 0, '2023-10-02 00:45:00', 6, 'Actualización de Sistema', 'El sistema se actualizará mañana.'),
(18, 0, '2023-10-02 01:00:00', 6, 'Nuevo Mensaje', 'Tienes un nuevo mensaje en tu bandeja de entrada.'),
(19, 0, '2023-12-20 07:23:30', 1, 'Bienvenido', 'Esta es tu primera notificacion!'),
(20, 0, NULL, 3, 'Notificacion de prueba', 'Este es un mensaje del super usuario'),
(21, 0, NULL, 1, 'Hola!', 'hola gola hola lao');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `problems`
--

CREATE TABLE IF NOT EXISTS `problems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `authorID` int(11) DEFAULT NULL,
  `hints` varchar(255) DEFAULT NULL,
  `tags` varchar(255) NOT NULL,
  `functionName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `problems_ibfk_1` (`authorID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `problems`
--

INSERT INTO `problems` (`id`, `title`, `description`, `difficulty`, `score`, `authorID`, `hints`, `tags`, `functionName`) VALUES
(1, 'Suma de Números', 'Escribe una función que reciba un arreglo de números y devuelva la suma de todos ellos.', 'Facil', 25, 2, 'Considera usar un bucle para iterar sobre el arreglo.', 'suma, Array', 'suma'),
(2, 'Palíndromo', 'Crea una función que determine si una cadena es un palíndromo.', 'Normal', 20, 2, 'Revisa la cadena desde ambos extremos hacia el centro.', 'cadenas, palíndromo, reversa', 'palindromo'),
(3, 'Ordenamiento de Burbuja', 'Implementa el algoritmo de ordenamiento de burbuja para ordenar un arreglo de números.', 'Dificil', 25, 2, 'Intercambia elementos adyacentes si están en el orden incorrecto.', 'ordenamiento, algoritmos, burbuja', 'burbuja'),
(4, 'Fibonacci Recursivo', 'Escribe una función recursiva que calcule el n-ésimo número de Fibonacci.', 'Dificil', 30, 2, 'Recuerda que Fibonacci(n) = Fibonacci(n-1) + Fibonacci(n-2).', 'recursión, fibonacci, matemáticas', 'fibonacci'),
(5, 'Árbol Binario de Búsqueda', 'Implementa un árbol binario de búsqueda con inserción y búsqueda.', 'Dificil', 40, 1, 'Utiliza nodos con referencias a hijos izquierdo y derecho.', 'árboles, estructuras de datos, búsqueda', 'arbol_binario'),
(8, 'suma', 'Recibe dos numeros y devuelve la suma de ambos', 'Facil', 10, 1, 'Es facil', 'basico, suma', 'suma');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `read` tinyint(1) NOT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `problemID` (`problemID`),
  KEY `reports_ibfk_2` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reports`
--

INSERT INTO `reports` (`id`, `content`, `timePosted`, `read`, `problemID`, `userID`) VALUES
(3, 'Este problema me parece muy complicado', '2025-07-11 09:39:30', 0, 1, 5),
(4, 'Los test no se validan correctamente, estoy seguro que es por el nombre de la funcion que recomnendais.', '2025-07-12 11:53:04', 0, 3, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`name`, `description`) VALUES
('administrador', 'Administrador de la aplicacion, tiene acceso ilimitado a cualquier recurso'),
('estudiante', 'Usuario normal de la aplicacion'),
('moderador', 'Editor de la aplicacion, puede editar contenido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `submissions`
--

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `timeSubmitted` datetime DEFAULT NULL,
  `suggestions` text DEFAULT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `passed_tests` int(11) DEFAULT NULL,
  `total_tests` int(11) DEFAULT NULL,
  `compilation_error` varchar(255) DEFAULT NULL,
  `execution_time` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `problemID` (`problemID`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `submissions`
--

INSERT INTO `submissions` (`id`, `code`, `language`, `status`, `timeSubmitted`, `suggestions`, `problemID`, `userID`, `passed_tests`, `total_tests`, `compilation_error`, `execution_time`) VALUES
(32, 'function suma(skibidi1, skibidi2) {\n  return skibidi1+skibidi2;\n};', 'javascript', 'Correcto', '2025-07-11 09:38:27', 'Breve retroalimentación:\n\n1. Nombres de variables: \"skibidi1\" y \"skibidi2\" no son descriptivos. Usa nombres significativos como \"num1\" y \"num2\".\n\n2. Estructura correcta: La función está bien formada sintácticamente y cumple con el objetivo.\n\n3. Buenas prácticas: Considera añadir validación para asegurar que los parámetros sean números.\n\n4. Punto positivo: El return directo es una implementación eficiente para este caso simple.', 8, 5, 2, 2, NULL, 0.150353);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `test_cases`
--

CREATE TABLE IF NOT EXISTS `test_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `problemID` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `inputs_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`inputs_json`)),
  `expected_output` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `problemID` (`problemID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `test_cases`
--

INSERT INTO `test_cases` (`id`, `problemID`, `description`, `inputs_json`, `expected_output`) VALUES
(16, 8, 'suma1', '\"[{\\\"type\\\": \\\"int\\\", \\\"value\\\": 1}, {\\\"type\\\": \\\"int\\\", \\\"value\\\": 1}]\"', '2'),
(17, 8, 'suma2', '\"[{\\\"type\\\": \\\"int\\\", \\\"value\\\": 0}, {\\\"type\\\": \\\"int\\\", \\\"value\\\": 0}]\"', '0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens`
--

CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expire_at` datetime DEFAULT NULL,
  `type` varchar(255) NOT NULL COMMENT 'El tipo de token puede ser verify o recovery',
  `isValid` tinyint(1) NOT NULL COMMENT 'Indica si el token es valido o no',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tokens`
--

INSERT INTO `tokens` (`id`, `userID`, `token`, `expire_at`, `type`, `isValid`) VALUES
(1, 4, 'S4LkYvPu8EO8itBJg9D7pEAoTNFSOnMqxB39-GAIOMw', '2025-04-05 18:27:36', 'recovery', 1),
(3, 4, 'eqcRK86BXyZ05xU3Piguw5WrnvDqW2wOhLGUDwU7IGE', '2025-04-05 18:36:28', 'recovery', 1),
(4, 6, 'o7fWiUGU3fjpCLelnfDsflBjYPzjT7CwGpqWe7vXbzo', '2025-04-05 23:55:30', 'recovery', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL COMMENT 'La contraseña se guarda hasheada',
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL COMMENT 'Indica si el usuario puede acceder o no.',
  `bio` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL COMMENT 'Indica si el usuario ha verificado su cuenta.',
  `skills` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `firstName`, `lastName`, `email`, `score`, `creationDate`, `active`, `bio`, `github`, `isVerified`, `skills`) VALUES
(1, 'ruler', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'Lord', 'Ruler', 'ruler@name.com', 45, '2025-02-02 02:03:28', 1, 'El futuro vale la pena, incluso si el precio se paga con sangre', 'https://github.com/ruler', 1, 'JavaScript, React, MongoDB, Alomancia'),
(2, 'admin', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'Admin', 'Admin', 'admin@mail.com', 0, '2025-01-22 23:17:43', 1, '', NULL, 0, NULL),
(3, 'moderator', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'string', 'string', 'user@example.com', 10, '2025-01-22 23:17:43', 1, '', NULL, 1, NULL),
(4, 'user', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'User', 'User', 'user@mail.com', 0, '2025-01-22 23:17:43', 0, NULL, NULL, 0, NULL),
(5, 'jdoe', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'Juanito', 'Picapiedra', 'jdoe@mail.com', 10, '2025-01-22 23:54:43', 1, 'Estudiante de programación de primero en la Universidad de Salamanca!\nMe gusta aprender y esta aplicación me permite desarrollar mi pensamiento lógico y crítico', 'https://github.com/jdoe', 0, 'Java, JavaScript, TypeScript, Spring Boot, Angular'),
(6, 'janeDoe', '$2b$12$AIdF3RcSmARfVkk0f9pKYeL1X4TWTOLIFzLoNhGfRxwqWuviyydiW', 'Jane', 'Doe', 'mail@mail.com', 0, '2025-01-28 16:46:06', 1, NULL, NULL, 0, NULL),
(12, 'dmaradona', '$2b$12$0P.01K.iRdd8vW5ljRIEcexAwhB7R3aEzSNFCvXBpZaHu1D61E6na', 'Diego', 'Maradona', 'diego@maradona.com', 0, '2025-06-13 03:09:15', 1, 'Lo juraste por mi, pro Dieguito maradona', '', 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE IF NOT EXISTS `user_roles` (
  `userID` int(11) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  PRIMARY KEY (`userID`,`roleName`),
  KEY `roleName` (`roleName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`userID`, `roleName`) VALUES
(1, 'administrador'),
(1, 'estudiante'),
(1, 'moderador'),
(2, 'administrador'),
(2, 'estudiante'),
(3, 'moderador'),
(4, 'administrador'),
(4, 'estudiante'),
(5, 'estudiante'),
(6, 'estudiante'),
(12, 'estudiante');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`authorID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `test_cases`
--
ALTER TABLE `test_cases`
  ADD CONSTRAINT `test_cases_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleName`) REFERENCES `roles` (`name`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
