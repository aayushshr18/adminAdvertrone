import { fetchUrl } from "../../utils/fetchUrl";

export const addNotice = async (noticeData) => {
  const url = process.env.REACT_APP_BASE_URI + "/api/admin/notice";

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    redirect: "follow",
    body: JSON.stringify(noticeData), // Pass assignmentData as the request body
  };
  const response = await fetchUrl(url, requestOptions);
  return response;
};

export const deleteNotice = async (noticeId) => {
  const url = `${process.env.REACT_APP_BASE_URI}/api/admin/notice/${noticeId}`;

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

export const getNotices = async () => {
  const url = `${process.env.REACT_APP_BASE_URI}/api/admin/notices`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const response = await fetchUrl(url, requestOptions);
  return response;
};
