import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";

const CompanyDashboard: React.FC = () => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  const canFetch = Boolean(token) && (user?.role === "recruiter" || user?.role === "admin");

  const { data: company, isLoading, error } = useApiQuery(
    ["user-company"],
    "/companies/current/company",
    canFetch
  );

  if (!token) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return <div>Loading company information…</div>;
  }

  if (error) {
    return <div>Error loading company: {(error as Error).message}</div>;
  }

  if (!company) {
    return <div>You haven’t been assigned to a company yet.</div>;
  }

  return (
    <div>
      <h1>{company.name}</h1>
      <p>
        <strong>Industry:</strong> {company.industry}
      </p>
      <p>
        <strong>Location:</strong> {company.location}
      </p>
      <p>
        <strong>Website:</strong>{" "}
        <a href={company.website} target="_blank" rel="noopener noreferrer">
          {company.website}
        </a>
      </p>
      <div>
        <h2>Description</h2>
        <p>{company.description}</p>
      </div>
    </div>
  );
};

export default CompanyDashboard;
