const solr = require('solr-client');
const axios = require('axios');
const { parseString } = require('xml2js');

const xmlData_false = false;
async function solr_Query() {
  // URL ของ Solr core ที่คุณต้องการเชื่อมต่อ
  const solrUrl = 'http://10.254.23.122:8983/solr/select?indent=on&version=2.2&q=type_t%3A%27vehiclereg%27&fq=&start=0&rows=1&fl=*%2Cscore&wt=&explainOther=&hl.fl=';
  // console.log('sql: ', solrUrl);
  
  return new Promise((resolve, reject) => {
    axios.get(solrUrl)
      .then(response => {
        // console.log('ส่งคำสั่งและรับข้อมูล JSON จาก Solr');

        if (response.status !== 200) {
          console.error('###เกิดข้อผิดพลาดในการเชื่อมต่อ Solr:', response.status);
          resolve(xmlData_false);
          return;
        }

        const xmlData = response.data;
        console.log('------ :แสดงผลลัพธ์ data==Solr: ------');

        // แปลงข้อมูล XML เป็น JSON
        parseString(xmlData, (err, result) => {
          if (err) {
            console.error(err);
            resolve(xmlData_false);
          } else {
            // ดึงค่า numFound จาก JSON ที่ได้
            const numFound = result.response.result[0].$.numFound;
            console.log('numFound:', numFound);
            
            resolve(numFound); // ส่งค่า numFound กลับไป
          }
        });

      })
      .catch(error => {
        console.error('##เกิดข้อผิดพลาดในการเชื่อมต่อ Solr:', error.message);
        resolve(xmlData_false);
      });
  });
}

module.exports = { solr_Query };
