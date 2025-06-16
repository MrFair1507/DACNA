USE taskmanagement;

ALTER TABLE UserOTPs 
ADD COLUMN purpose ENUM('register', 'reset_password') DEFAULT 'register'; 