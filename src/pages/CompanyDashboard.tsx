import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";

const CompanyDashboard = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect if not logged in or not a recruiter
  // useEffect(() => {
  //   if (!token || (user?.role !== "recruiter" && user?.role !== "admin")) {
  //     navigate("/login");
  //   }
  // }, [token, user, navigate]);

  // Fetch company data if user is a recruiter
  const { data: company, isLoading, error } = useApiQuery(
    ["user-company"],
    "/users/current/company",
    !!token && (user?.role === "recruiter" || user?.role === "admin")
  );

  if (isLoading) return <div>Loading company dashboard...</div>;
  if (error) return <div>Error loading company data: {error.message}</div>;

  return (
    <div className="dashboard-container">
      <h1>Company Dashboard</h1>

      {company ? (
        <div className="company-details">
          <h2>{company.name}</h2>
          <div className="company-info">
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Website:</strong> {company.website}</p>
          </div>
          <div className="company-description">
            <h3>Description</h3>
            <p>{company.description}</p>
          </div>
        </div>
      ) : (
        <div className="no-company">
          <p>You haven't been assigned to a company yet.</p>
          <button onClick={() => navigate("/register-company")}>
            Create a Company
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
