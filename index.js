const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "Xy*Jay-Z-Best",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

const initialChoiceArray = [
  "view all departments",
  "view all roles",
  "view all employees",
  "add a department",
  "add a role",
  "add an employee",
  "update an employee role",
  "quit",
];

function getAllDepartments() {
  db.query("SELECT * FROM departments", function (err, results) {
    console.table(results);
    inquirer
      .prompt([
        {
          type: "list",
          message: "Do you want to continue?",
          choices: ["Yes", "No"],
          name: "continue",
        },
      ])
      .then((response) => {
        if (response.continue === "Yes") {
          init();
        } else {
          console.log("See you next time!");
          exit();
        }
      });
  });
}

function getAllRoles() {
  db.query(
    "SELECT roles.id AS ID, roles.title AS title, roles.salary AS salary, departments.department_name AS department FROM roles JOIN departments ON roles.department_id = departments.id",
    function (err, results) {
      console.table(results);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Do you want to continue?",
            choices: ["Yes", "No"],
            name: "continue",
          },
        ])
        .then((response) => {
          if (response.continue === "Yes") {
            init();
          } else {
            console.log("See you next time!");
            exit();
          }
        });
    }
  );
}

function getAllEmployees() {
  db.query(
    "SELECT e1.id AS ID, e1.first_name AS firstName, e1.last_name AS lastName, concat(e2.first_name, ' ', e2.last_name) AS Manager, roles.title AS Title, departments.department_name AS Department, roles.salary AS Salary FROM employees AS e1 LEFT JOIN employees AS e2 ON e1.manager_id = e2.id JOIN roles ON e1.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY ID ASC",
    function (err, results) {
      console.table(results);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Do you want to continue?",
            choices: ["Yes", "No"],
            name: "continue",
          },
        ])
        .then((response) => {
          if (response.continue === "Yes") {
            init();
          } else {
            console.log("See you next time!");
          }
        });
    }
  );
}

function addDepartment() {
  let departmentName;

  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter department name:",
        name: "department_name",
      },
    ])
    .then((response) => {
      if (!response.department_name.trim().length) {
        console.log("Invalid input, please try again");
        addDepartment();
      } else {
        departmentName = response.department_name;
        const sql = `INSERT INTO departments (department_name)
        VALUES (?)`;
        // const params = JSON.stringify(departmentName);
        db.query(sql, departmentName, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }

          inquirer
            .prompt([
              {
                type: "list",
                message: "Do you want to continue?",
                choices: ["Yes", "No"],
                name: "continue",
              },
            ])
            .then((response) => {
              if (response.continue === "Yes") {
                init();
              } else {
                console.log("See you next time!");
              }
            });
        });
      }
    });
}

function addRole() {
  db.query(`SELECT department_name FROM departments`, function (err, results) {
    if (err) {
      console.log(err);
      return;
    } else {
      let nameArray = results.map((el) => {
        return el.department_name;
      });
      let departmentName;

      inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter role name:",
            name: "role_name",
          },
          {
            type: "input",
            message: "Please enter role salary:",
            name: "role_salary",
          },
          {
            type: "list",
            message: "Please select a department:",
            choices: nameArray,
            name: "role_department",
          },
        ])
        .then((response) => {
          if (
            !response.role_name.trim().length ||
            !response.role_salary.trim().length
          ) {
            console.log("Invalid input, please try again");
            addRole();
          } else {
            departmentName = response.role_department;
            db.query(
              `SELECT id FROM departments WHERE department_name = '${departmentName}'`,
              function (err, results) {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  const sql = `INSERT INTO roles (title, salary, department_id)
              VALUES (?, ?, ?)`;
                  const params = [
                    response.role_name,
                    parseInt(response.role_salary),
                    results[0].id,
                  ];
                  console.log(params);
                  db.query(sql, params, (err, result) => {
                    if (err) {
                      console.log(err);
                      return;
                    }

                    inquirer
                      .prompt([
                        {
                          type: "list",
                          message: "Do you want to continue?",
                          choices: ["Yes", "No"],
                          name: "continue",
                        },
                      ])
                      .then((response) => {
                        if (response.continue === "Yes") {
                          init();
                        } else {
                          console.log("See you next time!");
                        }
                      });
                  });
                }
              }
            );
          }
        });
    }
  });
}

function addEmployee() {
  let roleChoices;
  let managerChoices;
  db.query(`SELECT title FROM roles`, function (err, results) {
    if (err) {
      console.log(err);
      return;
    } else {
      roleChoices = results.map((el) => {
        return el.title;
      });
      db.query(
        `SELECT concat(first_name, ' ', last_name) AS manager FROM employees`,
        function (err, results) {
          if (err) {
            console.log(err);
            return;
          } else {
            managerChoices = results.map((el) => {
              return el.manager;
            });

            let role_title;
            let manager_name;
            let array = [];

            inquirer
              .prompt([
                {
                  type: "input",
                  message: "Please enter first name:",
                  name: "employee_firstName",
                },
                {
                  type: "input",
                  message: "Please enter last name:",
                  name: "employee_lastName",
                },
                {
                  type: "list",
                  message: "Please select a role:",
                  choices: roleChoices,
                  name: "employee_role",
                },
                {
                  type: "list",
                  message: "Please select a manager for this employee:",
                  choices: managerChoices,
                  name: "employee_manager",
                },
              ])
              .then((response) => {
                if (
                  !response.employee_firstName.trim().length ||
                  !response.employee_lastName.trim().length
                ) {
                  console.log("Invalid input, please try again");
                  addEmployee();
                } else {
                  role_title = response.employee_role;
                  manager_name = response.employee_manager;
                  db.query(
                    `SELECT id FROM roles WHERE title = '${role_title}'`,
                    function (err, results) {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        array.push(results[0].id);
                        db.query(
                          `SELECT id FROM employees WHERE concat(first_name, ' ', last_name) = '${manager_name}'`,
                          function (err, results) {
                            array.push(results[0].id);
                            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
                            const params = [
                              response.employee_firstName,
                              response.employee_lastName,
                              ...array,
                            ];
                            console.log(params);
                            db.query(sql, params, (err, result) => {
                              if (err) {
                                console.log(err);
                                return;
                              }

                              inquirer
                                .prompt([
                                  {
                                    type: "list",
                                    message: "Do you want to continue?",
                                    choices: ["Yes", "No"],
                                    name: "continue",
                                  },
                                ])
                                .then((response) => {
                                  if (response.continue === "Yes") {
                                    init();
                                  } else {
                                    console.log("See you next time!");
                                  }
                                });

                              array = [];
                            });
                          }
                        );
                      }
                    }
                  );
                }
              });
          }
        }
      );
    }
  });
}

function updateEmployeeRole() {
  let employeeArray;
  let roleArray;
  db.query(
    `SELECT concat(first_name, ' ', last_name) AS employee FROM employees`,
    function (err, results) {
      if (err) {
        console.log(err);
        return;
      } else {
        employeeArray = results.map((el) => {
          return el.employee;
        });
        db.query(`SELECT title FROM roles`, function (err, results) {
          if (err) {
            console.log(err);
            return;
          } else {
            roleArray = results.map((el) => {
              return el.title;
            });

            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Please choose an employee",
                  choices: employeeArray,
                  name: "target_employee",
                },
                {
                  type: "list",
                  message: "Please choose a new role",
                  choices: roleArray,
                  name: "new_role",
                },
              ])
              .then((response) => {
                const newRole = response.new_role;
                const targetEmployee = response.target_employee;

                db.query(
                  `SELECT id FROM roles WHERE title = '${newRole}'`,
                  function (err, results) {
                    if (err) {
                      console.log(err);
                      return;
                    } else {
                      const newID = results[0].id;
                      db.query(
                        `UPDATE employees SET role_id = ${newID} WHERE concat(first_name, ' ', last_name) = '${targetEmployee}'`,
                        function (err, results) {
                          if (err) {
                            console.log(err);
                            return;
                          }

                          inquirer
                            .prompt([
                              {
                                type: "list",
                                message: "Do you want to continue?",
                                choices: ["Yes", "No"],
                                name: "continue",
                              },
                            ])
                            .then((response) => {
                              if (response.continue === "Yes") {
                                init();
                              } else {
                                console.log("See you next time!");
                              }
                            });
                        }
                      );
                    }
                  }
                );
              });
          }
        });
      }
    }
  );
}

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Hey there, what would you like to do?",
        choices: initialChoiceArray,
        name: "initialChoice",
      },
    ])
    .then((response) => {
      if (response.initialChoice === "view all departments") {
        getAllDepartments();
      } else if (response.initialChoice === "view all roles") {
        getAllRoles();
      } else if (response.initialChoice === "view all employees") {
        getAllEmployees();
      } else if (response.initialChoice === "add a department") {
        addDepartment();
      } else if (response.initialChoice === "add a role") {
        addRole();
      } else if (response.initialChoice === "add an employee") {
        addEmployee();
      } else if (response.initialChoice === "update an employee role") {
        updateEmployeeRole();
      } else {
        console.log("see you next time!");
      }
    });
}

init();
