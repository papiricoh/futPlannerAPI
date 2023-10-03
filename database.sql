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
    shield_url VARCHAR(255),

);

CREATE TABLE IF NOT EXISTS categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS sub_categories(
    id INT PRIMARY KEY AUTO_INCREMENT,
    sub_category_name VARCHAR(20) NOT NULL,
    category_id INT,

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
    home_team_id INT,
    away_team_id INT,

    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);


CREATE TABLE IF NOT EXISTS report(
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    /* DATOS DE RENDIMIENTO DEL JUGADOR */

    FOREIGN KEY (player_id) REFERENCES player(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

