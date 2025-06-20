CREATE DATABASE taskManageMent;
use taskManageMent;

 
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Member') NOT NULL DEFAULT 'Member',
    avatar_url VARCHAR(255),
    phone_number VARCHAR(20),
    status ENUM('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_verified TINYINT(1) DEFAULT 0,
    login_type ENUM('local', 'google', 'facebook') DEFAULT 'local',
	google_id VARCHAR(255),
    facebook_id VARCHAR(255)
);

CREATE TABLE UserOTPs (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    project_description TEXT,
    project_status ENUM('Planning', 'In Progress', 'Completed', 'Canceled') DEFAULT 'Planning',
	/*start_date DATE NOT NULL,
    end_date DATE,
    actual_end_date DATE,*/
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

CREATE TABLE ProjectRole (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS User_Project;

CREATE TABLE User_Project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  role_id INT NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  endDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'accepted') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES ProjectRole(role_id),
  UNIQUE (user_id, project_id)
);


-- CREATE TABLE User_Project (
--     user_project_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     project_id INT NOT NULL,
--     role_id INT NOT NULL,
--     cost FLOAT DEFAULT 0.0,
--     startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     endDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     status ENUM('Active', 'Inactive') DEFAULT 'Active',
--     FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
--     FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
--     FOREIGN KEY (role_id) REFERENCES ProjectRole(role_id) ON DELETE CASCADE,
--     UNIQUE (user_id, project_id)
-- );

CREATE TABLE Sprints (
    sprint_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE RESTRICT
);

CREATE TABLE Sprint_Backlog (
    sprint_backlog_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_id INT DEFAULT NULL,  -- NULL khi chưa gán vào sprint
    title VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Assigned', 'Done', 'Deferred') DEFAULT 'Pending',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (sprint_id) REFERENCES Sprints(sprint_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);


CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_backlog_id INT NOT NULL,
    task_title VARCHAR(200) NOT NULL,
    task_description TEXT,
    task_status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    start_date DATE,
    due_date DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sprint_backlog_id) REFERENCES Sprint_Backlog(sprint_backlog_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);




CREATE TABLE Task_Assignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_percentage INT DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    status ENUM('Assigned', 'In Progress', 'Completed') DEFAULT 'Assigned',
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (assigned_by) REFERENCES Users(user_id),
    UNIQUE (task_id, user_id)
);


CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id)
    
);


CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_project INT,
    related_task INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (related_project) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (related_task) REFERENCES Tasks(task_id) ON DELETE CASCADE
);


CREATE TABLE Attachments (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    comment_id INT,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CHECK ((task_id IS NOT NULL AND comment_id IS NULL) OR (task_id IS NULL AND comment_id IS NOT NULL))
);


CREATE TABLE Temp_Users (
  temp_user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  otp_code VARCHAR(10),
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE UserOTPs
ADD COLUMN purpose ENUM('register', 'reset_password') DEFAULT 'register';


CREATE TABLE ProjectInvitations (
  invitation_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  invited_by INT NOT NULL,
  role_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  status ENUM('pending', 'accepted', 'expired', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES Projects(project_id),
  FOREIGN KEY (invited_by) REFERENCES Users(user_id),
  FOREIGN KEY (role_id) REFERENCES ProjectRole(role_id)
);

