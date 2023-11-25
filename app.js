// Require needed packages and files

const inquirer = require('inquirer');
const connection = require('./connection');

// Function that runs when you select get employee option from menu

function getAllEmployees() {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return;
        }
        console.table(results);
        mainMenu();
    });
}

// Function that runs when you select view all departments option from menu

function viewAllDepartments() {
    connection.query('SELECT id, name FROM department', (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }
        console.table(results);
        mainMenu();
    });
}

// Function that runs when you select view all roles option from menu

function viewAllRoles() {
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        INNER JOIN department ON role.department_id = department.id`;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching roles:', err);
            return;
        }
        console.table(results);
        mainMenu();
    });
}

// Function that runs when you select add department option from menu

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:',
            validate: input => input ? true : 'Please enter a department name.'
        }
    ])
    .then(answer => {
        const query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [answer.departmentName], (err, results) => {
            if (err) {
                console.error('Error adding department:', err);
                return;
            }
            console.log(`Department '${answer.departmentName}' added successfully.`);
            mainMenu();
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function that runs when you select add role option from menu

function addRole() {
    connection.query('SELECT id, name FROM department', (err, departments) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the new role:',
                validate: input => input ? true : 'Please enter a title.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the new role:',
                validate: input => !isNaN(input) ? true : 'Please enter a valid number.'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department does this role belong to?',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
            }
        ])
        .then(answers => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answers.title, answers.salary, answers.departmentId], (err, results) => {
                if (err) {
                    console.error('Error adding role:', err);
                    return;
                }
                console.log(`Role '${answers.title}' added successfully.`);
                mainMenu();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// Function that runs when you select add employee option from menu

function addEmployee() {
    const queryRoles = 'SELECT id, title FROM role';
    const queryEmployees = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
    
    Promise.all([
        connection.promise().query(queryRoles),
        connection.promise().query(queryEmployees)
    ]).then(([roles, employees]) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name:",
                validate: input => input ? true : 'Please enter a first name.'
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name:",
                validate: input => input ? true : 'Please enter a last name.'
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles[0].map(role => ({ name: role.title, value: role.id }))
            },
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: employees[0].map(emp => ({ name: emp.name, value: emp.id })).concat([{ name: 'None', value: null }])
            }
        ])
        .then(answers => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, results) => {
                if (err) {
                    console.error('Error adding employee:', err);
                    return;
                }
                console.log(`Employee '${answers.firstName} ${answers.lastName}' added successfully.`);
                mainMenu();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }).catch(error => {
        console.error('Error fetching roles or employees:', error);
    });
}

// Function that runs when you select update employee role option from menu

function updateEmployeeRole() {
    const queryEmployees = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
    const queryRoles = 'SELECT id, title FROM role';

    Promise.all([
        connection.promise().query(queryEmployees),
        connection.promise().query(queryRoles)
    ]).then(([employees, roles]) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee's role do you want to update?",
                choices: employees[0].map(emp => ({ name: emp.name, value: emp.id }))
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's new role?",
                choices: roles[0].map(role => ({ name: role.title, value: role.id }))
            }
        ])
        .then(answers => {
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(query, [answers.roleId, answers.employeeId], (err, results) => {
                if (err) {
                    console.error('Error updating employee role:', err);
                    return;
                }
                console.log("Employee's role updated successfully.");
                mainMenu();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }).catch(error => {
        console.error('Error fetching employees or roles:', error);
    });
}

// The main menu funtion, that utilizes inquirer to ask question then runs functions based off what you chose

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Update Employee Role', 'Exit']
        }
    ])
    .then(answers => {
        switch (answers.action) {
            case 'View All Employees':
                getAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log("Goodbye!");
                connection.end();
                return;
            default:
                console.log('Invalid action!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

mainMenu();
