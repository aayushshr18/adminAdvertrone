import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchUrl } from "../../utils/fetchUrl";
import moment from "moment/moment";

const GetData = () => {
  const [bulkData, setBulkData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;
  const maxPageNumbersToShow = 5;

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = process.env.REACT_APP_BASE_URI + "/api/admin/bulk-data";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers,
        redirect: "follow",
      };
      const response = await fetchUrl(url, requestOptions);

      setBulkData(response.data);
      setCurrentPage(1); // Reset to first page when new data is fetched
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(bulkData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "bulk_data.xlsx");
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = bulkData.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(bulkData.length / entriesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          style={{
            padding: "10px 15px",
            margin: "0 2px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: currentPage === i ? "#007bff" : "#fff",
            color: currentPage === i ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <h1>Fetch Bulk Data</h1>
      <button
        onClick={handleFetchData}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          border: "none",
          borderRadius: "4px",
          margin: "10px 5px",
          backgroundColor: "#007bff",
          color: "white",
        }}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      <button
        onClick={handleDownload}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          border: "none",
          borderRadius: "4px",
          margin: "10px 5px",
          backgroundColor: "#28a745",
          color: "white",
        }}
        disabled={bulkData.length === 0}
      >
        Download Excel
      </button>
      {error && <div style={{ color: "red", margin: "20px 0" }}>{error}</div>}
      <div>
        {currentEntries.length > 0 ? (
          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
                  Name
                </th>
                <th style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
                  Number
                </th>
                <th style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
                  Status
                </th>
                <th style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
                  Agent Code
                </th>
                <th style={{ padding: "10px", backgroundColor: "#f4f4f4" }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "10px" }}>{entry.name}</td>
                  <td style={{ padding: "10px" }}>{entry.number}</td>
                  <td style={{ padding: "10px" }}>
                    {entry.flag ? "Done" : "Pending"}
                  </td>
                  <td style={{ padding: "10px" }}>{entry.agentCode}</td>
                  <td style={{ padding: "10px" }}>{moment(entry.createdAt).format('DD-MM-YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "10px 15px",
            margin: "0 5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
            color: currentPage === 1 ? "#666" : "#fff",
            cursor: "pointer",
          }}
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "10px 15px",
            margin: "0 5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
            color: currentPage === totalPages ? "#666" : "#fff",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetData;
