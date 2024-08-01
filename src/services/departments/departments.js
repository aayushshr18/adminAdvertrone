import { fetchUrl } from "../../utils/fetchUrl";
import { getLocalStorageKey } from "../../utils/localStorage";

export const getAllleads = async () => {
  const url = process.env.REACT_APP_BASE_URI + "/api/admin/leads";
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = { method: "GET", headers, redirect: "follow" };
  return await fetchUrl(url, requestOptions);
};

export const updateLead = async (updatedDetails) => {
  const url = `${process.env.REACT_APP_BASE_URI}/api/admin/lead/${updatedDetails._id}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  console.log(updatedDetails);

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedDetails), // Sending the updated details in the request body
    redirect: "follow",
  };
  return await fetchUrl(url, requestOptions);
};

export const getAllDepartments = async () => {
  const token = getLocalStorageKey("token");
  const url =
    process.env.REACT_APP_BASE_URI + "/api/v1/departments/all-departments";

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const requestOptions = { method: "GET", headers, redirect: "follow" };
  return await fetchUrl(url, requestOptions);
};

export const getDepartmentsCount = async () => {
  const token = getLocalStorageKey("token");
  const url =
    process.env.REACT_APP_BASE_URI + "/api/v1/departments/department-count";

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const requestOptions = { method: "GET", headers, redirect: "follow" };
  return await fetchUrl(url, requestOptions);
};

export const createDepartment = async (details) => {
  const token = getLocalStorageKey("token");
  const url =
    process.env.REACT_APP_BASE_URI + "/api/v1/departments/create-department";

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("token", token);

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(details),
    redirect: "follow",
  };
  return await fetchUrl(url, requestOptions);
};
