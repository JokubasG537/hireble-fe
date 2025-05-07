import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/JobCard.scss';

interface JobCardProps {
  _id: string;
  title: string;
  company: string | { name: string; _id: string } | undefined;
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

  const companyName = !company
    ? 'Unknown Company'
    : typeof company === 'string'
      ? company
      : company.name;

  const companyId = !company
    ? null
    : typeof company === 'string'
      ? null
      : company._id;

  const viewJobDetails = () => {
    navigate(`/job-posts/${_id}`);
  };

  const viewCompanyDetails = () => {
    if (companyId) {
      navigate(`/companies/${companyId}`);
    }
  };

  return (
    <div className="job-card">
      <h3>{title}</h3>
      {companyId ? (
        <span className="company-link" onClick={viewCompanyDetails}>
          {companyName}
        </span>
      ) : (
        <span className="company-name">{companyName}</span>
      )}
      <span className="location">{location}</span>
      {salary && (
        <span className="salary">
          {salary} {salaryCurrency} / {salaryPeriod}
        </span>
      )}
      <div className="meta">
        {employmentType && <span>{employmentType}</span>}
        {experienceLevel && <span>{experienceLevel}</span>}
      </div>
      <button onClick={viewJobDetails}>View Details</button>
    </div>
  );
};

export default JobCard;