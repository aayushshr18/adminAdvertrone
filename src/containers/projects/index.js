import MetaTags from "../../components/meta-tags";
import "./style.scss";
import { mapProjectsData } from "../../data/projectsData";
import MainSection from "./main-section";
import Loader from "../../components/loader";
import React, { useState, useEffect } from "react";
import {
  getAllEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employees/allEmployees";
import TablePagination from "@mui/material/TablePagination";

import "./style.scss";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // Your custom styling here
  background: "#2a2185",
  color: "#e0e01c",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  // Your custom styling here
  background: "#2a2185",
  color: "#e0e01c",
}));

const Projects = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    name: "",
    mob_no: "",
    account_no: "",
    ifsc_code: "",
    upi_id: "",
    account_status: "",
    agent_code: "",
    password: "",
  });

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployee();
      if (response.success) {
        setEmployees(response.data.employees.reverse());
      } else {
        console.error("Error fetching employees:", response.error);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await addEmployee(newEmployee);
      if (response.success) {
        setEmployees([...employees, response.data.employee]);
        resetForm();
      } else {
        console.error("Error adding employee:", response.error);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleEditEmployee = async (id) => {
    try {
      const response = await updateEmployee(id, newEmployee);
      if (response.success) {
        const updatedEmployees = employees.map((emp) =>
          emp._id === id ? response.data.employee : emp
        );
        setEmployees(updatedEmployees);
        setEditing(false);
        setEditingId(null);
        resetForm();
      } else {
        console.error("Error editing employee:", response.error);
      }
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await deleteEmployee(id);
      if (response.success) {
        const filteredEmployees = employees.filter((emp) => emp._id !== id);
        setEmployees(filteredEmployees);
      } else {
        console.error("Error deleting employee:", response.error);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const resetForm = () => {
    setNewEmployee({
      email: "",
      name: "",
      mob_no: "",
      account_no: "",
      ifsc_code: "",
      upi_id: "",
      account_status: "",
      agent_code: "",
      password: "",
    });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleApprovedStatus = async (id, status) => {
    const data = {
      account_status: status,
    };
    const response = await updateEmployee(id, data);
    if (response.success) {
      console.log(response);
      const updatedEmployees = employees.map((emp) =>
        emp._id === id ? response.data.employee : emp
      );
      setEmployees(updatedEmployees);
      setEditing(false);
      setEditingId(null);
      resetForm();
    } else {
      console.error("Error editing employee:", response.error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div align="center">
      <h2 style={{ marginTop: "8px 0" }}>Employee Registration Page</h2>
      <form style={{ marginLeft: '80px' }}
        onSubmit={
          editing ? () => handleEditEmployee(editingId) : handleAddEmployee
        }
      >
        <input
          type="text"
          name="email"
          value={newEmployee.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="name"
          value={newEmployee.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="mob_no"
          value={newEmployee.mob_no}
          onChange={handleInputChange}
          placeholder="Mobile Number"
        />
        <input
          type="text"
          name="account_no"
          value={newEmployee.account_no}
          onChange={handleInputChange}
          placeholder="Account Number"
        />
        <input
          type="text"
          name="ifsc_code"
          value={newEmployee.ifsc_code}
          onChange={handleInputChange}
          placeholder="IFSC Code"
        />
        <input
          type="text"
          name="upi_id"
          value={newEmployee.upi_id}
          onChange={handleInputChange}
          placeholder="UPI ID"
        />
        <input
          type="text"
          name="account_status"
          value={newEmployee.account_status}
          onChange={handleInputChange}
          placeholder="Account Status"
        />
        <input
          type="text"
          name="agent_code"
          value={newEmployee.agent_code}
          onChange={handleInputChange}
          placeholder="Agent Code"
        />
        <input
          type="text"
          name="password"
          value={newEmployee.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <button type="submit">{editing ? "Save" : "Add Employee"}</button>
      </form>

      <hr style={{ margin: "10px 0" }} />

      <TableContainer style={{ width: "1200px", marginLeft: "105px" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Password</StyledTableCell>
              <StyledTableCell>Mobile Number</StyledTableCell>
              <StyledTableCell>Account Number</StyledTableCell>
              <StyledTableCell>IFSC Code</StyledTableCell>
              <StyledTableCell>Balance</StyledTableCell>
              <StyledTableCell>UPI ID</StyledTableCell>
              <StyledTableCell>Account Status</StyledTableCell>
              <StyledTableCell>Agent Code</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
              <StyledTableCell>Approve Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? employees.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : employees
            ).map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.password}</TableCell>
                <TableCell>{employee.mob_no}</TableCell>
                <TableCell>{employee.account_no}</TableCell>
                <TableCell>{employee.ifsc_code}</TableCell>
                <TableCell>{employee.balance}</TableCell>
                <TableCell>{employee.upi_id}</TableCell>
                <TableCell>{employee.account_status}</TableCell>
                <TableCell>{employee.agent_code}</TableCell>
                <TableCell>
                  <StyledButton
                    variant="outlined"
                    onClick={() => {
                      setEditing(true);
                      setEditingId(employee._id);
                      setNewEmployee(employee);
                    }}
                  >
                    Edit
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleDeleteEmployee(employee._id)}
                  >
                    Delete
                  </StyledButton>
                </TableCell>
                <TableCell
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <StyledButton
                    onClick={() =>
                      handleApprovedStatus(employee._id, "accepted")
                    }
                  >
                    Approved
                  </StyledButton>
                  <StyledButton
                    onClick={() =>
                      handleApprovedStatus(employee._id, "pending")
                    }
                  >
                    Pending
                  </StyledButton>
                  <StyledButton
                    onClick={() =>
                      handleApprovedStatus(employee._id, "rejected")
                    }
                  >
                    Rejected
                  </StyledButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default Projects;
