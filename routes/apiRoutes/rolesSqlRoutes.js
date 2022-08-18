/** Required Libraries
 *************************************************************************************************/
const db = require("../../db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

/** Constants
 *************************************************************************************************/
const roleQuestions = [
  {
    type: "input",
    name: "newRole",
    message: "What is the new role you would like to add?",
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for this role?",
  },
  {
    type: "input",
    name: "department",
    message: "What department does this role belong to?",
  },
];
/** Utility functions
 *************************************************************************************************/
async function addARole() {
  return inquirer.prompt(roleQuestions).then((roleAnswers) => {
    sqlAddRole(roleAnswers.newRole, roleAnswers.salary, roleAnswers.department);
  });
}
/** SQL Functions
 *************************************************************************************************/
/**
 * @description: SQL call to get all the roles
 * @returns
 */
function getAllRoles() {
  db.query("SELECT * FROM roles", function (err, results) {
    console.log("\n");
    console.table("Roles", results);
    console.log("\n\n");
  });
  return true;
}

function sqlAddRole(role, salary, department) {
  return db.query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
    [role, salary, department],
    (err, result) => {
      if (err) {
        console.log("Failed to add role");
        return;
      }
      console.log("Role added " + result);
      return;
    }
  );
}

module.exports = { getAllRoles, addARole };