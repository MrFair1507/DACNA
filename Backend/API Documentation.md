# 📝 Postman Collection (Markdown Version)

---

## ✅ 1. Authentication APIs

### 1.1 Register (Đăng ký)

- **Method:** POST
- **URL:** `/api/auth/register`
- **Headers:**
  - Content-Type: `application/json`
- **Body (raw JSON):**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

### 1.2 Send OTP (Gửi lại OTP)

- **Method:** POST
- **URL:** `/api/auth/send-otp`
- **Body:**

```json
{
  "email": "john@example.com"
}
```

---

### 1.3 Verify OTP

- **Method:** POST
- **URL:** `/api/auth/verify-otp`
- **Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

---

### 1.4 Login

- **Method:** POST
- **URL:** `/api/auth/login`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### 1.5 Logout

- **Method:** POST
- **URL:** `/api/auth/logout`
- **Headers:**
  - Cookie: `token=your_jwt_token`

---

### 1.6 Get Current User

- **Method:** GET
- **URL:** `/api/auth/me`
- **Headers:**
  - Authorization: `Bearer your_jwt_token`

---

## ✅ 2. Project APIs

### 2.1 Create Project

- **Method:** POST
- **URL:** `/api/projects`
- **Headers:** Authorization: Bearer token
- **Body:**

```json
{
  "project_name": "Task Manager App",
  "project_description": "Manage tasks in team",
  "members": [
    { "email": "member1@example.com", "role_id": 2 },
    { "email": "member2@example.com", "role_id": 3 }
  ]
}
```

---

### 2.2 Update Project

- **Method:** PUT
- **URL:** `/api/projects/:project_id`
- **Body:**

```json
{
  "project_name": "Updated Name",
  "project_description": "Updated desc"
}
```

---

### 2.3 Delete Project

- **Method:** DELETE
- **URL:** `/api/projects/:project_id`

---

### 2.4 Search Project

- **Method:** GET
- **URL:** `/api/projects/search?keyword=task`

---

## ✅ 3. Sprint APIs

### 3.1 Create Sprint

- **Method:** POST
- **URL:** `/api/sprints`
- **Body:**

```json
{
  "project_id": 1,
  "name": "Sprint 1",
  "description": "First sprint",
  "start_date": "2024-07-01",
  "end_date": "2024-07-15"
}
```

---

### 3.2 Update Sprint

- **Method:** PUT
- **URL:** `/api/sprints/:sprint_id`
- **Body:**

```json
{
  "name": "Sprint 1 Updated",
  "description": "Updated description",
  "start_date": "2024-07-02",
  "end_date": "2024-07-16"
}
```

---

### 3.3 Delete Sprint

- **Method:** DELETE
- **URL:** `/api/sprints/:sprint_id`

---

### 3.4 Search Sprint

- **Method:** GET
- **URL:** `/api/sprints/search?keyword=sprint`

---

## ✅ 4. Task APIs

### 4.1 Create Task

- **Method:** POST
- **URL:** `/api/tasks`
- **Body:**

```json
{
  "sprint_id": 1,
  "task_title": "Build login page",
  "task_description": "Implement login UI",
  "priority": "High",
  "assigned_user_id": 2
}
```

---

### 4.2 Update Task

- **Method:** PUT
- **URL:** `/api/tasks/:task_id`
- **Body:**

```json
{
  "task_title": "Update login page",
  "task_description": "Fix errors on login UI",
  "priority": "Medium"
}
```

---

### 4.3 Delete Task

- **Method:** DELETE
- **URL:** `/api/tasks/:task_id`

---

### 4.4 Search Task

- **Method:** GET
- **URL:** `/api/tasks/search?keyword=login`

---

## 🔐 Notes for Testing in Postman

- Auth APIs `/auth/*` — no token required for register/login.
- Project/Sprint/Task APIs — require **Authorization Header**:\
  `Authorization: Bearer your_jwt_token`
- Or Cookie: `token=your_jwt_token`

---

