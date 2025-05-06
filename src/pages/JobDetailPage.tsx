import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery } from '../hooks/useApiQuery';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useApiQuery(
    ['job-post', id],
    `/jobPosts/${id}`,
    !!id
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading job</p>;
  if (!job) return <p>Job not found</p>;

  const getCompanyInfo = () => {
    if (!job.company) return { name: 'Unknown Company', id: null };
    if (typeof job.company === 'string') return { name: job.company, id: job.company };
    if (job.company.name) return { name: job.company.name, id: job.company._id };
    if (job.company._id) return { name: `Company ID: ${job.company._id}`, id: job.company._id };
    return { name: 'Unknown Company', id: null };
  };

  const companyInfo = getCompanyInfo();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const viewCompanyDetails = () => {
    if (companyInfo.id) {
      navigate(`/company/${companyInfo.id}`);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/job-posts')}>Back to Jobs</button>

      <h1>{job.title}</h1>

      {companyInfo.id ? (
        <h2
          onClick={viewCompanyDetails}
          style={{ cursor: 'pointer', color: '#0066cc', textDecoration: 'underline' }}
        >
          {companyInfo.name}
        </h2>
      ) : (
        <h2>{companyInfo.name}</h2>
      )}

      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.employmentType}</p>

      {job.salary && (
        <p>
          <strong>Salary:</strong> {job.salary} {job.salaryCurrency || 'USD'}
          per {job.salaryPeriod || 'year'}
        </p>
      )}

      <p><strong>Experience Level:</strong> {job.experienceLevel || 'Not specified'}</p>

      {/* Add posting information */}
      <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>

      {/* Add recruiter information */}
      {job.postedBy && (
        <p><strong>Contact:</strong> {job.postedBy.email}</p>
      )}

      <h3>Description</h3>
      <div dangerouslySetInnerHTML={{ __html: job.description }} />

      <button onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</button>
    </div>
  );
};

export default JobDetailPage;
