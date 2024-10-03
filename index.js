const connection_vrms = require('./config/connection_vrms.js');
const { solr_Query } = require('./Model/solr-client.js'); // แก้ไข path ให้ถูกต้องตามที่คุณใช้จริง
const { check_vrms_data } = require('./Model/check_vrms_data.js');
const clc = require('cli-color');
//////////////////
////////////////// 

check_total_data();

//////////////////
////////////////// 
async function check_total_data() {
  try {
    console.log('--- Start Get total Data ---');
    // 
    let vrms_data = await check_vrms_data();
    let total_vrms = vrms_data[0].total_vrms;
    console.log(clc.blue("------##VRMS##------"));
    // console.log(typeof vrms_data);
    // console.log(vrms_data);
    console.log('Total Vrms ', vrms_data);


    let solr_data = await solr_Query();
    let total_solr = parseInt(solr_data);
    console.log(clc.green("------##SoRl##------"));
    // console.log(typeof solr_data);
    // console.log(solr_data);
    console.log('Total Sorl ', solr_data);
    console.log(clc.yellow("------####------"));

    // เรียกฟังก์ชันเพื่อเพิ่มข้อมูลลงในตาราง
    await insertLogData(total_vrms, total_solr);
    console.log(clc.red("------#### ข้อมูลบันทึกเรียบร้อยแล้ว ####------"));
    process.exit(0);
    // ###############
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Function check_total_data :', error);
    // เรียกฟังก์ชันเพื่อเพิ่มข้อมูลลงในตาราง
    await insertErrorLogData(0, 0, error);
    process.exit(0);
  }
}

// ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบที่ต้องการ
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 จึงต้องบวก 1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ฟังก์ชัน insertLogData
async function insertLogData(total_vrms, total_solr) {
  const currentDateTime = getCurrentDateTime();
  const sql = `INSERT INTO count_vrms_solr_logs (total_vrms, total_solr, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
      connection_vrms.query(sql, [total_vrms, total_solr, 1, currentDateTime, currentDateTime], (err, results) => {
          if (err) {
              console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลลงใน count_vrms_solr_logs:', err);
              reject(err);
              return;
          }
          console.log('เพิ่มข้อมูลสำเร็จ:', results);
          resolve(results);
      });
  });
}

// Error
async function insertErrorLogData(total_vrms, total_solr) {
  const currentDateTime = getCurrentDateTime();
  const sql = `INSERT INTO count_vrms_solr_logs (total_vrms, total_solr, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
      connection_vrms.query(sql, [total_vrms, total_solr, 0, currentDateTime, currentDateTime], (err, results) => {
          if (err) {
              console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลลงใน count_vrms_solr_logs:', err);
              reject(err);
              return;
          }
          console.log('เพิ่มข้อมูลสำเร็จ:', results);
          resolve(results);
      });
  });
}