const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '../exports/users.xlsx');

async function exportAllUsersToExcel(users) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('All Users');

  worksheet.columns = [
    { header: 'User ID', key: 'user_id', width: 10 },
    { header: 'Full Name', key: 'full_name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Password', key: 'password_plaintext', width: 25 },
    { header: 'Is Verified', key: 'is_verified', width: 15 },
    { header: 'Created At', key: 'created_at', width: 20 },
  ];

  users.forEach(user => {
    worksheet.addRow(user);
  });

  await workbook.xlsx.writeFile(FILE_PATH);
  console.log('✅ Exported users to Excel:', FILE_PATH);
}

module.exports = { exportAllUsersToExcel };
