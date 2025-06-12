const express = require("express");
const router = express.Router();
const db = require("../models/db");
const authenticate = require("../middlewares/authMiddleware");
const requestlogger = require("../middlewares/requestLogger");
const invitationController = require("../controllers/invitationController");
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
//  API: Lấy danh sách thành viên của một project
router.get('/:projectId/members', authenticate, async (req, res) => {
  const { projectId } = req.params;

  try {
    const [members] = await db.query(`
      SELECT u.user_id, u.full_name, u.email, pr.role_name
      FROM User_Project up
      JOIN Users u ON u.user_id = up.user_id
      JOIN ProjectRole pr ON pr.role_id = up.role_id
      WHERE up.project_id = ? AND up.status = 'accepted'
    `, [projectId]);

    res.status(200).json(members);
  } catch (err) {
    console.error("❌ Lỗi lấy thành viên dự án:", err.message);
    res.status(500).json({ error: 'Không thể lấy danh sách thành viên' });
  }
});


// Tạo dự án và mời thành viên
router.post("/", authenticate, requestlogger, async (req, res) => {
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
router.post("/:id/invite", authenticate, requestlogger, async (req, res) => {
  const project_id = req.params.id;
  const user_id = req.user.user_id;
  const { email, role_id } = req.body;

  try {
    const [[pm]] = await db.query(
      `
      SELECT * FROM User_Project WHERE user_id = ? AND project_id = ? AND role_id = 1
    `,
      [user_id, project_id]
    );

    if (!pm)
      return res.status(403).json({ error: "Chỉ PM được mời thành viên" });

    const [[user]] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    if (user) {
      await db.query(
        `
        INSERT INTO User_Project (user_id, project_id, role_id, cost, status)
        VALUES (?, ?, ?, 0, 'pending')
      `,
        [user.user_id, project_id, role_id]
      );
    }

    await invitationController.sendInvitationByEmail(
      {
        body: {
          projectId: project_id,
          emails: [email],
          role: role_id,
          message: "Tham gia dự án",
        },
        user: { user_id: created_by },
      },
      res
    );
    res.json({ message: "Đã gửi lời mời" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi mời người dùng" });
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
router.put("/:id", authenticate, requestlogger, async (req, res) => {
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
