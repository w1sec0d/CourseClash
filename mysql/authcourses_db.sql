-- Crear la base de datos si no existe
-- CREATE DATABASE IF NOT EXISTS authcourses_db;
-- Usar la base de datos recién creada
-- USE authcourses_db;

-- Crear la tabla "users"
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(255),
    bio TEXT,
    experience_points INT DEFAULT 0
); 
