import { fetchUrl } from "../../utils/fetchUrl";

export const getAllDashboardData = async () => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/dashboard`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = { method: "GET", headers, redirect: "follow" };
  return await fetchUrl(url, requestOptions);
};

export const updateTransactionStatus = async (transactionId, newStatus) => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/transaction/admin/withdraw/${transactionId}`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: newStatus }), // Send the status in the request body
  };

  const response = await fetchUrl(url, requestOptions);
  return response;
};

export const getAllWithdrawnRequests = async () => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/transaction/admin/withdraw`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = { method: "GET", headers, redirect: "follow" };
  return await fetchUrl(url, requestOptions);
};

export const deleteTransaction = async (transactionId) => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/transaction/admin/withdraw/${transactionId}`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers,
    redirect: "follow",
  };

  const response = await fetchUrl(url, requestOptions);
  return response;
};
