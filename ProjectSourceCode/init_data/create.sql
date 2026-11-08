-- Users table
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    wins INT DEFAULT 0 NOT NULL,
    losses INT DEFAULT 0 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    experience INT DEFAULT 0 NOT NULL
);

-- Fighters table
CREATE TABLE IF NOT EXISTS fighters(
    id SERIAL PRIMARY KEY,
    creator_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    health INT DEFAULT 0 NOT NULL,
    attack INT DEFAULT 0 NOT NULL,
    defense INT DEFAULT 0 NOT NULL,
    alteration INT DEFAULT 0 NOT NULL,
    permanence INT DEFAULT 0 NOT NULL,
    agility INT DEFAULT 0 NOT NULL,
    element VARCHAR(255) NOT NULL,
    image BYTEA DEFAULT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Moves table
CREATE TABLE IF NOT EXISTS moves(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    damage INT DEFAULT 0 NOT NULL,
    type VARCHAR(255) NOT NULL,
    alter_attack INT DEFAULT 0 NOT NULL,
    alter_defense INT DEFAULT 0 NOT NULL,
    alter_alteration INT DEFAULT 0 NOT NULL,
    alter_permanence INT DEFAULT 0 NOT NULL,
    alter_agility INT DEFAULT 0 NOT NULL,
    alter_self_attack INT DEFAULT 0 NOT NULL,
    alter_self_defense INT DEFAULT 0 NOT NULL,
    alter_self_alteration INT DEFAULT 0 NOT NULL,
    alter_self_permanence INT DEFAULT 0 NOT NULL,
    alter_self_agility INT DEFAULT 0 NOT NULL,
    alter_self_health INT DEFAULT 0 NOT NULL,
    element VARCHAR(255) NOT NULL
);

-- Users_to_fighters table
-- Keeps track of which fighters belong to which users
-- Make sure to always insert the default fighters into this table for every user
CREATE TABLE IF NOT EXISTS users_to_fighters(
    user_id INT NOT NULL,
    fighter_id INT NOT NULL,
    PRIMARY KEY (user_id, fighter_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fighter_id) REFERENCES fighters(id)
);

-- Moves_to_fighters table
CREATE TABLE IF NOT EXISTS moves_to_fighters(
    move_id INT NOT NULL,
    fighter_id INT NOT NULL,
    PRIMARY KEY (move_id, fighter_id),
    FOREIGN KEY (move_id) REFERENCES moves(id),
    FOREIGN KEY (fighter_id) REFERENCES fighters(id)
);

-- Fights table
CREATE TYPE fight_status AS ENUM ('player1_wins', 'player2_wins', 'draw', 'in_progress');
CREATE TABLE IF NOT EXISTS fights(
    id SERIAL PRIMARY KEY,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    player1_fighter_id INT NOT NULL,
    player2_fighter_id INT NOT NULL,
    current_player_id INT DEFAULT NULL,
    turns_played INT DEFAULT 0 NOT NULL,
    player1_health INT DEFAULT 0 NOT NULL,
    player2_health INT DEFAULT 0 NOT NULL,
    status fight_status DEFAULT 'in_progress' NOT NULL,
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (player1_fighter_id) REFERENCES fighters(id),
    FOREIGN KEY (player2_fighter_id) REFERENCES fighters(id),
    FOREIGN KEY (current_player_id) REFERENCES users(id)
);