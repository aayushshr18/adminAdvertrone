import React, { useState, useEffect } from "react";
import { fetchUrl } from "../../utils/fetchUrl"; // Utility to fetch API data
import * as XLSX from "xlsx"; // Library for Excel generation
import './Form.css';

const AdminPanel = () => {
  const [employeeEntries, setEmployeeEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employee entries when the component mounts
  useEffect(() => {
    const fetchEmployeeEntries = async () => {
      setIsLoading(true);
      try {
        const url = process.env.REACT_APP_BASE_URI + '/api/admin/form'; // Assuming this is your API endpoint
        const response = await fetch(url, {
          method: 'GET', // Use GET instead of POST
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check for successful response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response as JSON
        setEmployeeEntries(data.forms);           // Assuming the data is in the expected format

      } catch (error) {
        setError("Error fetching employee entries.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeEntries();
  }, []);

  // Function to handle Excel download
  const handleDownloadExcel = () => {
    if (!employeeEntries.length) return alert("No data to download.");

    const data = employeeEntries.map(entry => ({
      UserID: entry.userId,
      PONumber: entry.poNo,
      BillingAddress: entry.billingAddress,
      InvoiceNumber: entry.invNo,
      InvoiceDate: entry.invDate,
      InvoiceAmount: entry.invAmt,
      Customer: entry.customer,
      Street: entry.street,
      City: entry.city,
      State: entry.state,
      PinCode: entry.pinCode,
      WebCenterTimeDetails: entry.webCenterTimeDetails.map(row => row.join(", ")).join("; "), // Flattening the array for Excel
    }));

    const ws = XLSX.utils.json_to_sheet(data); // Convert data to Excel sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Entries");

    XLSX.writeFile(wb, "employee_entries.xlsx"); // File name
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Employee Entries</h2>

      {isLoading && <p>Loading employee entries...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && employeeEntries.length > 0 && (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>PO Number</th>
                <th>Billing Address</th>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Invoice Amount</th>
                <th>Customer</th>
                <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Pin Code</th>
                <th>WebCenter Time Details</th>
              </tr>
            </thead>
            <tbody>
              {employeeEntries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.userId}</td>
                  <td>{entry.poNo}</td>
                  <td>{entry.billingAddress}</td>
                  <td>{entry.invNo}</td>
                  <td>{entry.invDate}</td>
                  <td>{entry.invAmt}</td>
                  <td>{entry.customer}</td>
                  <td>{entry.street}</td>
                  <td>{entry.city}</td>
                  <td>{entry.state}</td>
                  <td>{entry.pinCode}</td>
                  <td>{entry.webCenterTimeDetails.map((row, i) => (
                    <div key={i}>{row.join(", ")}</div> // Display time details row-wise
                  ))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Button to trigger Excel download */}
          <div className="button-container">
            <button onClick={handleDownloadExcel}>Download Excel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
