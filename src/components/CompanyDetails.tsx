import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useApiQuery } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import RecruitersList from "./RecruitersList";

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

const CompanyDetails: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { token } = useContext(UserContext);

  const { data, isLoading, error } = useApiQuery<{ company: Company }>(
    ["company", companyId],
    `/companies/current/company`,
    true
  );

  const company = data?.company;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <div>
      <h2>{company.name}</h2>
      <p><strong>Industry:</strong> {company.industry}</p>
      <p><strong>Location:</strong> {company.location}</p>
      <p><strong>Website:</strong> {company.website}</p>
      <p><strong>Description:</strong> {company.description}</p>
      <p><strong>Registered since:</strong> {new Date(company.createdAt).toLocaleDateString()}</p>
      <p><strong>Job Posts:</strong> {company.jobPosts?.length || 0}</p>
      <p><strong>Recruiters:</strong> {company.recruiters?.length || 0}</p>

      <div>
        {company._id && <RecruitersList companyId={company._id} />}
      </div>
    </div>
  );
};

export default CompanyDetails;