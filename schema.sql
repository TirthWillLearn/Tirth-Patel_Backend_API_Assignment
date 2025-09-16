CREATE DATABASE IF NOT EXISTS course_platform;
USE course_platform;


CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role ENUM('student','admin') NOT NULL DEFAULT 'student',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS courses (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10,2) DEFAULT 0,
created_by INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS enrollments (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
course_id INT NOT NULL,
enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
status ENUM('active','cancelled') DEFAULT 'active',
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
UNIQUE KEY uq_user_course (user_id, course_id)
);


-- Optional index to speed up course listing by created_at
CREATE INDEX idx_courses_created_at ON courses(created_at);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);