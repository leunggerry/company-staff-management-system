/** Required Libraries
 *************************************************************************************************/
const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
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
  //get department_id
  db.query("SELECT id, name FROM departments", function (err, results) {
    var departmentsArr = results.map((department) => {
      // console.log(role);
      var departmentInfo = {
        name: department.name,
        value: department.id,
      };
      return departmentInfo;
    });
    //console.log(departmentsArr);
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
        type: "list",
        name: "departmentId",
        message: "What department does this role belong to?",
        choices: departmentsArr,
      },
    ];

    inquirer.prompt(roleQuestions).then((roleAnswers) => {
      //console.log(roleAnswers);
      const sqlQuery = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
      const params = [roleAnswers.newRole, roleAnswers.salary, roleAnswers.departmentId];

      //run query and call userAskAction when complete
      db.query(sqlQuery, params, (err, result) => {
        //log error if error
        if (err) {
          console.log("Failed to add role " + err);
        } else {
          console.log("Role Added");
        }

        askUserAction();
      });
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
function addAnEmployee() {
  // get the roles and manager
  db.query("SELECT id, title FROM roles", function (err, results) {
    var rolesArr = results.map((role) => {
      // console.log(role);
      var roleInfo = {
        name: role.title,
        value: role.id,
      };
      return roleInfo;
    });
    // console.log(rolesArr);

    //get the employees to select the manager
    db.query("SELECT id, first_name, last_name FROM employees", function (err, results) {
      var employeeArr = results.map((employee) => {
        var employeeInfo = {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
        return employeeInfo;
      });
      // add option for no manager
      employeeArr.push({ name: "No Mananger", value: null });

      //question for the employpee info
      const addEmployeeQuestions = [
        {
          type: "input",
          name: "firstName",
          message: "What is the first name of the employee?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the last name of the employee?",
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the role of the employee?",
          choices: rolesArr,
        },
        {
          type: "list",
          name: "managerId",
          message: "Who is the manager of the employee?",
          choices: employeeArr,
        },
      ];

      inquirer.prompt(addEmployeeQuestions).then((newEmployeeAnswers) => {
        // console.log(newEmployeeAnswers);
        const sqlQuery =
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
        const params = [
          newEmployeeAnswers.firstName,
          newEmployeeAnswers.lastName,
          newEmployeeAnswers.roleId,
          newEmployeeAnswers.managerId,
        ];
        db.query(sqlQuery, params, function (err, results) {
          if (err) {
            console.log("Failed to add new employee to DB");
          } else {
            console.log("New Employee added");
          }
          askUserAction();
        });
      });
    });
  });
}

function updateEmployeeRole() {
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
      // console.log(rolesArr);
      const employeeUpdateQuestions = [
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
      inquirer.prompt(employeeUpdateQuestions).then((updateAnswers) => {
        // console.log(updateAnswers.employeeId);
        // console.log(updateAnswers.roleId);

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
        addAnEmployee();
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
