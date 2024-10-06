/* eslint-disable react-hooks/exhaustive-deps */
import "./styles.scss";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../services/notifications";
import {
  getAllWithdrawnRequests,
  updateTransactionStatus,
  deleteTransaction,
} from "../../services/transaction/transaction"; // Import your service functions

const Task = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  useEffect(() => {
    fetchWithdrawnRequests();
  }, []);

  const fetchWithdrawnRequests = async () => {
    try {
      const response = await getAllWithdrawnRequests();
      if (response.success) {
        setTransactions(response.data.transactions.reverse());
      }
      setIsLoading(false);
    } catch (error) {
      sendErrorNotification("Failed to fetch withdrawn requests:", error);
      setIsLoading(false);
    }
  };
  const [error,setError]=useState('');
  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      const response = await updateTransactionStatus(transactionId, newStatus);
      setError(JSON.stringify(response));
      if (response.success) {
        // Update the status in the local state upon successful update
        const updatedTransactions = transactions.map((transaction) => {
          if (transaction._id === transactionId) {
            return { ...transaction, status: newStatus };
          }
          return transaction;
        });
        sendSuccessNotification("Withdraw Request Accepted!");
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error("Failed to update transaction status:", error);
    }
  };

  
  const handleReject = async (transactionId) => {
    try {
      const response = await deleteTransaction(transactionId);
      if (response.success) {
        const updatedTransactions = transactions.filter(
          (transaction) => transaction._id !== transactionId
        );
        setTransactions(updatedTransactions);
        sendSuccessNotification("Transaction deleted successfully!");
      } else {
        sendErrorNotification("Failed to delete transaction");
      }
    } catch (error) {
      sendErrorNotification("Failed to delete transaction:", error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  ) : (
    <div className="task-container" style={{ position:'relative !important',top:'550px !important',marginLeft:'250px' }}>
      <div className="task-box-one">
        <div align="center">
          <h1>Amount Withdrawn Requests</h1>
          <TableContainer component={Paper}>
            <Table className="tablea">
              <TableHead style={{ background: "#2A2185" }}>
                <TableRow>
                  <TableCell style={{ color: "yellow" }}>Customer ID</TableCell>
                  <TableCell style={{ color: "yellow" }}>Name</TableCell>
                  <TableCell style={{ color: "yellow" }}>
                    Account Number
                  </TableCell>
                  <TableCell style={{ color: "yellow" }}>IFSC Code</TableCell>
                  <TableCell style={{ color: "yellow" }}>UPI ID</TableCell>
                  <TableCell style={{ color: "yellow" }}>
                    Current Balance
                  </TableCell>
                  <TableCell style={{ color: "yellow" }}>
                    Withdraw Amount
                  </TableCell>
                  <TableCell style={{ color: "yellow" }}>Status</TableCell>
                  <TableCell style={{ color: "yellow" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? transactions.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : transactions
                ).map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.agent_code}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.account_no}</TableCell>
                    <TableCell>{transaction.ifsc_code}</TableCell>
                    <TableCell>{transaction.upi_id}</TableCell>
                    <TableCell>{transaction.accessibleBalance}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>
                      {transaction.status==="pending" && (
                        <>
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleUpdateStatus(transaction._id, "accepted")
                            }
                            disabled={
                              transaction.amount > transaction.accessibleBalance
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleUpdateStatus(transaction._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Task;
