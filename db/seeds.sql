INSERT INTO departments (department_name)
VALUES ("sales"),
       ("IT"),
       ("HR");


INSERT INTO roles (title, salary, department_id)
VALUES ("sales rep", 50000, 1),
       ("hiring manager", 60000, 3),
       ("sales associates", 40000, 1),
       ("network engineer", 70000, 2),
       ("web developer", 65000, 2),
       ("head interviewer", 55000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Jamal", "Chase", 3, NULL),
       ("Patrick", "Mahomes", 1, 1),
       ("Stefon", "Diggs", 2, NULL),
       ("Saquon", "Barkley", 6, 3),
       ("Josh", "Allen", 4, NULL),
       ("Tyreek", "Hills", 5, 5);

