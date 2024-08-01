import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignments, addAssignment } from "../../services/employees/allEmployees";
import { sendErrorNotification } from "../../services/notifications";
import "./styles.scss";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled } from "@mui/material";
import { deleteAssignment } from "../../services/employees/employee-details";

const Employees = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    company_name: "",
    company_link: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
    fetchEmployees();
  }, []);

  const deleteHandler = async (id) => {
    try {
      await deleteAssignment(id);
      fetchEmployees();
    } catch (error) {
      sendErrorNotification("Error deleting assignment!");
      console.error("Error deleting assignment:", error);
    }
  }

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAssignments();
      if (response.success) {
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      sendErrorNotification("Error fetching assignments!");
      console.error("Error fetching assignments:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await addAssignment(newAssignment);
      if (response.success) {
        setAssignments([...assignments, response.data.assignment]);
        setNewAssignment({ company_name: "", company_link: "" });
      }
    } catch (error) {
      sendErrorNotification("Error adding assignment!");
      console.error("Error adding assignment:", error);
    }
    setIsLoading(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Your custom styling here
    background: '#2a2185',
    color:'#e0e01c'
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    // Your custom styling here
    background: '#2a2185',
    color:'#e0e01c'
  }));
  return (
    <div className="employees-box">
      <div align="center" style={{ padding: "15px 0" }}>
        <form onSubmit={handleSubmit}>
          <h2>Add More Link</h2>
          <div>
            <label htmlFor="company_name">Company Name:</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={newAssignment.company_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="company_link">Company Link:</label>
            <input
              type="text"
              id="company_link"
              name="company_link"
              value={newAssignment.company_link}
              onChange={handleInputChange}
            />
          </div>
          <StyledButton
            type="submit"
            variant="contained"
            style={{ backgroundColor: "aquamarine" }}
            disabled={isLoading}
          >
            ADD
          </StyledButton>
        </form>
        <hr style={{ margin: "15px 0" }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Company Name</StyledTableCell>
                <StyledTableCell>Company Link</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.company_name}</TableCell>
                  <TableCell>
                    <a
                      href={assignment.company_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {assignment.company_link}
                    </a>
                  </TableCell>
                  <TableCell>
                    <StyledButton
                      variant="outlined"
                      style={{ margin: '5px', padding: 5 }}
                      onClick={() => deleteHandler(assignment._id)}
                    >
                      Delete
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Employees;
