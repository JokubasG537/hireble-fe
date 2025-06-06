// import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery } from '../hooks/useApiQuery';

const JobDetail = () => {
  const params = useParams();
  const jobId = params.id || params.jobId;
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useApiQuery(
    ['job-post', jobId],
    `/jobPosts/${jobId}`,
    !!jobId
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading job</p>;
  if (!job) return <p>Job not found</p>;

  const getCompanyInfo = () => {
    if (!job.company) return { name: 'Unknown Company', id: null };
    if (typeof job.company === 'string') return { name: job.company, id: job.company };
    if (job.company.name) return { name: job.company.name, id: job.company._id };
    return { name: 'Unknown Company', id: null };
  };

  const companyInfo = getCompanyInfo();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const viewCompanyDetails = () => {
    if (companyInfo.id) {
      navigate(`/companies/${companyInfo.id}`);
    }
  };

  return (
    <div>
      

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

      <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>

      {job.postedBy && (
        <p><strong>Contact:</strong> {job.postedBy.email}</p>
      )}

      <h3>Description</h3>
      <div dangerouslySetInnerHTML={{ __html: job.description }} />

      <button onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</button>
    </div>
  );
};

export default JobDetail;