# 📘 Task Management API Documentation

Generated: 2025-05-28

---

## 🔐 Auth

### `POST /api/auth/register`
Đăng ký người dùng mới và gửi OTP qua email.

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### `POST /api/auth/login`
Đăng nhập và nhận JWT trong cookie.

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### `POST /api/auth/logout`
Xoá token khỏi cookie.

### `GET /api/auth/me`
Lấy thông tin hồ sơ người dùng đang đăng nhập.

---

## 👤 Projects

### `POST /api/projects`
Tạo một dự án mới và gửi lời mời thành viên qua email.

#### 🔐 Yêu cầu:
- Người tạo phải đăng nhập (JWT lưu trong cookie)

#### 📥 Body:
```json
{
  "project_name": "Dự án Quản lý",
  "project_description": "Hệ thống quản lý nhóm",
  "members": [
    { "email": "user1@example.com", "role_id": 2 },
    { "email": "user2@example.com", "role_id": 3 }
  ]
}
```

#### 🧠 Cơ chế:
- `created_by`: được lấy từ JWT tự động (`req.user.user_id`)
- Nếu email tồn tại:
  - Thêm vào `User_Project` với `status = 'pending'`
  - Gửi email xác nhận có nút "Tham gia dự án"
- Nếu email chưa tồn tại:
  - Gửi email mời đăng ký và tham gia sau

### `GET /api/projects/invite/accept?email=...&project=...`
Xác nhận người dùng muốn tham gia dự án.
- Cập nhật `status = accepted` trong `User_Project`
- Chuyển hướng về frontend `http://localhost:5173/projects/:id`

### `GET /api/projects/my-projects`
Trả về các dự án mà người dùng hiện tại đã **chấp nhận tham gia**.

---

## 📅 Sprints

### `POST /api/sprints`
Tạo sprint cho một dự án.

```json
{
  "project_id": 1,
  "name": "Sprint 1",
  "description": "Giai đoạn đầu",
  "start_date": "2025-06-01",
  "end_date": "2025-06-15",
  "created_by": 1
}
```

---

## 📦 Sprint Backlog (Product Backlog)

### `POST /api/sprint-backlog`
Tạo backlog chưa gán vào sprint.

```json
{
  "project_id": 1,
  "title": "Xây module đăng nhập",
  "created_by": 1
}
```

### `PUT /api/sprint-backlog/:id/assign`
Gán sprint backlog vào sprint.

```json
{
  "sprint_id": 2
}
```

---

## ✅ Tasks (Task Breakdown)

### `POST /api/tasks`
Tạo task breakdown cho sprint backlog.

```json
{
  "sprint_backlog_id": 3,
  "task_title": "Thiết kế UI đăng nhập",
  "task_description": "Sử dụng ReactJS",
  "priority": "High",
  "start_date": "2025-06-01",
  "due_date": "2025-06-03",
  "created_by": 1
}
```

### `GET /api/tasks/:id`
Lấy thông tin 1 task.

### `PUT /api/tasks/:id`
Cập nhật task.

### `DELETE /api/tasks/:id`
Xoá task.

---

## 🧑‍💻 Task Assignments

### `POST /api/task-assignments`
Phân công người làm task.

```json
{
  "task_id": 1,
  "user_id": 2,
  "assigned_by": 1
}
```

---

## 📌 Ghi chú
- Tất cả route yêu cầu xác thực đều dựa vào cookie chứa JWT.
- Thành viên tham gia dự án phải xác nhận qua email để có `status = accepted`.
- Những người chưa xác nhận hoặc chưa đăng ký sẽ ở trạng thái `pending`.
