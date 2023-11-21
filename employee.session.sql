CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- @block
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('IT');
INSERT INTO department (name) VALUES ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 70000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('IT Support', 50000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Coordinator', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Johnson', 3, 1);

-- @block
SELECT * FROM role;