INSERT INTO departments (name)
VALUES 
  ('Sales'),
  ('Legal'),
  ('Finance'),
  ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Software Developer', 100000, 4),
  ('Senior Software Developer', 150000, 4),
  ('Engineer Manager', 160000, 4),
  ('HR Admin', 75000, 2),
  ('Sales Manager', 120000, 1),
  ('Accountant', 150000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Fraser', 3, NULL),
  ('Jack', 'London', 2, 1),
  ('Robert', 'Bruce', 2, 1),
  ('Peter', 'Greenaway', 2, 1),
  ('Derek', 'Jarman', 1, 3),
  ('Paolo', 'Pasolini', 1, 3),
  ('Heathcote', 'Williams', 4, NULL),
  ('Sandy', 'Powell', 5, NULL),
  ('Emil', 'Zola', 6, NULL);
