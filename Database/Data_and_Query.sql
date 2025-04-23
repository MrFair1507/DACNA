use taskmanagement;

#User table
-- 5 dòng bạn đã cung cấp
INSERT INTO Users (full_name, email, password_hash, is_verified) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$g9Fq5BhHYnnvhPXX1X9g5exn7hXgL.I7QAz8RewNUHrrznqRAO1ye', 0),
('Jane Smith', 'jane.smith@example.com', '$2a$10$GbcZR2A3Tc7LO1V5uYJe0.XcPbMbxtx1yxzq3HtSz2lVZ8qF9D3YS', 1),
('Emily Davis', 'emily.davis@example.com', '$2a$10$oyPVsmbSuLVX1grubOP5tO3g3X/IsjdpV7ptKaU7brwUKmEYXv9Xe', 0),
('Michael Johnson', 'michael.johnson@example.com', '$2a$10$DPkqnnRoX8RlVdWylgZ6FSuRqaMG9fNDRgMiJtPgtm44s0gptOOEK', 1),
('Sarah Brown', 'sarah.brown@example.com', '$2a$10$LP1ErEz9xtlZo8HCr8xL0shdTlRb5mj.eIEwG6GQdtRjpHpzJwBFW', 0),
('David Wilson', 'david.wilson@example.com', '$2a$10$aBc12345678WilsonPassHashedKey987654321', 1),
('Laura Martinez', 'laura.martinez@example.com', '$2a$10$zZzMartinez9876LauraPasswordHashKeyXXX', 0),
('Chris Evans', 'chris.evans@example.com', '$2a$10$MarvelChrisEvansCapAmericaSuperSecure1234', 1);


#Project Table
INSERT INTO Projects (project_name, project_description, project_status, created_by)
VALUES 
	('Website Bán Hàng', 'Xây dựng hệ thống bán hàng online', 'In Progress', 1),
	('Ứng dụng Quản lý nhân sự', 'Ứng dụng quản lý nhân sự nội bộ công ty', 'Planning', 2),
	('CRM Cho Doanh Nghiệp', 'Hệ thống quản lý khách hàng CRM', 'Completed', 1),
	('App Mobile Booking Spa', 'Ứng dụng đặt lịch spa và chăm sóc sắc đẹp', 'In Progress', 3),
	('Hệ thống E-learning', 'Nền tảng học trực tuyến cho sinh viên', 'Canceled', 2),
	('Website Blog Cá Nhân', 'Trang blog cá nhân với tính năng comment và upload ảnh', 'In Progress', 4);
INSERT INTO Projects (project_name, project_description, project_status, created_by)
VALUES ('TaskManagement', 'Trang web giúp quản lí công việc và dự án', 'In Progress', 16);
#Project Role Table
INSERT INTO ProjectRole (role_name, role_description)
VALUES 
	('Project Manager', 'Quản lý toàn bộ tiến trình và nhân sự dự án'),
	('Backend Developer', 'Phát triển hệ thống phía server'),
	('Frontend Developer', 'Phát triển giao diện người dùng'),
	('UI/UX Designer', 'Thiết kế giao diện và trải nghiệm người dùng'),
	('Tester', 'Kiểm thử hệ thống'),
	('Business Analyst', 'Phân tích yêu cầu và nghiệp vụ'),
	('Scrum Master', 'Điều phối theo mô hình Agile Scrum');
INSERT INTO ProjectRole (role_name, role_description)
	values(role_name, role_description);
#User_Project Table
INSERT INTO User_Project (user_id, project_id, role_id, cost)
VALUES 
(1, 1, 1, 15000.0),
(2, 1, 2, 12000.0),
(3, 1, 3, 11000.0),
(4, 2, 4, 10000.0),
(5, 3, 5, 9000.0),
(6, 4, 6, 8000.0),
(3, 5, 3, 9500.0);

INSERT INTO User_Project (user_id, project_id, role_id, cost)
VALUES (16, 7, 1, 0.0);
#Sprint Table
INSERT INTO Sprints (project_id, name, description, start_date, end_date, created_by)
VALUES
  (1, 'Sprint 1 - User Management', 'Đăng ký, đăng nhập, xác thực OTP, phân quyền, cập nhật hồ sơ cá nhân.', '2025-04-01', '2025-04-15', 1),
  (1, 'Sprint 2 - Project & Member Management', 'Tạo dự án, thêm thành viên, phân quyền, hiển thị thông tin dự án.', '2025-04-16', '2025-04-30', 1),
  (1, 'Sprint 3 - Task Management', 'Tạo công việc, phân công, theo dõi trạng thái, ưu tiên và thời hạn.', '2025-05-01', '2025-05-20', 1),
  (1, 'Sprint 4 - Collaboration & Reporting', 'Bình luận, thông báo, lịch làm việc và báo cáo tiến độ.', '2025-05-21', '2025-06-07', 1);


#Task Table // 
INSERT INTO Tasks (sprint_id, task_title, task_description, task_status,
  priority, start_date, due_date, created_by)
VALUES
	-- Sprint 1: User Management
	(1, 'Tạo chức năng đăng ký', 'Form và API đăng ký người dùng', 'Not Started', 'High', '2025-04-01', '2025-04-03', 1),
	(1, 'Tạo chức năng đăng nhập', 'Form và API đăng nhập, JWT', 'Not Started', 'High', '2025-04-03', '2025-04-06', 1),
	(1, 'Xác thực OTP qua email', 'Gửi mã OTP và xác minh', 'Not Started', 'Medium', '2025-04-06', '2025-04-08', 1),

	-- Sprint 2: Project Management
	(2, 'Tạo dự án mới', 'Form tạo mới, lưu vào bảng Projects', 'Not Started', 'High', '2025-04-16', '2025-04-17', 1),
	(2, 'Thêm người dùng vào dự án', 'Tìm user theo email/username và gán vào User_Project', 'Not Started', 'Medium', '2025-04-18', '2025-04-20', 1),

	-- Sprint 3: Task Management
	(3, 'Tạo task mới', 'Form + API tạo task thuộc sprint', 'Not Started', 'High', '2025-05-01', '2025-05-03', 1),
	(3, 'Phân công công việc', 'Chọn người và gán task', 'Not Started', 'Medium', '2025-05-03', '2025-05-06', 1),

	-- Sprint 4: Collaboration
	(4, 'Thêm bình luận cho task', 'Bình luận theo task_id', 'Not Started', 'Low', '2025-05-21', '2025-05-23', 1),
	(4, 'Gửi thông báo khi có task mới', 'Gửi email hoặc notification', 'Not Started', 'Low', '2025-05-23', '2025-05-25', 1);

#Task_Assignment Table 
INSERT INTO Task_Assignment (task_id, user_id, assigned_by, completion_percentage, status) 
VALUES
-- Sprint 1: User Management
(1, 2, 1, 80, 'In Progress'), -- User 2 đang làm chức năng đăng ký
(2, 3, 1, 20, 'Assigned'),    -- User 3 mới được giao đăng nhập
(3, 4, 1, 100, 'Completed'),  -- User 4 đã hoàn thành OTP

-- Sprint 2: Project Management
(4, 1, 1, 100, 'Completed'),  -- Người tạo tự xử lý tạo dự án
(5, 5, 1, 60, 'In Progress'), -- User 5 đang thêm người vào dự án

-- Sprint 3: Task Management
(6, 6, 1, 0, 'Assigned'),     -- User 6 mới được giao tạo task
(7, 4, 1, 10, 'Assigned'),    -- User 4 được giao phân công

-- Sprint 4: Collaboration
(8, 2, 1, 0, 'Assigned'),     -- User 2 được giao comment
(9, 3, 1, 0, 'Assigned');     -- User 3 được giao gửi thông báo



#Comment Table
INSERT INTO Comments (task_id, user_id, content)
VALUES 
	(1, 2, 'Tôi đã hoàn thành phần layout chính.'),
	(1, 1, 'Nhớ kiểm tra responsive trên mobile.'),
	(2, 3, 'API cần thêm xác thực JWT.'),
	(5, 5, 'Chức năng booking chưa ổn định.'),
	(6, 6, 'Viết test case chưa xong, đang làm.'),
	(3, 4, 'Yêu cầu chức năng rõ ràng, dễ làm.'),
	(3, 1, 'Cần thêm phân tích về phân quyền.');

#Notification Table
INSERT INTO Notifications (user_id, project_id, message, related_project, related_task)
VALUES 
	(2, 1, 'Bạn được giao task "Thiết kế giao diện"', 1, 1),
	(3, 1, 'Bạn có nhiệm vụ tạo API', 1, 2),
	(4, 2, 'Bạn có trách nhiệm phân tích yêu cầu', 2, 3),
	(5, 4, 'Bạn cần hoàn thành API booking', 4, 5),
	(6, 4, 'Bạn được giao kiểm thử hệ thống', 4, 6),
	(4, 5, 'Dự án E-learning đã bị hủy', 5, 7);
 
 #Attachment Table
 INSERT INTO Attachments (task_id, user_id, file_name, file_path, file_type, file_size)
VALUES 
	(1, 2, 'homepage_ui.png', '/uploads/homepage_ui.png', 'image/png', 1200),
	(2, 3, 'product_api.docx', '/uploads/product_api.docx', 'application/vnd', 400),
	(5, 5, 'booking_api.pdf', '/uploads/booking_api.pdf', 'application/pdf', 650),
	(6, 6, 'test_login.xlsx', '/uploads/test_login.xlsx', 'application/vnd', 300),
	(3, 4, 'requirements_analysis.pdf', '/uploads/requirements_analysis.pdf', 'application/pdf', 800),
	(1, 1, 'style_guide.jpg', '/uploads/style_guide.jpg', 'image/jpeg', 500);

 use taskmanagement;
 
 SELECT * FROM Users;
 SELECT * FROM Projects;
 SELECT * FROM ProjectRole;
 SELECT * FROM User_Project;
 SELECT * FROM Tasks;
 SELECT * FROM Task_Assignment;
 SELECT * FROM Comments;
 SELECT * FROM Notifications;
 SELECT * FROM Attachments;
 SELECT * FROM Sprints;
 Select * from Temp_Users;
-- SOME QUERIES COMMAND
Delete from users where user_id = 9;

-- AlTER TABLE
use taskManageMent;
ALTER TABLE Users MODIFY password_hash VARCHAR(255) NULL;
ALTER TABLE Users ADD COLUMN login_type ENUM('local', 'google', 'facebook', 'github') DEFAULT 'local';
ALTER TABLE Users ADD COLUMN facebook_id VARCHAR(255) DEFAULT NULL;

delete from users where user_id = 9;
SELECT * FROM userotps WHERE email = ?;
-- USER 

-- Lấy role_id của 'Manager'
select * from ProjectRole;
SELECT * from Users WHERE role ="Manager";

 -- Lấy danh sách tất cả người dùng
SELECT * FROM Users;
-- Lấy thông tin người dùng theo email
SELECT * FROM Users WHERE email = 'a.nguyen@example.com';
-- Lấy danh sách người dùng đang hoạt động
SELECT * FROM Users WHERE status = 'Active';


-- PROJECT

-- Lấy danh sách tất cả dự án
SELECT * FROM Projects;
-- Lấy dự án theo trạng thái
SELECT * FROM Projects WHERE project_status = 'In Progress';
-- Lấy dự án do người dùng tạo
SELECT * FROM Projects WHERE created_by = 1;


-- PROJECTROLE

-- Lấy tất cả vai trò
SELECT * FROM ProjectRole;
-- Tìm vai trò theo tên
SELECT * FROM ProjectRole WHERE role_name = 'Frontend Developer';


-- USER_PROJECT
-- Lấy danh sách người dùng trong một dự án cụ thể
SELECT 
  up.*, u.full_name, pr.role_name
FROM User_Project up
JOIN Users u ON up.user_id = u.user_id
JOIN ProjectRole pr ON up.role_id = pr.role_id
WHERE up.project_id = 1;
-- Lấy các dự án mà một người dùng đang tham gia
SELECT 
  up.*, p.project_name, pr.role_name
FROM User_Project up
JOIN Projects p ON up.project_id = p.project_id
JOIN ProjectRole pr ON up.role_id = pr.role_id
WHERE up.user_id = 2;

-- TASK

-- Lấy tất cả task trong một dự án
SELECT * FROM Tasks WHERE project_id = 1;

-- Lấy các task theo trạng thái
SELECT * FROM Tasks WHERE task_status = 'In Progress';
-- Lấy các task do người dùng tạo
SELECT * FROM Tasks WHERE created_by = 1;

-- TASK_ASSIGMENT

-- Lấy danh sách task được giao cho một user cụ thể
SELECT 
  ta.*, t.task_title, t.task_status
FROM Task_Assignment ta
JOIN Tasks t ON ta.task_id = t.task_id
WHERE ta.user_id = 2;
-- Lấy các task do một người giao (assigned_by)
SELECT 
  ta.*, t.task_title, u.full_name AS assigned_to
FROM Task_Assignment ta
JOIN Tasks t ON ta.task_id = t.task_id
JOIN Users u ON ta.user_id = u.user_id
WHERE ta.assigned_by = 1;

-- COMMENT

-- Lấy tất cả comment trong một task
SELECT c.*, u.full_name
FROM Comments c
JOIN Users u ON c.user_id = u.user_id
WHERE c.task_id = 1;
-- Lấy comment phản hồi (comment con)
SELECT * FROM Comments WHERE parent_comment_id IS NOT NULL;


-- NOTIFICATION

-- Lấy tất cả thông báo của một người dùng
SELECT * FROM Notifications WHERE user_id = 2 ORDER BY created_at DESC;
-- Lấy thông báo chưa đọc
SELECT * FROM Notifications WHERE user_id = 2 AND is_read = FALSE;


-- ATTACHMENT

-- Lấy tất cả tệp đính kèm theo task
SELECT * FROM Attachments WHERE task_id = 1;
-- Lấy tệp đính kèm trong bình luận
SELECT * FROM Attachments WHERE comment_id IS NOT NULL;
-- Lấy các file do một user upload
SELECT * FROM Attachments WHERE user_id = 3;


SELECT u.full_name, prj.project_name, r.role_name
FROM User_Project up
JOIN Users u ON up.user_id = u.user_id
JOIN Projects prj ON up.project_id = prj.project_id
JOIN ProjectRole r ON up.role_id = r.role_id
WHERE prj.project_id = 1;


SELECT u.full_name, r.role_name
FROM User_Project up
JOIN Users u ON u.user_id = up.user_id
JOIN ProjectRole r ON up.role_id = r.role_id
WHERE project_id = 1;

SELECT pr.role_name
FROM User_Project up
JOIN ProjectRole pr ON up.role_id = pr.role_id
WHERE up.user_id = 16 AND up.project_id = 7;

SELECT u.full_name, p.project_name, r.role_name
FROM User_Project up
JOIN Users u ON u.user_id = up.user_id
JOIN Projects p ON p.project_id = up.project_id
JOIN ProjectRole r ON r.role_id = up.role_id
WHERE p.project_id = 7 AND u.email = 'KhanhDang071124@gmail.com';

drop Table Task_Assignment;
drop Table Tasks;
