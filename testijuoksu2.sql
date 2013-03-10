CREATE TABLE IF NOT EXISTS `testijuoksu2_runner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `sex` enum('M','F') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;


CREATE TABLE IF NOT EXISTS `testijuoksu2_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ;


CREATE TABLE IF NOT EXISTS `testijuoksu2_split` (
  `event` int(11) NOT NULL,
  `runner` int(11) NOT NULL,
  `split_number` int(11) NOT NULL,
  `split_time` time NOT NULL,
  PRIMARY KEY (`event`,`runner`,`split_number`),
  KEY `runner` (`runner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `testijuoksu2_options` (
  `option` varchar(30) NOT NULL,
  `value` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`option`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

