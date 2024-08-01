import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import Loader from "../../components/loader";
import { getAllDashboardData } from "../../services/transaction/transaction";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const syncDashboard = async () => {
    setLoading(true);
    try {
      const response = await getAllDashboardData();
      if (response.success) {
        setDashboardData(response.data); // Assuming the data is received in 'response.data'
      } else {
        // Handle the failure scenario
        console.error("Failed to fetch dashboard data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDashboard();
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
  }, []);

  return isLoading ? (
    <div className="dashboard-container">
      <Loader />
    </div>
  ) : (
    <div className="dashboard-page">
      <div className="dasboard-container">
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
          <div className="dasboard-small1" style={{color:'white',backgroundColor:'darkmagenta',borderRadius:'2%',padding:'20px',textAlign:'center'}} onClick={() => navigate('/employees')}>
            <h4>TOTAL NUMBER OF USER</h4>
            <h2>{dashboardData.totalUsers}</h2>
          </div>
          <div className="dasboard-small2" style={{color:'white',backgroundColor:'blueviolet',borderRadius:'2%',padding:'20px',textAlign:'center'}} onClick={() => navigate('/tasks')}>
            <h4>WITHDRAWAL REQUEST</h4>
            <h2>{dashboardData.newWithdrawRequest}</h2>
          </div>
          <div className="dasboard-small1" style={{color:'white',backgroundColor:'darkgoldenrod',padding:'20px',textAlign:'center',borderRadius:'2%'}}>
            <h3>REGISTRATION REQUEST</h3>
            <h2>{dashboardData.totalRegistrationRequest}</h2>
          </div>
          <div className="dasboard-small2" style={{color:'white',backgroundColor:'darkolivegreen',padding:'20px',textAlign:'center',borderRadius:'2%'}}  onClick={() => navigate('/departments')}>
            <h3>TOTAL NUMBER OF LEADS FOR UPDATE</h3>
            <h2>{dashboardData.totalLeadsForUpdate}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
