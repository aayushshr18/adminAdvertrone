import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  addNotice,
  deleteNotice,
  getNotices,
} from "../../services/profile/profile";
import { sendErrorNotification } from "../../services/notifications";
import MetaTags from "../../components/meta-tags";
import { mapProfileData } from "../../data/profileData";
import MainSection from "./main-section";
import "./style.scss";

const Profile = () => {
  const employee = useSelector((state) => state.employee.loggedInEmployee);
  const navigate = useNavigate();

  // State for notice form and displayed notice
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ notice: "" });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
    }
    fetchNotices();
  }, []);

  // Function to fetch notices from the database
  const fetchNotices = async () => {
    try {
      const response = await getNotices();
      if (response.success) {
        setNotices(response.data.notices);
      }
    } catch (error) {
      sendErrorNotification("Error fetching notices!");
    }
  };

  // Function to handle notice submission
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addNotice(newNotice);
      if (response.success) {
        setNotices([...notices, response.data.notice]);
        setNewNotice({ notice: "" }); // Reset the newNotice state to an empty object
      }
    } catch (error) {
      sendErrorNotification("Error adding notice!");
      console.error("Error adding notice:", error);
    }
  };

  // Function to handle notice deletion
  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await deleteNotice(noticeId);
      if (response.success) {
        const updatedNotices = notices.filter(
          (notice) => notice._id !== noticeId
        );
        setNotices(updatedNotices);
      }
    } catch (error) {
      sendErrorNotification("Error deleting notice!");
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <div className="withdrawal">
      <div className="withdrawal-box">
        <div style={{ marginLeft: "90px", marginTop: "40px" }}>
          <h1>Welcome Again! Admin {localStorage.getItem("adminEmail")}</h1>
          <br />
          <p>Glad to see you again!</p>

          {/* Form to add notice */}
          <form onSubmit={handleNoticeSubmit}>
            <textarea
              placeholder="Add a notice..."
              value={newNotice.notice} // Access notice from the state object
              onChange={(e) => setNewNotice({ notice: e.target.value })} // Update the notice in the state object
            ></textarea>
            <button type="submit">Add Notice</button>
          </form>

          {/* Display added notices */}
          {notices.length > 0 && (
            <div className="notices">
              <h3>Notices:</h3>
              <ul>
                {notices.map((notice) => (
                  <li key={notice._id}>
                    <p>{notice.notice}</p>
                    <button onClick={() => handleDeleteNotice(notice._id)}>
                      Delete Notice
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
