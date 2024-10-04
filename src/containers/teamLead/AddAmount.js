import React, { useState, useEffect } from "react";

const AddAmount = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadersPerPage] = useState(10);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URI_FAD}/api/teamleader/all`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setLeaders(data.data.leaders);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred while fetching team leaders.");
      });
  }, []);

  const handleAddAmount = (e) => {
    e.preventDefault();
    fetch(
      `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/addAmtTeamlead?email=${email}&amt=${amount}`,
      {
        method: "PATCH",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage(
            `Amount successfully added to ${data.tl.email}. Current Balance: ${data.tl.currBalance}`
          );
        } else {
          setMessage("Failed to add amount. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  // Pagination logic
  const indexOfLastLeader = currentPage * leadersPerPage;
  const indexOfFirstLeader = indexOfLastLeader - leadersPerPage;
  const currentLeaders = leaders.slice(indexOfFirstLeader, indexOfLastLeader);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        margin: "20px 50px",
        padding: "100px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Add Amount to Team Leader</h2>
      <form onSubmit={handleAddAmount}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Amount:
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Add Amount
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
          }}
        >
          {message}
        </div>
      )}
      <div style={{ marginTop: "50px" }}>
        <h2>Team Leaders</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Mobile No.
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Total Balance
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Current Balance
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>UPI</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                AC_NO
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>IFSC</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaders.map((leader) => (
              <tr key={leader.email}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.mob_no}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.totalBalance}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.currBalance}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.upi}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.ifsc}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {leader.ac_no}
                </td>
           
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {Array.from(
            { length: Math.ceil(leaders.length / leadersPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                style={{
                  padding: "10px 20px",
                  margin: "0 5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor:
                    currentPage === index + 1 ? "#4CAF50" : "#fff",
                  color: currentPage === index + 1 ? "#fff" : "#000",
                }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAmount;
