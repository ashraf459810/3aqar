const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  user: "root",
  password: "12345678",
  host: "localhost",
  port: 3306,
  database: "new_schema"
});

module.exports = pool;
