import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/JobCard.scss';

interface JobCardProps {
  _id: string;
  title: string;
  company: string | { name: string; _id: string } | undefined;
  location: string;
  salary: number;
  onClick: () => void;
  selected?: boolean;
}



const JobCard: React.FC<JobCardProps> = ({ _id, title, company, location, salary, onClick, selected }) => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   console.log('JobCard clicked, navigating to:', `/jobs/${_id}`);
  //   navigate(`/jobs/${_id}`);
  // };

  const companyName = !company
    ? 'Unknown Company'
    : typeof company === 'string'
      ? company
      : company.name;

  return (
    <div
      className={`job-card ${selected ? `selected` : ``}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log('JobCard keydown, navigating to:', `/jobs/${_id}`);
         onClick();
        }
      }}
    >
      <h3>{title}</h3>
      <span className="company-name">{companyName}</span>
      <span className="location">{location}</span>
      <span className="salary">${salary}</span>
    </div>
  );
};

export default JobCard;