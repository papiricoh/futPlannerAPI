CREATE DATABASE IF NOT EXISTS futplanner;
USE futplanner;



CREATE TABLE IF NOT EXISTS clubs(
    id INT PRIMARY KEY AUTO_INCREMENT,
    club_name VARCHAR(255) NOT NULL,
    shield_url VARCHAR(255),
    owner_id INT
);

CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    date_of_birth DATE,
    last_token_key VARCHAR(255),
    club_id INT NOT NULL,

    FOREIGN KEY (club_id) REFERENCES clubs(id) 
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

    CONSTRAINT trainer_user UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id) 
);

CREATE TABLE IF NOT EXISTS players(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    position VARCHAR(100) DEFAULT 'SUP',
    shirt_number INT,
    nationality VARCHAR(100),
    team_id INT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id) 
);

CREATE TABLE IF NOT EXISTS matches(
    id INT PRIMARY KEY AUTO_INCREMENT,
    match_date DATE,
    map_coords VARCHAR(255),
    place_name VARCHAR(255),
    home_team_id INT,
    home_team_name VARCHAR(255),
    away_team_id INT,
    away_team_name VARCHAR(255),
    sub_category_id INT NOT NULL,

    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);


CREATE TABLE IF NOT EXISTS reports(
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    /* DATOS DE RENDIMIENTO DEL JUGADOR */
    general_performance INT DEFAULT '0',
    tactical_performance INT DEFAULT '0',
    passes_quality INT DEFAULT '0',
    ball_control INT DEFAULT '0',
    game_vision INT DEFAULT '0',

    played_time INT DEFAULT '0',
    goals INT DEFAULT '0',
    red_cards INT DEFAULT '0',
    yellow_cards INT DEFAULT '0',

    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

ALTER TABLE futplanner.users ADD CONSTRAINT users_UN UNIQUE KEY (username);

INSERT INTO categories (id, category_name) VALUES (1, 'Prebenjamin');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 1);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 1);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 1);
INSERT INTO categories (id, category_name) VALUES (2, 'Benjamin');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 2);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 2);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 2);
INSERT INTO categories (id, category_name) VALUES (3, 'Alevin');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 3);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 3);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 3);
INSERT INTO categories (id, category_name) VALUES (4, 'Infantil');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 4);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 4);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 4);
INSERT INTO categories (id, category_name) VALUES (5, 'Cadete');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 5);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 5);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 5);
INSERT INTO categories (id, category_name) VALUES (6, 'Juvenil');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('Division de Honor', 6);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('Liga Nacional', 6);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 6);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 6);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('3º', 6);
INSERT INTO categories (id, category_name) VALUES (7, 'Aficionado/Regional');
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('Preferente', 7);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('1º', 7);
INSERT INTO sub_categories (sub_category_name, category_id) VALUES ('2º', 7);


INSERT INTO clubs (id, club_name) VALUES (1, 'Test FC');
INSERT INTO users (id, username, password, first_name, last_name, club_id) VALUES (1, 'Admin', '$2b$10$0n9TEDVIGCyUICtRE5CrMuR2Rgux7os4RleTFzWwkCWkAjQMMxajO', 'Admin', 'Admin', 1);

INSERT INTO teams (id, team_name, sub_category_id, club_id) VALUES (1, 'Test Alevin', 1, 1);
INSERT INTO users (id, username, password, first_name, last_name, club_id) VALUES (2, 'TestTrainer', 'password', 'Trainer', 'Test', 1);
INSERT INTO trainers (id, user_id, team_id) VALUES (1, 2, 1);

INSERT INTO users (id, username, password, first_name, last_name, club_id) VALUES (3, 'TestUser 1', 'password', 'Pacido', 'Dofw', 1);
INSERT INTO players (user_id, team_id) VALUES (3, 1);
INSERT INTO users (id, username, password, first_name, last_name, club_id) VALUES (4, 'TestUser 2', 'password', 'John', 'Cooper', 1);
INSERT INTO players (user_id, team_id) VALUES (4, 1);
INSERT INTO users (id, username, password, first_name, last_name, club_id) VALUES (5, 'TestUser 3', 'password', 'Red', 'Hull', 1);
INSERT INTO players (user_id, team_id) VALUES (5, 1);
