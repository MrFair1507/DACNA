const express = require("express");
const router = express.Router();
const db = require("../models/db");
const authenticate = require("../middlewares/authMiddleware");
const { sendInvitationEmail } = require("../utils/mailer");

// Lấy dự án mà người dùng tham gia
router.get("/my-projects", authenticate, async (req, res) => {
  const user_id = req.user.user_id;
  const [projects] = await db.query(
    `
    SELECT p.* FROM Projects p
    JOIN User_Project up ON p.project_id = up.project_id
    WHERE up.user_id = ? AND up.status = 'accepted'
  `,
    [user_id]
  );
  res.json(projects);
});

// Tạo dự án và mời thành viên
router.post("/", authenticate, async (req, res) => {
  const created_by = req.user.user_id;
  const { project_name, project_description, members = [] } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Projects (project_name, project_description, created_by) VALUES (?, ?, ?)",
      [project_name, project_description, created_by]
    );
    const project_id = result.insertId;

    await db.query(
      `
      INSERT INTO User_Project (user_id, project_id, role_id, cost, status)
      VALUES (?, ?, 1, 0, 'accepted')
    `,
      [created_by, project_id]
    );

    for (const { email, role_id } of members) {
      const [[existing]] = await db.query(
        "SELECT * FROM Users WHERE email = ?",
        [email]
      );
      if (existing) {
        await db.query(
          `
          INSERT INTO User_Project (user_id, project_id, role_id, cost, status)
          VALUES (?, ?, ?, 0, 'pending')
        `,
          [existing.user_id, project_id, role_id]
        );
      }
      await sendInvitationEmail(email, project_name, project_id);
    }

    res.status(201).json({ message: "Tạo dự án thành công", project_id });
  } catch (err) {
    console.error("❌ Tạo project lỗi:", err.message);
    res.status(500).json({ error: "Không thể tạo dự án" });
  }
});

// Mời thêm thành viên vào dự án đã tạo
// POST /api/projects/:id/invite
router.post("/:id/invite", authenticate, async (req, res) => {
  const project_id = req.params.id;
  const { email, role_id } = req.body;
  const inviter_id = req.user.user_id;

  try {
    // 1. Kiểm tra inviter có phải PM của dự án này không
    const [[pm]] = await db.query(
      `
      SELECT * FROM User_Project 
      WHERE user_id = ? AND project_id = ? AND role_id = 1
    `,
      [inviter_id, project_id]
    );
    if (!pm)
      return res
        .status(403)
        .json({ error: "Chỉ Project Manager mới được mời người dùng" });

    // 2. Tìm người dùng qua email
    const [[user]] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    // 3. Kiểm tra xem người này đã có trong dự án này chưa
    let isInProject = false;
    if (user) {
      const [[existingRecord]] = await db.query(
        `
        SELECT * FROM User_Project 
        WHERE user_id = ? AND project_id = ?
      `,
        [user.user_id, project_id]
      );
      isInProject = !!existingRecord;
    }

    // 4. Nếu chưa, thêm vào User_Project với status 'pending'
    if (user && !isInProject) {
      await db.query(
        `
        INSERT INTO User_Project (user_id, project_id, role_id, cost, status)
        VALUES (?, ?, ?, 0, 'pending')
      `,
        [user.user_id, project_id, role_id]
      );
    }

    // 5. Gửi mail mời tham gia
    await sendInvitationEmail(email, "(Tên dự án)", project_id);
    res.status(200).json({ message: "Đã gửi lời mời" });
  } catch (err) {
    console.error("❌ Lỗi khi mời người dùng:", err.message);
    res.status(500).json({ error: "Không thể mời người dùng vào dự án" });
  }
});

// Xác nhận lời mời từ email
router.get("/invite/accept", async (req, res) => {
  const { email, project } = req.query;

  try {
    const [[user]] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    if (!user) return res.status(400).json({ error: "Email không tồn tại" });

    await db.query(
      `
      UPDATE User_Project SET status = 'accepted'
      WHERE project_id = ? AND user_id = ?
    `,
      [project, user.user_id]
    );

    res.redirect(`http://localhost:5173/projects/${project}`);
  } catch (err) {
    res.status(500).json({ error: "Xác nhận thất bại" });
  }
});

// Cập nhật dự án
router.put("/:id", authenticate, async (req, res) => {
  const { project_name, project_description, project_status } = req.body;
  await db.query(
    `
    UPDATE Projects
    SET project_name = ?, project_description = ?, project_status = ?
    WHERE project_id = ?
  `,
    [project_name, project_description, project_status, req.params.id]
  );
  res.json({ message: "Cập nhật dự án thành công" });
});

// Xoá dự án
router.delete("/:id", authenticate, async (req, res) => {
  await db.query("DELETE FROM Projects WHERE project_id = ?", [req.params.id]);
  res.json({ message: "Đã xoá dự án" });
});

module.exports = router;
