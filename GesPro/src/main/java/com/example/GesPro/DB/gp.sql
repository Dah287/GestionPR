-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2025 at 11:48 AM
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
-- Database: `gp`
--

-- --------------------------------------------------------

--
-- Table structure for table `projet`
--

CREATE TABLE `projet` (
  `id` bigint(20) NOT NULL,
  `responsable_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projet`
--

INSERT INTO `projet` (`id`, `responsable_id`, `description`, `name`) VALUES
(1, 1, 'Dévelopement de app 2', 'Projet 1'),
(2, 1, 'Dévelopement de app 2', 'Projet 2'),
(3, 2, 'Dévelopement de app 2', 'Projet 3'),
(9, 2, '', '');

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
(3, 1, 2, '2024-03-21', 'low', 'Tache2', 'IN_PROGRESS'),
(4, 1, 2, '2024-03-21', 'Medium', 'Tache3', 'IN_PROGRESS'),
(5, 1, 1, '2024-03-21', 'HIGH', 'Tache2', 'DONE'),
(6, 2, 1, '2024-03-21', 'low', 'Tache', 'TODO'),
(7, 2, 1, '2024-03-21', 'low', 'Tache', 'TODO'),
(8, 2, 1, '2024-03-21', 'low', 'Tache', 'IN_PROGRESS'),
(9, 2, 1, '2024-03-21', 'low', 'Tache', 'IN_PROGRESS'),
(10, 3, 1, '2024-03-21', 'low', 'Tache', 'TODO'),
(11, 1, 1, '2025-03-06', 'Medium', 'ee', 'TODO'),
(17, 2, 1, '2025-02-26', 'Low', 'vvvvv', 'DONE'),
(18, 2, 3, '2025-03-03', 'Low', 'wwwwwwww', 'IN_PROGRESS'),
(19, 9, 1, '2025-03-04', 'Low', 'qqq', 'TODO');

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
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `email`, `nom`, `role`, `password`) VALUES
(1, 'brahim', 'brahim', 'Chef de projet', 'brahim'),
(2, 'brahim1.dupont@example.com', 'brahim1', 'Chef de projet', 'brahim1'),
(3, 'brahim2.dupont@example.com', 'brahim2', 'Chef de projet', 'brahim2');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `projet`
--
ALTER TABLE `projet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tache`
--
ALTER TABLE `tache`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

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
