const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Your MySQL host
  user: 'xv-client', // Your MySQL username
  password: 'xv_client#2025', // Your MySQL password
  database: 'valery-xv', // The database you want to connect to
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;
