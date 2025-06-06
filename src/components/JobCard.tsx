import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/JobCard.scss';

interface JobCardProps {
  _id: string;
  title: string;
  company: string | { name: string; _id: string } | undefined;
  location: string;
}

const JobCard: React.FC<JobCardProps> = ({ _id, title, company, location }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('JobCard clicked, navigating to:', `/jobs/${_id}`);
    navigate(`/jobs/${_id}`); // Navigate to job detail URL
  };

  const companyName = !company
    ? 'Unknown Company'
    : typeof company === 'string'
      ? company
      : company.name;

  return (
    <div
      className="job-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log('JobCard keydown, navigating to:', `/jobs/${_id}`);
          navigate(`/jobs/${_id}`);
        }
      }}
    >
      <h3>{title}</h3>
      <span className="company-name">{companyName}</span>
      <span className="location">{location}</span>
    </div>
  );
};

export default JobCard;