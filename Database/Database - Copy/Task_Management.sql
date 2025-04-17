CREATE DATABASE TaskManagement;
USE TaskManagement;

-- 1. Bảng Người dùng
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Quản lý', 'Thành viên', 'Cá nhân') NOT NULL,
    avatar_url VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Bảng Dự án
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Đang thực hiện', 'Hoàn thành', 'Hủy bỏ') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 3. Bảng Thành viên dự án (User_Project)
CREATE TABLE User_Project (
    user_project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    role ENUM('Chủ dự án', 'Thành viên') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);

-- 4. Bảng Công việc
CREATE TABLE Task (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Chưa bắt đầu', 'Đang thực hiện', 'Hoàn thành') NOT NULL,
    priority ENUM('Thấp', 'Trung bình', 'Cao') NOT NULL,
    due_date DATETIME NOT NULL,
    project_id INT,
    created_by INT,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 5. Bảng Phân công công việc (Task_Assignment)
CREATE TABLE Task_Assignment (
    task_assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    FOREIGN KEY (task_id) REFERENCES Task(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 6. Bảng Bình luận
CREATE TABLE Comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Task(task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 7. Bảng Thông báo
CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message VARCHAR(255) NOT NULL,
    status ENUM('Đã đọc', 'Chưa đọc') DEFAULT 'Chưa đọc',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- 8. Bảng Tệp đính kèm
CREATE TABLE Attachment (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    uploaded_by INT,
    file_url VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Task(task_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 9. Bảng Báo cáo
CREATE TABLE Report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE SET NULL
);
