import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getAllAssignments,
  addAssignment,
  getAllEmployee,
} from "../../services/employees/allEmployees";
import { sendErrorNotification } from "../../services/notifications";
import "./styles.scss";
import { Box, Button, TextField, styled, Paper, Alert } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  deleteAssignment,
  getEmployeeDetails,
} from "../../services/employees/employee-details";
import SearchIcon from "@mui/icons-material/Search";
import { addBalance } from "./balance-details";

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
const Balance = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    company_name: "",
    company_link: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState(null);

  const deleteHandlar = async (id) => {
    const res = await deleteAssignment(id);
    try {
      const response = await getAllAssignments();
      if (response.success) {
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      sendErrorNotification("Error fetching assignments!");
      console.error("Error fetching assignments:", error);
    }
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
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployee();
      if (response.success) {
        setEmployees(response.data.employees);
      } else {
        console.error("Error fetching employees:", response.error);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = async () => {
    console.log("handleSearch");
    const searchTermNumber = parseInt(searchTerm, 10); // Convert to number
    const getEmployee = employees.find((employee) => {
      console.log(employee, "employee");
      if (employee.referred_agent_id.some((agent) => agent.id === searchTerm)) {
        return employee;
      }
    });
    console.log(getEmployee, "getEmployee");
    setFoundEmployee(getEmployee);
  };

  const handleUpdateClick = async (amount) => {
    const details = {
      amount: amount,
      employee_id: foundEmployee._id,
      agent_id: searchTerm,
    };
    const response = await addBalance(details);
    console.log(response);

    setFoundEmployee(null);
    setAmount(null);
    setSearchTerm("");
    if (response.success) {
      setMessage({ type: "success", message: "Successfully Added Balance!" });
    } else {
      setMessage({ type: "error", message: "Something Went Wrong!" });
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, [message]);

  const [check, setcheck] = useState(true);

  const [pin, setPin] = useState("");

  const handlePinVerification = async (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      pin: pin,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URI}/api/admin/amtaccesspasscode`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if(response.data.success){
            setcheck(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };




  return check ? (
    <div className="departments-page"
    style={{ backgroundColor: "transparent",width:'100%' }}
 >
      <div style={{margin:'auto',padding:'25px',backgroundColor:'azure'}}>
      <h2>Enter Passcode</h2>
        <input type="password" onChange={(e) => setPin(e.target.value)} />
        <button onClick={handlePinVerification}>Submit</button>
      
      </div>
    </div>
  ) : (  <div className="employees-box" style={{ backgroundColor: "transparent" }}>
      <div align="center" style={{ padding: "15px 0" }}>
        <Box mb={2} display="flex" alignItems="center">
          <TextField
            // {...props}
            style={{ width: "100%" }}
            placeholder="Enter Agent Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  style={{
                    backgroundColor: "#2a2185",
                  }}
                >
                  <SearchIcon />
                </Button>
              ),
            }}
          />
        </Box>
        {foundEmployee && (
          <TableContainer style={{ borderRadius: 20 }} component={Paper}>
            <Table style={{ borderRadius: "20px" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>AGENT_CODE</StyledTableCell>
                  <StyledTableCell>ADD_BALANCE</StyledTableCell>
                  <StyledTableCell>UPDATE</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={foundEmployee._id}>
                  <TableCell>{searchTerm}</TableCell>
                  <TableCell>
                    <TextField
                      // {...props}
                      style={{ width: "100%" }}
                      placeholder="Enter Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <StyledButton onClick={() => handleUpdateClick(amount)}>
                      Add Balance
                    </StyledButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {message && <Alert severity={message.type}>{message.message}</Alert>}
        {/* <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            style={{ backgroundColor: "aquamarine" }}
            disabled={isLoading}
          >
            ADD
          </button>
        </form>
        <hr style={{ margin: "15px 0" }} />
        <table align="center" border="2">
          <caption>Assignments</caption>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company Link</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id}>
                <td>{assignment.company_name}</td>
                <td>
                  <a
                    href={assignment.company_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {assignment.company_link}
                  </a>
                </td>
                <td><button style={{
                  margin:'5px', padding:5
                }} onClick={() => deleteHandlar(assignment._id)}>Delete</button></td>

              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default Balance;
