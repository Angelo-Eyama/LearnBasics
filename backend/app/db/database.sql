-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-02-2025 a las 17:18:32
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

CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('9cf8e345f7df');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `block` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `authorID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `timePosted` datetime DEFAULT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `name` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`name`, `description`) VALUES
('administrador', 'Administrador de la aplicacion, tiene acceso ilimitado a cualquier recurso'),
('estudiante', 'Usuario normal de la aplicacion'),
('moderador', 'Moderador de la aplicacion, tiene acceso limitado a ciertos recursos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `timeSubmitted` datetime DEFAULT NULL,
  `timeUpdated` datetime DEFAULT NULL,
  `suggestions` varchar(255) DEFAULT NULL,
  `problemID` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `test_cases`
--

CREATE TABLE `test_cases` (
  `id` int(11) NOT NULL,
  `problemID` int(11) NOT NULL,
  `input` varchar(255) NOT NULL,
  `output` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` blob DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL,
  `active` tinyint(1) NOT NULL COMMENT 'Indica si el usuario puede acceder o no.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `firstName`, `lastName`, `email`, `score`, `creationDate`, `active`) VALUES
(1, 'ruler', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'Lord', 'Ruler', 'ruler@name.com', 0, '2025-02-02 02:03:28', 1),
(2, 'admin', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'Admin', 'Admin', 'admin@mail.com', 0, '2025-01-22 23:17:43', 1),
(3, 'moderator', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'string', 'string', 'user@example.com', 10, '2025-01-22 23:17:43', 0),
(4, 'user', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'User', 'User', 'user@mail.com', 0, '2025-01-22 23:17:43', 1),
(5, 'jdoe', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'John', 'Doe', 'jdoe@mail.com', 0, '2025-01-22 23:54:43', 1),
(6, 'janeDoe', 0x2432622431322441496446335263536d415266566b6b306639704b59654c3158345457544f4c49467a4c6f4e68476652787771577576697979646957, 'Jane', 'Doe', 'mail@mail.com', 0, '2025-01-28 16:46:06', 1),
(9, 'archer', 0x2432622431322464357844736b30795576677049445846444b2f526865537a3050457567506f6c75635963337347704e30594d444e52794d6a6a4347, 'shirou', 'emiya', 'fate@mail.com', 0, '2025-02-05 00:07:49', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE `user_roles` (
  `userID` int(11) NOT NULL,
  `roleName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`userID`, `roleName`) VALUES
(1, 'administrador'),
(1, 'estudiante'),
(1, 'moderador'),
(2, 'estudiante'),
(3, 'moderador'),
(4, 'estudiante'),
(5, 'moderador'),
(6, 'estudiante'),
(9, 'estudiante');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alembic_version`
--
ALTER TABLE `alembic_version`
  ADD PRIMARY KEY (`version_num`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `problemID` (`problemID`),
  ADD KEY `userID` (`userID`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indices de la tabla `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorID` (`authorID`);

--
-- Indices de la tabla `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `problemID` (`problemID`),
  ADD KEY `userID` (`userID`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`name`);

--
-- Indices de la tabla `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `problemID` (`problemID`),
  ADD KEY `userID` (`userID`);

--
-- Indices de la tabla `test_cases`
--
ALTER TABLE `test_cases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `problemID` (`problemID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`userID`,`roleName`),
  ADD KEY `user_roles_ibfk1` (`roleName`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `test_cases`
--
ALTER TABLE `test_cases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`authorID`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `test_cases`
--
ALTER TABLE `test_cases`
  ADD CONSTRAINT `test_cases_ibfk_1` FOREIGN KEY (`problemID`) REFERENCES `problems` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk1` FOREIGN KEY (`roleName`) REFERENCES `roles` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
