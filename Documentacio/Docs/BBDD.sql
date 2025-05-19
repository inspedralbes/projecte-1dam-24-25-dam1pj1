-- Adminer 5.2.1 MySQL 5.7.44 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `ACTUACIONS`;
CREATE TABLE `ACTUACIONS` (
  `id_actuacio` int(11) NOT NULL AUTO_INCREMENT,
  `id_incidencia` int(11) NOT NULL,
  `tecnic_id` int(11) DEFAULT NULL,
  `data_actuacio` datetime DEFAULT NULL,
  `descripcio` text,
  `temps_invertit` int(11) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_actuacio`),
  KEY `id_incidencia` (`id_incidencia`),
  KEY `tecnic_id` (`tecnic_id`),
  CONSTRAINT `ACTUACIONS_ibfk_1` FOREIGN KEY (`id_incidencia`) REFERENCES `INCIDENCIES` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ACTUACIONS_ibfk_2` FOREIGN KEY (`tecnic_id`) REFERENCES `TECNIC` (`id_tecnic`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ACTUACIONS` (`id_actuacio`, `id_incidencia`, `tecnic_id`, `data_actuacio`, `descripcio`, `temps_invertit`, `visible`) VALUES
(2,	2,	1,	'2025-05-19 10:09:55',	'Comprovació del cablejat, prova amb una altra font d’alimentació, substitució de la font.',	90,	1),
(4,	4,	1,	'2025-05-19 10:09:55',	'Comprovació de connexions VGA/HDMI, canvi de cable, configuració de pantalla duplicada.',	30,	2),
(5,	5,	1,	'2025-05-19 10:09:55',	'Comprovació de la sortida d’àudio seleccionada, drivers d’àudio, prova amb altres altaveus/auriculars. ',	30,	2);

DROP TABLE IF EXISTS `DEPARTAMENT`;
CREATE TABLE `DEPARTAMENT` (
  `id_dpt` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `ubicació` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_dpt`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `DEPARTAMENT` (`id_dpt`, `nom`, `ubicació`) VALUES
(1,	'Info-1',	NULL),
(2,	'Info-3',	NULL),
(3,	'Info-2',	NULL);

DROP TABLE IF EXISTS `INCIDENCIES`;
CREATE TABLE `INCIDENCIES` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_dpt` int(11) DEFAULT NULL,
  `usuari_id` int(11) DEFAULT NULL,
  `tecnic_id` int(11) DEFAULT NULL,
  `id_tipus` int(11) DEFAULT NULL,
  `descripcio` varchar(255) DEFAULT NULL,
  `prioridad` varchar(255) DEFAULT NULL,
  `estat` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_dpt` (`id_dpt`),
  KEY `tecnic_id` (`tecnic_id`),
  KEY `id_tipus` (`id_tipus`),
  CONSTRAINT `INCIDENCIES_ibfk_1` FOREIGN KEY (`id_dpt`) REFERENCES `DEPARTAMENT` (`id_dpt`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `INCIDENCIES_ibfk_2` FOREIGN KEY (`tecnic_id`) REFERENCES `TECNIC` (`id_tecnic`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `INCIDENCIES_ibfk_3` FOREIGN KEY (`id_tipus`) REFERENCES `TIPUS_INCIDENCIES` (`id_tipus`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `INCIDENCIES` (`id`, `id_dpt`, `usuari_id`, `tecnic_id`, `id_tipus`, `descripcio`, `prioridad`, `estat`, `createdAt`, `updatedAt`) VALUES
(2,	2,	1,	1,	1,	'L’ordinador no s’encén',	'Alta',	'Abierta',	'2025-05-19 10:09:55',	'2025-05-19 10:09:55'),
(4,	2,	2,	1,	1,	'El projector no mostra imatge.',	'Mitja',	'En progreso',	'2025-05-19 10:09:55',	'2025-05-19 10:09:55'),
(5,	3,	1,	1,	1,	' El so no funciona .',	'Mitja',	'Cerrada',	'2025-05-19 10:09:55',	'2025-05-19 10:09:55'),
(10,	2,	2,	1,	3,	'Prova 12345',	'Alta',	'Abierta',	'2025-05-19 10:59:18',	'2025-05-19 11:00:23'),
(11,	3,	1,	2,	4,	'czvfzsfascfafzaf',	'Alta',	'En progreso',	'2025-05-19 11:10:04',	'2025-05-19 11:10:04');

DROP TABLE IF EXISTS `TECNIC`;
CREATE TABLE `TECNIC` (
  `id_tecnic` int(11) NOT NULL AUTO_INCREMENT,
  `id_dpt` int(11) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id_tecnic`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `TECNIC` (`id_tecnic`, `id_dpt`, `nom`) VALUES
(1,	NULL,	'Jordi Rocha'),
(2,	NULL,	'Fiona Mondelo');

DROP TABLE IF EXISTS `TIPUS_INCIDENCIES`;
CREATE TABLE `TIPUS_INCIDENCIES` (
  `id_tipus` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_tipus`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `TIPUS_INCIDENCIES` (`id_tipus`, `nom`) VALUES
(1,	'Problema de hardware'),
(2,	'Problema de software'),
(3,	'Problema amb cablejat'),
(4,	'Problema amb conexio');

DROP TABLE IF EXISTS `USUARIS`;
CREATE TABLE `USUARIS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `USUARIS` (`id`, `username`, `password`, `isAdmin`) VALUES
(1,	'admin',	'12345',	1),
(2,	'juan',	'12345',	0);

-- 2025-05-19 11:16:34 UTC
