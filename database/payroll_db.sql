CREATE DATABASE payroll_db;

USE payroll_db;

CREATE TABLE employee(
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    basic_salary DOUBLE,
    hra DOUBLE,
    allowance DOUBLE,
    deduction DOUBLE
);