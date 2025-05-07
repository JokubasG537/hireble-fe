import React from 'react';
import { Link } from 'react-router-dom';
import { useApiQuery } from '../hooks/useApiQuery';

interface Recruiter {
  _id: string;
  username?: string;
  email?: string;
}

interface RecruitersListProps {
  companyId: string;
}

export default function RecruitersList({ companyId }: RecruitersListProps) {
  const { data, isLoading, error } = useApiQuery(
    ['company', companyId],
    `/companies/${companyId}`,
    !!companyId
  );

  const company = data?.company;
  const recruiterIds: string[] = company?.recruiters || [];


  const { data: usersData, isLoading: isLoadingUsers } = useApiQuery(
    ['users', recruiterIds.join(',')],
    recruiterIds.length ? `/users?ids=${recruiterIds.join(',')}` : '',
    recruiterIds.length > 0
  );

  const recruiters: Recruiter[] = usersData || [];

  if (isLoading) {
    return <p>Loading recruiter information...</p>;
  }

  if (error) {
    return <p>Error loading recruiters</p>;
  }

  if (!recruiterIds.length) {
    return <p>No recruiter information available.</p>;
  }

  if (isLoadingUsers) {
    return <p>Loading recruiter details...</p>;
  }

  return (
    <ul className="recruiters-list">
      {recruiters.map((recruiter) => (
        <li key={recruiter._id}>
          <Link to={`/users/${recruiter._id}`}>
            {recruiter.username || 'Unknown Recruiter'}
          </Link>
        </li>
      ))}
    </ul>
  );
}
