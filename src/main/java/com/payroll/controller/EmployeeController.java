package com.payroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.payroll.entity.Employee;
import com.payroll.repository.EmployeeRepository;

@RestController
@RequestMapping("/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository repository;

    // GET ALL EMPLOYEES
    @GetMapping
    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    // ADD EMPLOYEE
    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {

        if(employee.getEmpId() <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Employee ID must be greater than 0");
        }

        if(employee.getName() == null ||
           employee.getName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Employee Name is required");
        }

        if(employee.getBasicSalary() <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Basic Salary must be greater than 0");
        }

        if(repository.existsById(employee.getEmpId())) {
            return ResponseEntity
                    .badRequest()
                    .body("Employee ID already exists");
        }

        repository.save(employee);

        return ResponseEntity.ok("Employee Added Successfully");
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable int id) {

        if(!repository.existsById(id)) {
            return ResponseEntity
                    .badRequest()
                    .body("Employee Not Found");
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Employee Deleted Successfully");
    }

    // SEARCH EMPLOYEE
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable int id) {

        return repository.findById(id)
                .<ResponseEntity<?>>map(emp -> ResponseEntity.ok(emp))
                .orElseGet(() -> ResponseEntity
                        .status(404)
                        .body("Employee Not Found"));
    }

    // UPDATE EMPLOYEE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable int id,
            @RequestBody Employee employee) {

        Employee existing = repository.findById(id).orElse(null);

        if(existing == null) {
            return ResponseEntity.badRequest()
                    .body("Employee Not Found");
        }

        if(employee.getName() != null &&
           !employee.getName().trim().isEmpty()) {
            existing.setName(employee.getName());
        }

        if(employee.getBasicSalary() > 0) {
            existing.setBasicSalary(employee.getBasicSalary());
        }

        if(employee.getHra() > 0) {
            existing.setHra(employee.getHra());
        }

        if(employee.getAllowance() > 0) {
            existing.setAllowance(employee.getAllowance());
        }

        if(employee.getDeduction() >= 0) {
            existing.setDeduction(employee.getDeduction());
        }

        repository.save(existing);

        return ResponseEntity.ok("Employee Updated Successfully");
    }
}