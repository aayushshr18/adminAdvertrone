import React, { useEffect, useState } from "react";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI}/api/teamleader/requests`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.req);
        } else {
          console.error("Failed to fetch requests");
        }
      })
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  const changeStatus = (id, newStatus) => {
    fetch(
      `${process.env.REACT_APP_BASE_URI}/api/teamleader/request?id=${id}&status=${newStatus}`,
      {
        method: "PATCH",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRequests(
            requests.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
          );
        } else {
          console.error("Failed to update status");
        }
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ margin: "20px", padding: "100px" }}>
      <h2>Team Leader Withdrawal Requests</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {request.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {request.email}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {request.status}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {request.amt}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() => changeStatus(request._id, "Approved")}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => changeStatus(request._id, "Rejected")}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: Math.ceil(requests.length / requestsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: currentPage === index + 1 ? "#4CAF50" : "#fff",
              color: currentPage === index + 1 ? "#fff" : "#000",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Requests;
