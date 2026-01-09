-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2025 at 03:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gp3`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_entity`
--

CREATE TABLE `chat_message_entity` (
  `id` bigint(20) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `recipient_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_message_entity`
--

INSERT INTO `chat_message_entity` (`id`, `content`, `timestamp`, `recipient_id`, `sender_id`) VALUES
(1, 'Bonjour', '2025-03-17 14:48:15.000000', 2, 1),
(2, 'Bonjour', '2025-03-17 14:49:03.000000', 1, 2),
(3, 'test', '2025-03-17 14:49:39.000000', 2, 1),
(4, 'test1', '2025-03-17 14:50:02.000000', 1, 2),
(5, 'Test2', '2025-03-17 15:06:10.000000', 2, 1),
(6, 'test3', '2025-03-17 15:06:34.000000', 1, 2),
(7, 'dddd', '2025-03-21 11:54:50.000000', 3, 1),
(8, 'ddddd', '2025-03-21 11:56:29.000000', 1, 3),
(9, 'vvvvv', '2025-03-21 12:07:51.000000', 3, 1),
(10, 'vvvvvv', '2025-03-21 12:08:02.000000', 1, 3),
(11, 'salut', '2025-03-24 10:03:43.000000', 2, 1),
(12, 'dddd', '2025-03-24 10:03:56.000000', 1, 2),
(13, 'www', '2025-03-24 10:06:58.000000', 1, 2),
(14, 'dddd', '2025-03-24 10:07:07.000000', 2, 1),
(15, 'ddddd', '2025-03-24 10:07:50.000000', 2, 1),
(16, 'dddd', '2025-03-24 10:07:57.000000', 1, 2),
(17, 'ddddd', '2025-03-24 10:10:43.000000', 2, 1),
(18, 'yyyyy', '2025-03-24 10:13:46.000000', 2, 1),
(19, 'dddd', '2025-03-24 10:23:04.000000', 2, 1),
(20, 'ssss', '2025-03-24 10:24:50.000000', 2, 1),
(21, 'cccc', '2025-03-24 10:24:58.000000', 1, 2),
(22, 'qqq', '2025-03-24 10:33:10.000000', 2, 1),
(23, 'www', '2025-03-24 10:34:08.000000', 2, 1),
(24, 'vvvv', '2025-03-24 10:34:36.000000', 1, 2),
(25, 'cvcvcvc', '2025-03-24 10:36:04.000000', 2, 1),
(26, 'cdcdc', '2025-03-24 10:38:22.000000', 1, 2),
(27, 'dddd', '2025-03-24 10:42:13.000000', 1, 2),
(28, 'qqq', '2025-03-24 10:42:47.000000', 2, 1),
(29, 'eee', '2025-03-24 10:42:55.000000', 2, 1),
(30, 'ggtt', '2025-03-24 10:43:06.000000', 1, 2),
(31, 'slm', '2025-03-24 14:39:04.000000', 2, 1),
(32, 'slm2', '2025-03-24 14:39:13.000000', 1, 2),
(33, 'ssdsf', '2025-03-24 14:40:50.000000', 2, 1),
(34, 'rfrefe', '2025-03-24 14:40:53.000000', 1, 2),
(35, 'test', '2025-04-24 15:25:47.000000', 2, 1),
(36, 'gggg', '2025-04-24 16:01:02.000000', 1, 3),
(37, 'test', '2025-04-24 16:01:48.000000', 3, 1),
(38, 'test1', '2025-04-24 16:02:05.000000', 1, 3),
(39, 'tst1', '2025-04-24 16:02:37.000000', 1, 2),
(40, '\"><img src=x onerror=alert()>', '2025-04-29 12:15:46.000000', 1, 1),
(41, ';', '2025-04-29 12:36:20.000000', 1, 1),
(42, 'ss', '2025-08-08 09:45:18.000000', 3, 1),
(43, 'salam', '2025-08-08 09:45:28.000000', 2, 1),
(44, 'salam', '2025-08-08 10:52:13.000000', 1, 2),
(45, 'salam cv ', '2025-08-08 10:52:21.000000', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `projet`
--

CREATE TABLE `projet` (
  `id` bigint(20) NOT NULL,
  `responsable_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `commencer` varchar(255) DEFAULT NULL,
  `fin` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projet`
--

INSERT INTO `projet` (`id`, `responsable_id`, `description`, `name`, `commencer`, `fin`, `priority`) VALUES
(3, 2, 'Dévelopement de app 2', 'Développement de l\'API', NULL, NULL, NULL),
(9, 2, '', 'Tests de compatibilité', NULL, NULL, NULL),
(13, 1, 'Dossier paiement RG OCTANET', 'Dossier paiement RG OCTANET', '2025-04-01', '2025-04-04', NULL),
(14, 1, 'ODS de commencement M 07/2025 M 08/2025', 'ODS de commencement M 07/2025 M 08/2025', '2025-04-01', '2025-04-04', NULL),
(15, 1, 'ww', 'WW', '2025-04-10', '2025-04-09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tache`
--

CREATE TABLE `tache` (
  `id` bigint(20) NOT NULL,
  `projet_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `due_date` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` enum('DONE','IN_PROGRESS','TODO') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tache`
--

INSERT INTO `tache` (`id`, `projet_id`, `user_id`, `due_date`, `priority`, `title`, `status`) VALUES
(10, 3, 1, '2024-03-21', 'low', 'Formation des utilisateurs', 'TODO'),
(19, 9, 1, '2025-03-04', 'Low', 'Formation des utilisateurs', 'TODO'),
(23, 13, 3, '2025-04-01', 'HIGH', 'PV DE réception', 'DONE'),
(24, 13, 3, '2025-04-01', 'HIGH', 'dossier de paiement RG ', 'DONE'),
(25, 14, 2, '2025-04-01', 'HIGH', 'ODS de commencement M07/2025 M08/2025', 'IN_PROGRESS'),
(33, 14, 3, '2025-04-30', 'HIGH', 'test', 'IN_PROGRESS');

-- --------------------------------------------------------

--
-- Table structure for table `tache1`
--

CREATE TABLE `tache1` (
  `id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `utilisateur_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` enum('DONE','IN_PROGRESS','TODO') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `user_id`, `title`, `status`) VALUES
(1, 1, 'Fix bug in login functionality', 'TODO'),
(2, 1, 'Fix bug in login functionality', 'TODO'),
(3, 1, 'Fix bug in login functionality', 'TODO'),
(4, 1, 'Fix bug in login functionality', 'DONE'),
(5, 1, 'Fix bug in login functionality', 'IN_PROGRESS'),
(6, 1, 'Tache 21', 'DONE');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nomm` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `email`, `nom`, `role`, `password`, `nomm`) VALUES
(1, 'admin', 'Mme Hasnae', 'Chef de projet', 'admin', NULL),
(2, 'user', 'M. Dahman', 'Utilisateur Normal', 'user', NULL),
(3, 'user1', 'M. Brahim', 'Utilisateur Normal', 'user1', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_message_entity`
--
ALTER TABLE `chat_message_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1u8y8gop4vucig23apeidcx0d` (`recipient_id`),
  ADD KEY `FK43l1ekl292pgb3hwsi743wjtw` (`sender_id`);

--
-- Indexes for table `projet`
--
ALTER TABLE `projet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKml7tgxivdbjkq3n65bxcphcxi` (`responsable_id`);

--
-- Indexes for table `tache`
--
ALTER TABLE `tache`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKf97vcdrmyltn9s75dgh2tlw70` (`projet_id`),
  ADD KEY `FKf98nbwqjgxy4a86gemvpb6gg3` (`user_id`);

--
-- Indexes for table `tache1`
--
ALTER TABLE `tache1`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKq19s8ibx0jugooiwwmy4wl9tk` (`project_id`),
  ADD KEY `FKlg1tol9mavxet92lg77nuwut0` (`utilisateur_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_message_entity`
--
ALTER TABLE `chat_message_entity`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `projet`
--
ALTER TABLE `projet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `tache`
--
ALTER TABLE `tache`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `tache1`
--
ALTER TABLE `tache1`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_message_entity`
--
ALTER TABLE `chat_message_entity`
  ADD CONSTRAINT `FK1u8y8gop4vucig23apeidcx0d` FOREIGN KEY (`recipient_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FK43l1ekl292pgb3hwsi743wjtw` FOREIGN KEY (`sender_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `projet`
--
ALTER TABLE `projet`
  ADD CONSTRAINT `FKml7tgxivdbjkq3n65bxcphcxi` FOREIGN KEY (`responsable_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `tache`
--
ALTER TABLE `tache`
  ADD CONSTRAINT `FKf97vcdrmyltn9s75dgh2tlw70` FOREIGN KEY (`projet_id`) REFERENCES `projet` (`id`),
  ADD CONSTRAINT `FKf98nbwqjgxy4a86gemvpb6gg3` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `tache1`
--
ALTER TABLE `tache1`
  ADD CONSTRAINT `FKlg1tol9mavxet92lg77nuwut0` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FKq19s8ibx0jugooiwwmy4wl9tk` FOREIGN KEY (`project_id`) REFERENCES `projet` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
