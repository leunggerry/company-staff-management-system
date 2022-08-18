/** Required Libraries
 *************************************************************************************************/
const mysql = require("mysql2");

/** Main Functinos
 *************************************************************************************************/
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log("Connected to the employee database")
);

module.exports = db;
