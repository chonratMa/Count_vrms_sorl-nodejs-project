const connection_vrms = require('../config/connection_vrms.js');

async function check_vrms_data() {
    const sql = "SELECT count(*) as total_vrms FROM vrms.vehicles";
    // console.log('SQL::check_vrms_data: ', sql);
    // console.log('-----###------');

    // Execute the query with a callback
    return new Promise((resolve, reject) => {
        connection_vrms.query(sql, (err, results) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล In check_vrms_data:', err);
                reject(err);
                return;
            }


            // Resolve the promise with the query results
            resolve(results);
        });
    });
}

module.exports = { check_vrms_data }