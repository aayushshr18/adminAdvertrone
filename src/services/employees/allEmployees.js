import { fetchUrl } from "../../utils/fetchUrl";
import { getLocalStorageKey } from "../../utils/localStorage";

export const getAllAssignments = async () => {
  const url = process.env.REACT_APP_BASE_URI_FAD + "/api/admin/assignments";
  const token = getLocalStorageKey("token");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  // headers.append('token',token);

  const requestOptions = { method: "GET", headers, redirect: "follow" };

  return await fetchUrl(url, requestOptions);
};

export const addAssignment = async (assignmentData) => {
  const url = process.env.REACT_APP_BASE_URI_FAD + "/api/admin/assignment";

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    redirect: "follow",
    body: JSON.stringify(assignmentData), // Pass assignmentData as the request body
  };
  const response = await fetchUrl(url, requestOptions);
  return response;
};

/////////////////////////////for rmployees crud/////////////////////

// Function to fetch all employees
export const getAllEmployee = async () => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/employees`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetchUrl(url, requestOptions);
};

// Function to add a new employee
export const addEmployee = async (newEmployee) => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/employee`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    redirect: "follow",
    body: JSON.stringify(newEmployee), // Pass newEmployee data as the request body
  };

  return await fetchUrl(url, requestOptions);
};

// Function to update an existing employee
export const updateEmployee = async (employeeId, updatedEmployeeData) => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/employee/${employeeId}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
    headers,
    redirect: "follow",
    body: JSON.stringify(updatedEmployeeData), // Pass updatedEmployeeData as the request body
  };

  return await fetchUrl(url, requestOptions);
};

// Function to delete an employee
export const deleteEmployee = async (employeeId) => {
  const url = `${process.env.REACT_APP_BASE_URI_FAD}/api/admin/employee/${employeeId}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "DELETE",
    headers,
    redirect: "follow",
  };

  return await fetchUrl(url, requestOptions);
};

////////////////ended here/////////////////////////////

export const getAllEmployees = async () => {
  const url = process.env.REACT_APP_BASE_URI_FAD + "/api/v1/employees/allEmployees";
  const token = getLocalStorageKey("token");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const requestOptions = { method: "GET", headers, redirect: "follow" };

  return await fetchUrl(url, requestOptions);
};

export const getEmployeesCount = async () => {
  const url =
    process.env.REACT_APP_BASE_URI_FAD + "/api/v1/employees/employees-count";
  const token = getLocalStorageKey("token");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const requestOptions = { method: "GET", headers, redirect: "follow" };

  return await fetchUrl(url, requestOptions);
};
