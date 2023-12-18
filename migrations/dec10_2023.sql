CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX email_index ON Users(email);


CREATE TABLE IF NOT EXISTS Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS UserRoles (
    user_id CHAR(36),
    role_id INT,
    PRIMARY KEY (user_id, role_id)
);

INSERT INTO Roles (role_name) VALUES 
('Admin'), 
('User');

