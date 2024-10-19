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
        const url = process.env.REACT_APP_BASE_URI + '/api/admin/form/'; // Assuming this is your API endpoint
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEmployeeEntries(data.forms);

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

    const data = employeeEntries.map(entry => {
    const webCenterDetails = entry.webCenterTimeDetails || [];
    
    const inDetails = webCenterDetails[0] || ["", "", "", "", "", "", ""];
    const breakDetails = webCenterDetails[1] || ["", "", "", "", "", "", ""];
    const lunchOutDetails = webCenterDetails[2] || ["", "", "", "", "", "", ""];
    const lunchInDetails = webCenterDetails[3] || ["", "", "", "", "", "", ""];
    const lunchO2Details = webCenterDetails[4] || ["", "", "", "", "", "", ""];
    const lunchI2Details = webCenterDetails[5] || ["", "", "", "", "", "", ""];
    const outDetails = webCenterDetails[6] || ["", "", "", "", "", "", ""];
    const hoursDetails = webCenterDetails[7] || ["", "", "", "", "", "", ""];

      return {
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
      In1: inDetails[0], In2: inDetails[1], In3: inDetails[2], In4: inDetails[3], In5: inDetails[4], In6: inDetails[5], In7: inDetails[6],
      Break1: breakDetails[0], Break2: breakDetails[1], Break3: breakDetails[2], Break4: breakDetails[3], Break5: breakDetails[4], Break6: breakDetails[5], Break7: breakDetails[6],
      LunchOut1: lunchOutDetails[0], LunchOut2: lunchOutDetails[1], LunchOut3: lunchOutDetails[2], LunchOut4: lunchOutDetails[3], LunchOut5: lunchOutDetails[4], LunchOut6: lunchOutDetails[5], LunchOut7: lunchOutDetails[6],
      LunchIn1: lunchInDetails[0], LunchIn2: lunchInDetails[1], LunchIn3: lunchInDetails[2], LunchIn4: lunchInDetails[3], LunchIn5: lunchInDetails[4], LunchIn6: lunchInDetails[5], LunchIn7: lunchInDetails[6],
      LunchO21: lunchO2Details[0], LunchO22: lunchO2Details[1], LunchO23: lunchO2Details[2], LunchO24: lunchO2Details[3], LunchO25: lunchO2Details[4], LunchO26: lunchO2Details[5], LunchO27: lunchO2Details[6],
      LunchI21: lunchI2Details[0], LunchI22: lunchI2Details[1], LunchI23: lunchI2Details[2], LunchI24: lunchI2Details[3], LunchI25: lunchI2Details[4], LunchI26: lunchI2Details[5], LunchI27: lunchI2Details[6],
      Out1: outDetails[0], Out2: outDetails[1], Out3: outDetails[2], Out4: outDetails[3], Out5: outDetails[4], Out6: outDetails[5], Out7: outDetails[6],
      Hours1: hoursDetails[0], Hours2: hoursDetails[1], Hours3: hoursDetails[2], Hours4: hoursDetails[3], Hours5: hoursDetails[4], Hours6: hoursDetails[5], Hours7: hoursDetails[6],

      PayCode: entry.payDetails?.payCode || "",
      RegHrs: entry.payDetails?.regHrs || "",
      OTHrs: entry.payDetails?.otHrs || "",
      DHrs: entry.payDetails?.dHrs || "",
      BillRate: entry.payDetails?.billRate || "",
      OTBillRate: entry.payDetails?.otBillRate || "",
      DBillRate: entry.payDetails?.dBillRate || "",
      Total: entry.payDetails?.total || "",
    };
  });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Entries");

    XLSX.writeFile(wb, "employee_entries.xlsx");
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
                <th>Pay Details</th>
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
                  <td>
                    <table className="webcenter-details-table-admin">
                      <thead>
                        <tr>
                          <th>In</th>
                          <th>Break</th>
                          <th>Lunch Out</th>
                          <th>Lunch In</th>
                          <th>Lunch O2</th>
                          <th>Lunch I2</th>
                          <th>Out</th>
                          <th>Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {entry.webCenterTimeDetails?.map((timeArray, i) => (
                            <td key={i}>
                              {timeArray.map((time, j) => (
                                <div key={j}>{time || "-"}</div>
                              ))}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td>
                    {/* Display Pay Details */}
                    <table className="pay-details-table-admin">
                      
                      <tbody>
                        <tr>
                          <td>{entry.payDetails?.payCode || "-"}</td>
                          <td>{entry.payDetails?.regHrs || "-"}</td>
                          <td>{entry.payDetails?.otHrs || "-"}</td>
                          <td>{entry.payDetails?.dHrs || "-"}</td>
                          <td>{entry.payDetails?.billRate || "-"}</td>
                          <td>{entry.payDetails?.otBillRate || "-"}</td>
                          <td>{entry.payDetails?.dBillRate || "-"}</td>
                          <td>{entry.payDetails?.total || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="button-container">
            <button onClick={handleDownloadExcel}>Download Excel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
