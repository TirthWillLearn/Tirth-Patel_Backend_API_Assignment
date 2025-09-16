-- Created: Deliverable for Database Optimization Task
-- This file includes:
-- 1) Simple schema: students, courses, enrollments
-- 2) Sample INSERTs (small)
-- 3) Queries:
--    - Top 5 most enrolled courses
--    - Number of active students in the last 30 days (by enrollment)
-- 4) Index suggestions (simple)

-- ================================
-- 1) Create schema (simple)
-- ================================
CREATE DATABASE IF NOT EXISTS school;
USE school;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table (simple many-to-many)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_student_course (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ================================
-- 2) Sample data (small)
-- ================================
INSERT INTO students (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

INSERT INTO courses (title, description) VALUES
('Math 101', 'Basic Mathematics'),
('History 201', 'World History'),
('CS 101', 'Intro to Computer Science'),
('Physics 101', 'Basic Physics'),
('Art 101', 'Introduction to Art');

-- A few enrollments with different dates
INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES
(1, 1, NOW() - INTERVAL 5 DAY),
(1, 3, NOW() - INTERVAL 40 DAY),
(2, 1, NOW() - INTERVAL 10 DAY),
(2, 2, NOW() - INTERVAL 20 DAY),
(3, 1, NOW() - INTERVAL 2 DAY),
(3, 4, NOW() - INTERVAL 15 DAY),
(2, 3, NOW() - INTERVAL 35 DAY),
(1, 2, NOW() - INTERVAL 1 DAY);

-- ================================
-- 3) Queries + explanations
-- ================================

-- Query A: Top 5 most enrolled courses (simple and easy)
-- Explanation:
--  - This query counts enrollments per course by joining courses with enrollments.
--  - LEFT JOIN is used so courses with zero enrollments will still appear (count = 0).
--  - GROUP BY aggregates per course. ORDER BY sorts by count descending.
--  - LIMIT 5 returns top 5.
SELECT
  c.id,
  c.title,
  COUNT(e.id) AS enroll_count
FROM courses c
LEFT JOIN enrollments e
  ON e.course_id = c.id
GROUP BY c.id, c.title
ORDER BY enroll_count DESC
LIMIT 5;

-- Query B: Number of active students in the last 30 days (by enrollment)
-- Explanation:
--  - This counts distinct student IDs who have enrolled within the last 30 days.
--  - We use COUNT(DISTINCT ...) to avoid counting the same student multiple times if they enrolled in multiple courses.
SELECT
  COUNT(DISTINCT e.student_id) AS active_students_last_30d
FROM enrollments e
WHERE e.enrolled_at >= CURDATE() - INTERVAL 30 DAY;

-- ================================
-- 4) Simple index suggestions (easy)
-- ================================
-- Explanation:
--  - These indexes are simple and help the two queries above.
--  - idx_enrollments_course_id: speeds up grouping/joins by course_id (top courses).
--  - idx_enrollments_enrolled_at: speeds up date-range filters (last 30 days).
--  - idx_students_email: fast lookup for students by email (login, if used).
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- ================================
-- 5) Short notes for reviewer (plain English)
-- ================================
-- Notes:
--  - Schema is intentionally simple (students, courses, enrollments).
--  - The "active students" metric here is defined as students who enrolled in the last 30 days.
--    If your dataset tracks last_login, you could use that column instead for a different definition of activity.
--  - Indexes above are low-risk and helpful even on modest dataset sizes.
--  - For production-scale systems, consider additional measures (caching top-N, read replicas),
--    but they are not required for this simple task.
