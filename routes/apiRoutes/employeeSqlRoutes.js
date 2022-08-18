/** Required Libraries
 *************************************************************************************************/
const db = require("../../db/connection");
const cTable = require("console.table");

/** Main Function
 *************************************************************************************************/
function getAllEmployees() {
  return db.query("SELECT * FROM employees", function (err, results) {
    console.log("\n");
    console.table("Employees", results);
  });
}

module.exports = { getAllEmployees };
