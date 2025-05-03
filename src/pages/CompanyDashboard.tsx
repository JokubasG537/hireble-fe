import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";

// Interface for Company based on the MongoDB schema
interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  industry: string;
  logoUrl?: string;
  jobPosts?: string[]; // Array of Job IDs
  recruiters?: string[]; // Array of User IDs
  createdAt: string;
  updatedAt: string;
}

const CompanyDashboard: React.FC = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("User context:", { user, token });

 
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const { data: company, isLoading, error } = useApiQuery<Company>(
    ["user-company"],
    "/companies/current/company",
    !!token
  );

  if (isLoading) return <div>Loading company dashboard...</div>;
  if (error) return <div>Error loading company data: {(error as Error).message}</div>;

  console.log("Company data:", { company, error, isLoading });

  return (
    <div className="dashboard-container">
      <h1>Company Dashboard</h1>

      {company ? (
        <div className="company-details">
          {company.logoUrl && (
            <div className="company-logo">
              <img src={company.logoUrl} alt={`${company.name} logo`} />
            </div>
          )}
          <h2>{company.name}</h2>
          <div className="company-info">
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            {company.jobPosts && company.jobPosts.length > 0 && (
              <p><strong>Active Job Posts:</strong> {company.jobPosts.length}</p>
            )}
            {company.recruiters && company.recruiters.length > 0 && (
              <p><strong>Recruiters:</strong> {company.recruiters.length}</p>
            )}
          </div>
          <div className="company-description">
            <h3>Description</h3>
            <p>{company.description}</p>
          </div>
          <div className="company-timestamp">
            <p><small>Registered since: {new Date(company.createdAt).toLocaleDateString()}</small></p>
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
