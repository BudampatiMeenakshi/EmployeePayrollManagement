package com.payroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.payroll.entity.Employee;

public interface EmployeeRepository
        extends JpaRepository<Employee, Integer> {

}