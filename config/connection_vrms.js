const mysql = require('mysql2');

// สร้างการเชื่อมต่อกับฐานข้อมูล MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // password: 'Admin@123',
    database: 'vrms',
});


connection.connect((err) => {
    if (err) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:', err);
        return;
    }
    console.log('เชื่อมต่อกับฐานข้อมูลเรียบร้อยแล้ว');
});



// ปิดการเชื่อมต่อ
// connection.end();


module.exports = connection;
