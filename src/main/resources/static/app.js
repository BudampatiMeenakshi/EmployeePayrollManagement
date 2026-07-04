const API = "http://localhost:8081/employees";

// ADD EMPLOYEE
async function addEmployee() {

    const empId = document.getElementById("empId").value.trim();
    const name = document.getElementById("name").value.trim();
    const basicSalary = document.getElementById("basicSalary").value.trim();
    const hra = document.getElementById("hra").value.trim();
    const allowance = document.getElementById("allowance").value.trim();
    const deduction = document.getElementById("deduction").value.trim();

    if(
        empId === "" ||
        name === "" ||
        basicSalary === "" ||
        hra === "" ||
        allowance === "" ||
        deduction === ""
    ){
        alert("Please fill all fields");
        return;
    }

    const emp = getFormData();

    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emp)
    });

    const message = await res.text();

    alert(message);

    clearForm();

    loadEmployees();
}

// UPDATE EMPLOYEE
async function updateEmployee() {

    const id = document.getElementById("empId").value;

    if (!id) {
        alert("Enter Employee ID");
        return;
    }

    const emp = getFormData();

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emp)
    });

    const data = await res.text();

    alert(data);

    clearForm();
    loadEmployees();
}

// DELETE EMPLOYEE
async function deleteEmployee(id) {

    if(!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    const msg = await res.text();

    alert(msg);

    loadEmployees();
}

// SEARCH EMPLOYEE
async function searchEmployee() {

    const id = document.getElementById("searchId").value;

    if (!id) {
        loadEmployees();
        return;
    }

    const res = await fetch(`${API}/${id}`);

    if (!res.ok) {
        alert("Employee Not Found");
        return;
    }

    const emp = await res.json();

    renderTable([emp]);
}

// LOAD ALL EMPLOYEES
async function loadEmployees() {

    const res = await fetch(API);

    const data = await res.json();

    renderTable(data);

    updateDashboard(data);
}

// DASHBOARD
function updateDashboard(data) {

    document.getElementById("totalEmployees").innerText =
        data.length;

    let payroll = 0;

    data.forEach(emp => {
        payroll += emp.netSalary;
    });

    document.getElementById("totalPayroll").innerText =
        "₹" + payroll;

    const avg =
        data.length > 0
            ? Math.round(payroll / data.length)
            : 0;

    document.getElementById("avgSalary").innerText =
        "₹" + avg;
}

// GET FORM DATA
function getFormData() {

    return {
        empId: parseInt(document.getElementById("empId").value) || 0,
        name: document.getElementById("name").value,
        basicSalary: parseFloat(document.getElementById("basicSalary").value) || 0,
        hra: parseFloat(document.getElementById("hra").value) || 0,
        allowance: parseFloat(document.getElementById("allowance").value) || 0,
        deduction: parseFloat(document.getElementById("deduction").value) || 0
    };
}

// FILL FORM FOR EDIT
function fillForm(emp) {

    document.getElementById("empId").value = emp.empId;
    document.getElementById("name").value = emp.name;
    document.getElementById("basicSalary").value = emp.basicSalary;
    document.getElementById("hra").value = emp.hra;
    document.getElementById("allowance").value = emp.allowance;
    document.getElementById("deduction").value = emp.deduction;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// GENERATE PAYSLIP
function generatePayslip(emp) {

    alert(
        "EMPLOYEE PAYSLIP\n\n" +
        "Employee ID : " + emp.empId + "\n" +
        "Name : " + emp.name + "\n" +
        "Basic Salary : ₹" + emp.basicSalary + "\n" +
        "HRA : ₹" + emp.hra + "\n" +
        "Allowance : ₹" + emp.allowance + "\n" +
        "Deduction : ₹" + emp.deduction + "\n\n" +
        "Gross Salary : ₹" + emp.grossSalary + "\n" +
        "Net Salary : ₹" + emp.netSalary
    );
}

// CLEAR FORM
function clearForm() {

    document.getElementById("empId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("basicSalary").value = "";
    document.getElementById("hra").value = "";
    document.getElementById("allowance").value = "";
    document.getElementById("deduction").value = "";
}

// RENDER TABLE
function renderTable(data) {

    let rows = "";

    data.forEach(emp => {

        rows += `
        <tr>

            <td>${emp.empId}</td>

            <td>${emp.name}</td>

            <td>${emp.basicSalary}</td>

            <td>${emp.netSalary}</td>

            <td>
                <button onclick='generatePayslip(${JSON.stringify(emp)})'>
                    Payslip
                </button>
            </td>

            <td>
                <button onclick='fillForm(${JSON.stringify(emp)})'>
                    Edit
                </button>

                <button onclick='deleteEmployee(${emp.empId})'>
                    Delete
                </button>
            </td>

        </tr>`;
    });

    document.getElementById("employeeTable").innerHTML = rows;
}

// INITIAL LOAD
loadEmployees();