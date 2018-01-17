DROP TABLE IF EXISTS `grows`;

CREATE TABLE `grows` (
       `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
       `name` varchar(255) NOT NULL,
       `strain` varchar(255) DEFAULT NULL,
       `yield` int(4) DEFAULT NULL,
       `nutrients` text DEFAULT NULL,
       `started_at` datetime DEFAULT NULL,
       `ended_at` datetime DEFAULT NULL,
       `flowering_started_at` datetime DEFAULT NULL,
       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
       `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
       `name` varchar(255) NOT NULL,
       `address` varchar(255) DEFAULT NULL,
       `email` varchar(255) NOT NULL,
       PRIMARY KEY (`id`),
       UNIQUE KEY `member_email` (`email`),
       UNIQUE KEY `member_address` (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `grows_members`;

CREATE TABLE `grows_members` (
     `grow_id` int(11) unsigned NOT NULL,
     `member_id` int(11) unsigned NOT NULL,
     `shares` int(3) NOT NULL,
     `created_at` datetime NOT NULL,
     UNIQUE KEY `unique_grow_members` (`grow_id`, `member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
