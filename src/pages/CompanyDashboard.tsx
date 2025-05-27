import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import ManageJoinRequests from "../components/ManageJoinRequests";
import CompanyCRUD from "../components/CompanyCRUD";
import CompanyApplications from "../components/CompanyApplicationManager";
import CompanyJobPostsManager from "../components/CompanyJobPostsManager";
import CompanyDetails from "../components/CompanyDetails";
import { useCompanyData } from "../hooks/useCompanyData";
import RecruitersList from "../components/RecruitersList";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  industry: string;
  logoUrl?: string;
  jobPosts?: string[];
  recruiters?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CompanyDashboardProps {
  companyId?: string;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyId }) => {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const { data: company, isLoading, error } = useCompanyData(companyId);

  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const belongsToCompany = company?.recruiters?.includes(user?.id);
  const canAccessCompanyFeatures = isAdmin || (isRecruiter && belongsToCompany);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Company Dashboard</h1>

      {company ? (
        <>
           <CompanyCRUD />
           <RecruitersList companyId={company._id} />

          {canAccessCompanyFeatures && (
            <div>
              <h3>Manage Join Requests</h3>
              <ManageJoinRequests companyId={company._id} />
            </div>
          )}
        </>
      ) : (
        <div>
          <p>No company assigned.</p>
          <button onClick={() => navigate("/register-company")}>
            Create Company
          </button>
        </div>
      )}

      {canAccessCompanyFeatures && <CompanyJobPostsManager />}
      <CompanyApplications />







    </div>
  );
};

export default CompanyDashboard;
