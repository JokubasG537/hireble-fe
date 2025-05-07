import React from 'react';
import { useParams } from 'react-router-dom';
import { useApiQuery } from '../hooks/useApiQuery';
import RecruitersList from '../components/RecruitersList';
import '../style/CompanyPublicPage.scss';

function PublicCompanyPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useApiQuery(
    ['publicCompany', id],
    `/companies/${id}`,
    true
  );

  if (isLoading) return <div className="loading">Loading company details...</div>;
  if (error) return <div className="error">Failed to load company: {error.message}</div>;
  if (!data) return <div className="not-found">Company not found</div>;


  const company = data.company;

return (
    <div className="company-profile">
      <header className="company-header">
        {company.logoUrl && (
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="company-logo"
          />
        )}
        <div>
          <h1>{company.name}</h1>
          <div className="company-industry">{company.industry}</div>
        </div>
      </header>

      <main className="company-main">
        <section className="company-info-section">
          <div className="company-description">
            <h2>About</h2>
            <p>{company.description}</p>
          </div>
          <div className="company-info">
            <div className="info-item">
              <strong>Location:</strong> {company.location}
            </div>
            {company.website && (
              <div className="info-item">
                <strong>Website:</strong>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </div>
            )}
            <div className="info-item">
              <strong>Registered:</strong> {new Date(company.createdAt).toLocaleDateString()}
            </div>
          </div>
          <RecruitersList companyId={company._id}/>
        </section>

        {company.jobPosts && company.jobPosts.length > 0 && (
          <section className="company-jobs-section">
            <h2>Open Positions</h2>
            <ul className="job-list">
              {company.jobPosts.map(job => (
                <li key={job._id} className="job-item">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  <a href={`/jobs/${job._id}`}>View Details</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default PublicCompanyPage;
