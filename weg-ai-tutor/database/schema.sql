-- WEG AI Tutor - database schema
-- Matches the structure used in the Phrovilla project (MySQL)

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('student', 'teacher', 'parent') NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  class_id INT NULL,  -- links students to a class/grade
  grade_level INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  teacher_id INT NOT NULL,
  grade_level INT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS curriculum_docs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  uploaded_by INT NOT NULL,  -- teacher id
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,     -- raw text extracted from uploaded material
  subject VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS questions_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  conversation_id VARCHAR(100) NOT NULL,
  student_message TEXT NOT NULL,
  tutor_reply TEXT NOT NULL,
  hint_level ENUM('none', 'nudge', 'partial', 'full') DEFAULT 'none',
  step_number INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Indexes for the teacher dashboard's per-student summary queries
CREATE INDEX idx_questions_student ON questions_log(student_id);
CREATE INDEX idx_questions_conversation ON questions_log(conversation_id);
