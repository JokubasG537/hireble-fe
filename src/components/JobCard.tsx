import React from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  _id: string;
  title: string;
  company: string | { name: string; _id: string };
  location: string;
  salary?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  employmentType?: string;
  experienceLevel?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  _id,
  title,
  company,
  location,
  salary,
  salaryCurrency = 'USD',
  salaryPeriod = 'yearly',
  employmentType,
  experienceLevel
}) => {
  const navigate = useNavigate();

  // Handle company name and ID regardless of whether it's a string or object
  const companyName = typeof company === 'string' ? company : company.name;
  const companyId = typeof company === 'string' ? null : company._id;

  const viewJobDetails = () => {
    navigate(`/job-posts/${_id}`);
  };

  const viewCompanyDetails = () => {
    if (companyId) {
      navigate(`/company/${companyId}`);
    }
  };

  return (
    <div>
      <h3>{title}</h3>
      {companyId ? (
        <p
          onClick={viewCompanyDetails}
          style={{ cursor: 'pointer', color: '#0066cc', textDecoration: 'underline' }}
        >
          {companyName}
        </p>
      ) : (
        <p>{companyName}</p>
      )}
      <p>{location}</p>

      {salary && (
        <p>
          {salary} {salaryCurrency} per {salaryPeriod}
        </p>
      )}

      {employmentType && <span>{employmentType}</span>}
      {experienceLevel && <span>{experienceLevel}</span>}

      <button onClick={viewJobDetails}>
        View Details
      </button>
    </div>
  );
};

export default JobCard;
