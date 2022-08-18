/** Required Libraries
 *************************************************************************************************/
const inquirer = require("inquirer");
const db = require("./db/connection");

//sql apis
const department = require("./routes/apiRoutes/departmentSqlRoutes");
const employee = require("./routes/apiRoutes/employeeSqlRoutes");
const roles = require("./routes/apiRoutes/rolesSqlRoutes");
/** Global Constants
 *************************************************************************************************/
const openingQuestions = [
  {
    type: "list",
    name: "userAction",
    message: "What would you like to do?",
    choices: [
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "View All Employees",
      "Quit",
    ],
  },
];

/** Function Definitions
 *************************************************************************************************/
function init() {
  console.log("-------------------------------------------------------------");
  console.log("                                                             ");
  console.log("       Welcome to the Company Staff Management Tool          ");
  console.log("                                                             ");
  console.log("-------------------------------------------------------------");

  askUserAction();
}

function askUserAction() {
  inquirer.prompt(openingQuestions).then((answer) => {
    //console.log(userAction);

    switch (answer.userAction) {
      case "View All Roles":
        roles.getAllRoles();
        return askUserAction();
        break;
      case "Update Employee Role":
      case "Add Role":
        roles.addARole().then(askUserAction);
        break;
      case "View All Departments":
        department.getAllDepartments().then(askUserAction);
        console.log("\n");
        break;
      case "Add Department":
      case "View All Employees":
        employee.getAllEmployees().then(askUserAction);
        break;
      case "Quit":
      default:
        return;
    }
  });
}
/** Main Function
 *************************************************************************************************/
init();

//department.getAllDepartments();
