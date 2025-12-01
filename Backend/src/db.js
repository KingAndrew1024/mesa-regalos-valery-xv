const mysql = require('mysql2');

const connection = mysql.createConnection({
  //host: 'localhost', // Your MySQL host
  host: 'db5019107587.hosting-data.io', // Your MySQL host
  //user: 'xv-client', // Your MySQL username
  user: 'dbu2748503', // Your MySQL username
  //password: 'xv_client#2025', // Your MySQL password
  password: 'Andrew#Lennon_bb1981', // Your MySQL password
  //database: 'valery-xv', // The database you want to connect to
  database: 'dbs15021099', // The database you want to connect to
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;
