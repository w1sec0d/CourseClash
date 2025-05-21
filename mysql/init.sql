-- CREATE DATABASE IF NOT EXISTS courseclash_db;

-- Usar la base de datos courseclash_db
-- USE courseclash_db;

-- Tablas de autenticación y usuarios
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

-- Tablas de cursos
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('student', 'teacher', 'assistant') NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participant (course_id, user_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    activity_type ENUM('task', 'quiz', 'announcement') NOT NULL,
    due_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT,
    file_url VARCHAR(255),
    additional_files JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    graded_by INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    feedback TEXT,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    points INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
	id INT AUTO_INCREMENT PRIMARY KEY,
	sender_id INT NOT NULL,
	receiver_id INT NOT NULL,
	message TEXT NOT NULL,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (receiver_id) REFERENCES users(id) on delete CASCADE
);

CREATE TABLE IF NOT EXISTS notifications(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	message TEXT NOT NULL,
	link_url VARCHAR(255),
	is_read BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	plan_name VARCHAR(100),
	start_date DATE,
	end_date DATE,
	is_active BOOLEAN DEFAULT TRUE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, hashed_password, full_name, is_active, is_superuser) 
VALUES ('profesor', 'profesor@gmail.com', '$2b$12$ZMvtGFcPHaAOw505skhUXOVZnNDYkgaaquM8HC8t4Ga7vkxL4z5Be', 'Teacher', TRUE, TRUE),
('estudiante', 'estudiante@gmail.com', '$2b$12$ZMvtGFcPHaAOw505skhUXOVZnNDYkgaaquM8HC8t4Ga7vkxL4z5Be', 'Student', TRUE, FALSE);