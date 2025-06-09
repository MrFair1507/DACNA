const express = require("express");
const router = express.Router();
const db = require("../models/db");
const puppeteer = require("puppeteer");

/**
 * GET /api/reports/tasks
 * Trả về danh sách task theo filter (tùy chọn: json, csv)
 */
router.get("/tasks", async (req, res) => {
  const { from, to, status, priority, user_id, format } = req.query;

  try {
    let sql = `
      SELECT t.task_id, t.task_title, t.task_status, t.priority, 
             t.start_date, t.due_date,
             u.full_name AS assigned_user, 
             ta.completion_percentage
      FROM Tasks t
      LEFT JOIN Task_Assignment ta ON t.task_id = ta.task_id
      LEFT JOIN Users u ON ta.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (from && to) {
      sql += " AND t.start_date >= ? AND t.due_date <= ?";
      params.push(from, to);
    }
    if (status) {
      sql += " AND t.task_status = ?";
      params.push(status);
    }
    if (priority) {
      sql += " AND t.priority = ?";
      params.push(priority);
    }
    if (user_id) {
      sql += " AND ta.user_id = ?";
      params.push(user_id);
    }

    const [rows] = await db.query(sql, params);

    if (format === "json" || !format) return res.json(rows);

    if (format === "csv") {
      const csv = rows.map((r) => Object.values(r).join(",")).join("\n");
      res.setHeader("Content-Disposition", "attachment; filename=report.csv");
      res.setHeader("Content-Type", "text/csv");
      return res.send(csv);
    }

    res.status(400).json({ message: "Format không hỗ trợ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi tạo báo cáo" });
  }
});

/**
 * GET /api/reports/project/:projectId/pdf
 * Xuất toàn bộ thông tin dự án thành file PDF
 */
router.get("/project/:projectId/pdf", async (req, res) => {
  const { projectId } = req.params;

  try {
    const [[project]] = await db.query(
      "SELECT * FROM Projects WHERE project_id = ?",
      [projectId]
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    const [sprints] = await db.query(
      "SELECT * FROM Sprints WHERE project_id = ?",
      [projectId]
    );
    const [backlogs] = await db.query(
      "SELECT * FROM Sprint_Backlog WHERE project_id = ?",
      [projectId]
    );
    const [tasks] = await db.query(
      `SELECT t.*, u.full_name AS assigned_user
        FROM Tasks t
        LEFT JOIN Task_Assignment ta ON t.task_id = ta.task_id
        LEFT JOIN Users u ON ta.user_id = u.user_id
        WHERE t.sprint_backlog_id IN (
          SELECT sb.sprint_backlog_id
          FROM Sprint_Backlog sb
          JOIN Sprints s ON sb.sprint_id = s.sprint_id
          WHERE s.project_id = ?
        )`, [projectId]
    );

    const html = `
      <html>
      <head>
        <style>
          body { font-family: sans-serif; font-size: 12px; padding: 20px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>📘 Báo cáo Dự án: ${project.project_name}</h1>
        <p><strong>Mô tả:</strong> ${project.project_description}</p>
        <p><strong>Trạng thái:</strong> ${project.project_status}</p>

        <h2>📂 Sprint</h2>
        <ul>
          ${sprints
            .map(
              (s) =>
                `<li><strong>${s.name}</strong> (${s.start_date} - ${s.end_date})</li>`
            )
            .join("")}
        </ul>

        <h2>📋 Sprint Backlog</h2>
        <ul>
          ${backlogs.map((b) => `<li>${b.title} [${b.status}]</li>`).join("")}
        </ul>

        <h2>✅ Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Người làm</th>
              <th>Trạng thái</th>
              <th>Ưu tiên</th>
            </tr>
          </thead>
          <tbody>
            ${tasks
              .map(
                (t) => `
              <tr>
                <td>${t.task_title}</td>
                <td>${t.assigned_user || "Chưa gán"}</td>
                <td>${t.task_status}</td>
                <td>${t.priority}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=project-${projectId}-report.pdf`
    );
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF Export Error:", err);
    res.status(500).json({ message: "Lỗi khi xuất PDF" });
  }
});

module.exports = router;
