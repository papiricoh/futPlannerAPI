CREATE DATABASE IF NOT EXISTS futplanner;
USE futplanner;


CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    date_of_birth DATE,
    last_token_key VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS clubs(
    id INT PRIMARY KEY AUTO_INCREMENT,
    club_name VARCHAR(255) NOT NULL,
    shield_url VARCHAR(255)

);

CREATE TABLE IF NOT EXISTS categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    sub_category_name VARCHAR(20) NOT NULL,
    category_id INT NOT NULL,

    FOREIGN KEY (category_id) REFERENCES categories(id) 
);

CREATE TABLE IF NOT EXISTS teams(
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(255) NOT NULL,
    shield_url VARCHAR(255),
    sub_category_id INT NOT NULL,
    club_id INT NOT NULL,

    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) 
);

CREATE TABLE IF NOT EXISTS trainers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    team_id INT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id) 
);

CREATE TABLE IF NOT EXISTS owners(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    club_id INT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id) 
);

CREATE TABLE IF NOT EXISTS players(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    position VARCHAR(100),
    shirt_number INT,
    nationality VARCHAR(100) NOT NULL,
    team_id INT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id) 
);

CREATE TABLE IF NOT EXISTS matches(
    id INT PRIMARY KEY AUTO_INCREMENT,
    match_date DATE,
    google_maps_coords VARCHAR(255),
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,

    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);


CREATE TABLE IF NOT EXISTS reports(
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    /* DATOS DE RENDIMIENTO DEL JUGADOR */
    played_time INT DEFAULT '0',
    goals INT DEFAULT '0',
    red_cards INT DEFAULT '0',
    yellow_cards INT DEFAULT '0',
    recoveries INT DEFAULT '0',
    fouls INT DEFAULT '0',
    penalties INT DEFAULT '0',

    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

ALTER TABLE futplanner.users ADD CONSTRAINT users_UN UNIQUE KEY (username);


INSERT INTO users (id, username, password, first_name, last_name) VALUES (1, 'Admin', '$2b$10$0n9TEDVIGCyUICtRE5CrMuR2Rgux7os4RleTFzWwkCWkAjQMMxajO', 'Admin', 'Admin');
INSERT INTO clubs (id, club_name) VALUES (1, 'Test FC');
INSERT INTO categories (id, category_name) VALUES (1, 'Alevin');
INSERT INTO sub_categories (id, sub_category_name, category_id) VALUES (1, '1º', 1);
INSERT INTO teams (id, team_name, sub_category_id, club_id) VALUES (1, 'Test Alevin', 1, 1);
INSERT INTO users (id, username, password, first_name, last_name) VALUES (2, 'TestTrainer', 'password', 'Trainer', 'Test');
INSERT INTO trainers (id, user_id, team_id) VALUES (1, 2, 1);

INSERT INTO users (id, username, password, first_name, last_name) VALUES (3, 'TestUser 1', 'password', 'Pacido', 'Dofw');
INSERT INTO players (user_id, team_id) VALUES (3, 1);
INSERT INTO users (id, username, password, first_name, last_name) VALUES (4, 'TestUser 2', 'password', 'John', 'Cooper');
INSERT INTO players (user_id, team_id) VALUES (4, 1);
INSERT INTO users (id, username, password, first_name, last_name) VALUES (5, 'TestUser 3', 'password', 'Red', 'Hull');
INSERT INTO players (user_id, team_id) VALUES (5, 1);
