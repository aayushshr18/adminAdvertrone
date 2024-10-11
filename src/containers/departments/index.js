import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import {
  getAllleads,
  updateLead,
} from "../../services/departments/departments";
import { sendErrorNotification } from "../../services/notifications";
import { mapDepartmentsData } from "../../data/departmentsData";
import Loader from "../../components/loader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import "./styles.scss";
import TablePagination from "@mui/material/TablePagination";

import { InputAdornment, styled } from "@mui/material";
import * as XLSX from "xlsx";
// import SearchIcon from '@mui/icons-material/Search';
// import styled from "@emotion/styled";

const Departments = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [check, setcheck] = useState(true)
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Function to handle the update button click
  const handleUpdateClick = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  // Function to update lead details
  const updateLeadStatus = async (updatedDetails) => {
    try {
      const response = await updateLead(updatedDetails);

      if (response.success) {
        const updatedLeads = leads.map((lead) => {
          if (lead._id === updatedDetails._id) {
            return { ...lead, status: updatedDetails.status };
          }
          return lead;
        });

        setLeads(updatedLeads);
      }
    } catch (error) {
      sendErrorNotification("Error in updating leads!");
      console.error("Error updating leads:", error);
    }

    setShowModal(false);
  };

  // Fetch leads data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllleads();
      if (response.success) {
        // Reverse the order of fetched leads before setting in state
        setLeads(response.data.result.reverse());
      }
    } catch (error) {
      sendErrorNotification("Error fetching assignments!");
      console.error("Error fetching assignments:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
    fetchData();
  }, []);

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
  const handleSearch = () => {
    // Filter leads based on COMPANY_NAME and AGENT_CODE

    const filteredLeads = leads.filter(
      (lead) =>
        lead.employee_agent.agent_code.toLowerCase() ===searchTerm.toLowerCase() || 
          lead?.referred_agent_id === searchTerm||
          lead.status.toLowerCase() === searchTerm.toLowerCase()||
          lead.name.toLowerCase() ===searchTerm.toLowerCase()||
          lead.company_name[0]?.toLowerCase() ===searchTerm.toLowerCase()||
          lead.mob_no.toLowerCase() ===searchTerm.toLowerCase()
    );
    setLeads(filteredLeads);
  };

  const downloadExcel = (tableData, fileName) => {
    // Convert table data to worksheet
    let ad = [];
    tableData = tableData.forEach((element) => {
      let c = {
        ReferBy: element.employee_agent.agent_code,
        AgentCode: element.referred_agent_id,
        Company: element.company_name[0],
        Name: element.name,
        Status: element.status,
        Date: element.date,
        Contact:element.mob_no
      };
      ad=[...ad,c];
    });

    const ws = XLSX.utils.json_to_sheet(ad);

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook to an Excel file
    XLSX.writeFile(wb, fileName);
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  
  };

  return (
    <div
      className="departments-page"
      style={{ backgroundColor: "transparent" }}
    >
      <Box gap={"10px"} mb={2} display="flex" alignItems="center">
        <TextField
          // {...props}
          style={{ width: "100%" }}
          placeholder="Enter company name or Customer ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
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
         </>
           ),
          }}

        />
        <Button
           onClick={()=>window.location.reload()}
           
         >
          View All
         </Button>
        <StyledButton
          onClick={() => downloadExcel(leads, "lead_table.xlsx")}
          style={{ width: "50%", padding: "15px" }}
        >
          Export
        </StyledButton>
      </Box>
      <TableContainer style={{ borderRadius: 20 }} component={Paper}>
        <Table style={{ borderRadius: "20px" }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>REFER_BY</StyledTableCell>
              <StyledTableCell>NUMBER</StyledTableCell>
              <StyledTableCell>COMPANY_NAME</StyledTableCell>
              <StyledTableCell>NAME</StyledTableCell>
              <StyledTableCell>URL</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell>DATE</StyledTableCell>
              <StyledTableCell>UPDATE</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...leads]
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.employee_agent.agent_code}</TableCell>
                  <TableCell>{lead.referred_agent_id}</TableCell>
                  <TableCell>{lead.company_name}</TableCell>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.mob_no}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{formatDate(lead.date)}</TableCell>

                  <TableCell>
                    <StyledButton onClick={() => handleUpdateClick(lead)}>
                      Update status
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>

      {showModal && selectedLead && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box className="modal">
            <Box className="modal-content">
              <h2>Update Lead Status</h2>
              <p>Lead ID: {selectedLead.referred_agent_id}</p>
              <label htmlFor="statusSelect">Select Status:</label>
              <Select
                id="statusSelect"
                value={selectedLead.status}
                onChange={(e) => {
                  setSelectedLead({
                    ...selectedLead,
                    status: e.target.value,
                  });
                }}
              >
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="notfound">Not Found</MenuItem>
                <MenuItem value="nontrade">Non Trade</MenuItem>
              </Select>
              <Button onClick={() => updateLeadStatus(selectedLead)}>
                Save Changes
              </Button>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Departments;
