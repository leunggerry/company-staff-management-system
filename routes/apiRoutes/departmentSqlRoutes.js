/** Required Libraries
 *************************************************************************************************/
const db = require("../../db/connection");
const cTable = require("console.table");

/** Main Function
 *************************************************************************************************/
function getAllDepartments() {
  return db.query("SELECT * FROM departments", function (err, results) {
    console.log("\n");
    console.table("Departments", results);
    console.log("\n");
  });
}

module.exports = { getAllDepartments };
