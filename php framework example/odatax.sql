-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `ox_companies`;
CREATE TABLE `ox_companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `address` varchar(250) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ox_companies` (`id`, `name`, `address`, `timestamp`) VALUES
(79,	'Some Company 1',	'1234 E Lake Drive, WA',	'2020-06-27 20:40:06'),
(80,	'Some Company 2',	'1234 E Lake Drive, WA',	'2020-06-27 20:40:10'),
(81,	'Some Company 3',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:36'),
(82,	'Some Company 4',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:41'),
(83,	'Some Company 5',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:44'),
(84,	'Some Company 6',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:47'),
(85,	'Some Company 7',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:50'),
(86,	'Some Company 8',	'1234 E Lake Drive, WA',	'2020-06-27 20:42:53'),
(88,	'Some Company 0',	'1234 E Lake Drive, WA',	'2020-06-28 02:10:30'),
(89,	'Some Company 9',	'343 W Lake Drive, TX',	'2020-06-28 02:11:24');

DROP TABLE IF EXISTS `ox_leads`;
CREATE TABLE `ox_leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyid` int(11) NOT NULL,
  `lead_name` varchar(55) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `phone` varchar(22) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ox_leads` (`id`, `companyid`, `lead_name`, `phone`, `timestamp`) VALUES
(405,	79,	'Lead 1',	'12345678',	'2020-06-27 20:47:30'),
(406,	79,	'Lead 2',	'4325345345',	'2020-06-27 20:47:38'),
(408,	88,	'Lead 1',	'4325345345',	'2020-06-27 20:48:10'),
(409,	88,	'Lead 2',	'4325345345',	'2020-06-27 20:48:14'),
(410,	88,	'Lead 3',	'4325345345',	'2020-06-27 20:48:17'),
(411,	80,	'Lead 1',	'4325345345',	'2020-06-27 20:48:24'),
(412,	80,	'Lead 2',	'4325345345',	'2020-06-27 20:48:28'),
(413,	81,	'Lead 3',	'4325345345',	'2020-06-27 20:48:51'),
(414,	81,	'Lead 4',	'4325345345',	'2020-06-27 20:48:53'),
(415,	82,	'Lead 1',	'4325345345',	'2020-06-27 20:48:58'),
(416,	82,	'Lead 2',	'4325345345',	'2020-06-27 20:49:01'),
(417,	82,	'Lead 2',	'4325345345',	'2020-06-27 20:49:02'),
(418,	83,	'Lead 33',	'34563453453',	'2020-06-27 20:49:27'),
(419,	83,	'Lead 33',	'34563453453',	'2020-06-27 20:49:31'),
(420,	84,	'Lead 43',	'34563453453',	'2020-06-27 20:49:38'),
(421,	84,	'Lead 43',	'34563453453',	'2020-06-27 20:49:39'),
(422,	85,	'Lead 43',	'34563453453',	'2020-06-27 20:49:41'),
(424,	87,	'Lead 43',	'34563453453',	'2020-06-27 20:49:46');

DROP TABLE IF EXISTS `ox_users`;
CREATE TABLE `ox_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(200) NOT NULL,
  `lastname` varchar(200) NOT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `session` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NULL',
  `forgotpass` varchar(250) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NULL',
  `access` int(1) NOT NULL DEFAULT '0' COMMENT '1=regular, 2=admin',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lead_access` varchar(55) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `ox_users` (`id`, `firstname`, `lastname`, `email`, `username`, `password`, `session`, `forgotpass`, `access`, `active`, `created`, `timestamp`, `lead_access`) VALUES
(1,	'Firstname',	'Lastname',	'sample@sample.com',	'admin',	'$2y$10$GfAXWo0ZiJYRWLvBAm3lquJXGQbcMVlk44o8OsUCz/HVUV0aRliXa',	'',	'Vnx9MWycG88iJNKfX7',	1,	1,	'2020-06-28 09:36:26',	'2020-06-27 20:39:09',	'all'),
(150,	'Somename',	'SomeLastname',	'name@example.com',	'uname1',	'$2y$10$jGnYyM744ZMm4hRPG9fgI.MomqXh.WKTeNasnuUvg1rBeoQfJpwou',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:15:55',	'2020-06-28 02:06:17',	'79'),
(151,	'Somename',	'SomeLastname',	'name2@example.com',	'uname',	'$2y$10$/gyK27CkYfDU/C1tU.TZfub4gEauAhSbYGgT/.PeHdsXKjgKjR6f2',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:19:52',	'2020-06-28 02:06:38',	'all'),
(152,	'Somename3',	'SomeLastname3',	'name3@example.com',	'uname3',	'$2y$10$D1Hz0gmQryWYJPFnCOyGP.65RuCqxhDgjnuz2GK7bHZd4FBum0RfW',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:20:30',	'2020-06-28 02:06:48',	'81'),
(153,	'Somename4',	'SomeLastname4',	'name4@example.com',	'uname4',	'$2y$10$19G53X5geblu2kQRD0z4LuX66d1mKbM9UM4PbB3y7uBJ4uIHmfG5G',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:20:44',	'2020-06-28 02:06:59',	'82'),
(154,	'Somename5',	'SomeLastname5',	'name5@example.com',	'uname5',	'$2y$10$64F9Pg1uILm9DIjuw8qrF.vPprJdYIguNJninTnF6xTOMQ.pcD99u',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:20:54',	'2020-06-28 02:07:08',	'83'),
(155,	'Somename6',	'SomeLastname6',	'name6@example.com',	'uname6',	'$2y$10$Z6kNYxT3YatxFmaMIr55V.truKxuLpwUApLLm2AA6l4.HiG7F/1ky',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:21:06',	'2020-06-28 02:07:18',	'84'),
(156,	'Somename7',	'SomeLastname7',	'name7@example.com',	'uname7',	'$2y$10$wU60GmbdFrhRFKZqZoi/yOoG9/OwdPOsw/yLCJWBX2hgnhFUqg2Ey',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:21:14',	'2020-06-28 02:07:34',	'85'),
(157,	'Somename8',	'SomeLastname8',	'name8@example.com',	'uname8',	'$2y$10$96CGiR3xqLFiSGH1AcufXufrnuhoyxeErbpF9GvuLMmUbI3jQA3MW',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:21:19',	'2020-06-28 02:07:45',	'86'),
(158,	'Somename9',	'SomeLastname9',	'name9@example.com',	'uname9',	'$2y$10$V9Px2jaC1gIlruUlCBeO0.X4VRDmqdlziKTQF4WQPNdCGdRHvmMzy',	'NULL',	'NULL',	0,	1,	'2020-06-27 21:21:30',	'2020-06-28 02:07:57',	'86,89');

-- 2020-06-28 14:50:24
