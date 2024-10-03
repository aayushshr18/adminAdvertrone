import { fetchUrl } from "../../utils/fetchUrl";

export const addBalance = async (balanceDetails) => {
    const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/addamt/${balanceDetails.employee_id}`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: "PUT",
      headers,
      redirect: "follow",
      body: JSON.stringify(balanceDetails), // Pass newEmployee data as the request body
    };
  
    return await fetchUrl(url, requestOptions);
  };