-- Users table
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wins INT DEFAULT 0 NOT NULL,
    losses INT DEFAULT 0 NOT NULL
);

-- Fighters table
CREATE TABLE IF NOT EXISTS fighters(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    health INT DEFAULT 0 NOT NULL,
    damage INT DEFAULT 0 NOT NULL,
    defense INT DEFAULT 0 NOT NULL,
    element VARCHAR(255) NOT NULL,
    image BYTEA DEFAULT NULL
);

-- Moves table
CREATE TABLE IF NOT EXISTS moves(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    damage INT DEFAULT 0 NOT NULL,
    accuracy INT DEFAULT 0 NOT NULL
);

-- Users_to_fighters table
CREATE TABLE IF NOT EXISTS users_to_fighters(
    user_id INT NOT NULL,
    fighter_id INT NOT NULL,
    PRIMARY KEY (user_id, fighter_id)
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fighter_id) REFERENCES fighters(id),
);

-- Moves_to_fighters table
CREATE TABLE IF NOT EXISTS moves_to_fighters(
    move_id INT NOT NULL,
    fighter_id INT NOT NULL,
    PRIMARY KEY (move_id, fighter_id),
    FOREIGN KEY (move_id) REFERENCES moves(id),
    FOREIGN KEY (fighter_id) REFERENCES fighters(id)
);