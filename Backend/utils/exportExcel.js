// File: utils/excel.js
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const EXPORT_DIR = path.join(__dirname, '../exports');
const FILE_PATH = path.join(EXPORT_DIR, 'users.xlsx');

// Đảm bảo folder exports tồn tại
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

async function exportAllUsersToExcel(users) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Users');

    // Cấu trúc cột
    worksheet.columns = [
      { header: 'User ID', key: 'user_id', width: 10 },
      { header: 'Full Name', key: 'full_name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Password', key: 'password_plaintext', width: 25 },
      { header: 'Is Verified', key: 'is_verified', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 },
    ];

    // Ghi từng dòng người dùng
    users.forEach(user => {
      worksheet.addRow(user);
    });

    // Xuất file
    await workbook.xlsx.writeFile(FILE_PATH);
    console.log('✅ Exported users to Excel:', FILE_PATH);
    return { success: true, file: FILE_PATH };
  } catch (err) {
    console.error('❌ Error exporting users to Excel:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { exportAllUsersToExcel };
