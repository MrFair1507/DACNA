const db = require("../models/db");

module.exports = async function notifyExpiringSprints() {
  try {
    const [sprints] = await db.query(`
      SELECT sprint_id, name, end_date, project_id
      FROM Sprints
      WHERE DATEDIFF(end_date, CURDATE()) = 1
    `);

    for (const sprint of sprints) {
      const [members] = await db.query(`
        SELECT user_id FROM User_Project 
        WHERE project_id = ? AND status = 'accepted'
      `, [sprint.project_id]);

      for (const member of members) {
        await db.query(`
          INSERT INTO Notifications (user_id, project_id, message, related_project)
          VALUES (?, ?, ?, ?)
        `, [
          member.user_id,
          sprint.project_id,
          `Sprint "${sprint.name}" sẽ hết hạn vào ngày mai.`,
          sprint.project_id,
        ]);
      }
    }

    if (sprints.length > 0) {
      console.log(`✅ Đã gửi thông báo cho ${sprints.length} sprint sắp hết hạn.`);
    }
  } catch (err) {
    console.error("❌ Lỗi khi gửi thông báo sprint sắp hết hạn:", err.message);
  }
};
