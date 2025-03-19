import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardContainer = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
