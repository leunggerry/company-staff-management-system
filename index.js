/** Required Libraries
 *************************************************************************************************/
const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
//sql apis
const department = require("./routes/apiRoutes/departmentSqlRoutes");
const employee = require("./routes/apiRoutes/employeeSqlRoutes");
//const { EMPLOYEE_UPDATE_QUESTIONS } = require("./routes/apiRoutes/employeeSqlRoutes");
const roles = require("./routes/apiRoutes/rolesSqlRoutes");
/** Global Constants
 *************************************************************************************************/
const openingQuestions = [
  {
    type: "list",
    name: "userAction",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "Add Department",
      "View All Roles",
      "Add Role",
      "View All Employees",
      "Add An Employee",
      "Update Employee Role",
      "Quit",
    ],
  },
];

/** Sql Function Helper
 *************************************************************************************************/
// DEPARTMENTS
function getAllDepartments() {
  db.query("SELECT * FROM departments", function (err, results) {
    console.log("\n");
    console.table("Departments", results);
    console.log("\n");

    askUserAction();
  });
}

function addADepartment() {
  const departmentQuestions = [
    {
      type: "input",
      name: "departmentName",
      message: "What is the department you would like to add?",
    },
  ];

  inquirer.prompt(departmentQuestions).then((departmentAnswers) => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = [departmentAnswers.departmentName];
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("Failed to add department");
      } else {
        // successfully added department
        console.log("New department added");
      }
      askUserAction();
    });
  });
}

// ROLES
/**
 * @description: SQL call to get all the roles
 * @returns
 */
function getAllRoles() {
  db.query("SELECT * FROM roles", function (err, results) {
    console.log("\n");
    console.table("Roles", results);
    console.log("\n\n");

    askUserAction();
  });
}

function addARole() {
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

  inquirer.prompt(roleQuestions).then((roleAnswers) => {
    const sqlQuery = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
    const params = [roleAnswers.role, roleAnswers.salary, roleAnswers.department];

    //run query and call userAskAction when complete
    db.query(sqlQuery, params, (err, result) => {
      //log error if error
      if (err) {
        console.log("Failed to add role");
      }

      askUserAction();
    });
  });
}

//EMPLOYEES
function getAllEmployees() {
  db.query("SELECT * FROM employees", function (err, results) {
    console.log("\n");
    console.table("Employees", results);
    console.log("\n");

    askUserAction();
  });
}

async function updateEmployeeRole() {
  // get all emplyees and create array for user view
  var employeeArr;
  db.query("SELECT id, first_name, last_name FROM employees", function (err, results) {
    employeeArr = results.map((employee) => {
      var employeeInfo = {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
      return employeeInfo;
    });

    // get all roles and create array for user view
    var rolesArr;
    db.query("SELECT id, title FROM roles", function (err, results) {
      console.log(results);
      rolesArr = results.map((role) => {
        var roleInfo = {
          name: role.title,
          value: role.id,
        };
        return roleInfo;
      });

      //console.log(employeeArr);
      console.log(rolesArr);
      const EMPLOYEE_UPDATE_QUESTIONS = [
        {
          type: "list",
          // emplyee id
          name: "employeeId",
          message: "What's the employee's name you want to update",
          //employee
          choices: employeeArr,
        },
        {
          type: "list",
          name: "roleId",
          message: "What role would you like to assign the selected employee?",
          choices: rolesArr,
        },
      ];
      inquirer.prompt(EMPLOYEE_UPDATE_QUESTIONS).then((updateAnswers) => {
        console.log(updateAnswers.employeeId);
        console.log(updateAnswers.roleId);

        db.query(
          "UPDATE employees SET role_id = ? WHERE id = ?",
          [updateAnswers.roleId, updateAnswers.employeeId],
          (err, result) => {
            console.log("Update complete: " + result.affectedRows);
          }
        );

        askUserAction();
      });
    });
  });
}
/** Main Function Definitions
 *************************************************************************************************/
function init() {
  console.log("-------------------------------------------------------------");
  console.log("                                                             ");
  console.log("       Welcome to the Company Staff Management Tool          ");
  console.log("                                                             ");
  console.log("-------------------------------------------------------------");

  askUserAction();
}

async function askUserAction() {
  inquirer.prompt(openingQuestions).then((answer) => {
    //console.log(userAction);

    switch (answer.userAction) {
      case "View All Roles":
        getAllRoles();
        break;
      case "Add Role":
        addARole();
        break;
      case "View All Departments":
        getAllDepartments();
        break;
      case "Add Department":
        addADepartment();
        break;
      case "Add An Employee":
        break;
      case "View All Employees":
        getAllEmployees();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "Quit":
      default:
        process.exit();
    }
  });
}

/** Main Function
 *************************************************************************************************/
init();

//department.getAllDepartments();
