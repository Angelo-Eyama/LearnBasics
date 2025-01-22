CREATE TABLE IF NOT EXISTS Submission (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `solution` varchar(255) NOT NULL,
    `language` varchar(255) NOT NULL,
    `status` varchar(255) NOT NULL,
    `timeSubmitted` date DEFAULT NULL,
    `timeUpdated` date DEFAULT NULL,
    `suggestions` varchar(255) NOT NULL,
    `problemId` int NOT NULL,
    `userId` int NOT NULL
);

CREATE TABLE IF NOT EXISTS Problem (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `difficulty` varchar(255) NOT NULL,
    `score` int NOT NULL,
    `expectedSolution` varchar(255) NOT NULL,
    `authorId` int DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS User (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `role` varchar(255) NOT NULL,
    `creationDate` date DEFAULT NULL,
    `score` int DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS Ruler (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(255) NOT NULL,
    `firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `creationDate` date DEFAULT NULL,
);

ALTER TABLE Problem ADD CONSTRAINT Problem_authorId_fk FOREIGN KEY (`authorId`) REFERENCES User (`id`);
ALTER TABLE Problem ADD CONSTRAINT Problem_id_fk FOREIGN KEY (`id`) REFERENCES Submission (`problemId`);
ALTER TABLE User ADD CONSTRAINT User_id_fk FOREIGN KEY (`id`) REFERENCES Submission (`userId`);