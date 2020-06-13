-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 11, 2020 at 09:14 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arphenix`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `dbid` int(11) NOT NULL,
  `id` varchar(90) NOT NULL DEFAULT '0',
  `guildid` varchar(90) NOT NULL DEFAULT '0',
  `coins` int(11) NOT NULL DEFAULT 0,
  `dailyCooldown` varchar(90) NOT NULL DEFAULT '0',
  `bonus` int(11) NOT NULL DEFAULT 0,
  `reps` int(11) NOT NULL DEFAULT 0,
  `repCooldown` varchar(90) NOT NULL DEFAULT '0',
  `crimeCooldown` varchar(90) NOT NULL DEFAULT '0',
  `workCooldown` varchar(90) NOT NULL DEFAULT '0',
  `xp` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `xpCooldown` varchar(90) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`dbid`, `id`, `guildid`, `coins`, `dailyCooldown`, `bonus`, `reps`, `repCooldown`, `crimeCooldown`, `workCooldown`, `xp`, `level`, `xpCooldown`) VALUES
(1, '282121279840976897', '707855956205109338', 192, '0', 0, 1, '1591612903148', '1591435777147', '1591439373470', 98, 1, '1591775774969'),
(2, '707836112042852422', '707855956205109338', 0, '0', 0, 0, '0', '0', '0', 114, 1, '1591775721693'),
(3, '305631432452079617', '714405755805106178', 0, '0', 0, 0, '0', '0', '0', 21, 1, '1591532566833'),
(4, '707836112042852422', '714405755805106178', 0, '0', 0, 0, '0', '0', '0', 11, 1, '1591576930701'),
(5, '439205512425504771', '714405755805106178', 0, '0', 0, 0, '0', '0', '0', 1, 1, '1591576930343'),
(6, '509386354862456833', '714405755805106178', 0, '0', 0, 0, '0', '0', '0', 16, 1, '1591532620433'),
(7, '690481568350732358', '707855956205109338', 0, '0', 0, 0, '0', '0', '0', 21, 1, '1591573992395'),
(8, '121987758674673664', '714405755805106178', 0, '0', 0, 0, '0', '0', '0', 4, 1, '1591576937539'),
(9, '591130131804848140', '707855956205109338', 0, '0', 0, 0, '0', '0', '0', 9, 1, '1591775767688');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`dbid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `dbid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
