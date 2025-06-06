import React, { useState } from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import JobCard from '../components/JobCard';
import '../style/JobListingPage.scss';

interface JobPost {
  _id: string;
  title: string;
  company: string | { name: string; _id: string } | undefined;
  location: string;
  salary: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  employmentType?: string;
  experienceLevel?: string;
}

interface JobListingPageProps {
  onSelectJob?: (jobId: string) => void;
}

const JobListingPage: React.FC<JobListingPageProps> = ({ onSelectJob }) => {
  const [filters, setFilters] = useState({
    employmentType: '',
    industry: '',
    experienceLevel: '',
    salary: '',
    salaryPeriod: '',
    keyword: '',
    page: 1,
    limit: 10,
    sort: 'newest',
  });

  const queryString = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  const { data, isLoading, error } = useApiQuery(
    ['job-posts', queryString],
    `/jobPosts?${queryString}`,
    true
  );

  const jobs = data?.jobPosts || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name !== 'page' && { page: 1 }),
    }));
  };

  const clearFilters = () => {
    setFilters({
      employmentType: '',
      industry: '',
      experienceLevel: '',
      salary: '',
      salaryPeriod: '',
      keyword: '',
      page: 1,
      limit: 10,
      sort: 'newest',
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="job-listing-page">
      {/* <h1>Available Jobs</h1> */}

      <div className="filter-container">
      <div className="filter-section">
        <h2>Filter Jobs</h2>

        <div className="filter-controls">
          <input
            type="text"
            name="keyword"
            placeholder="Search jobs..."
            value={filters.keyword}
            onChange={handleFilterChange}
            className="search-input"
          />

          <select name="employmentType" value={filters.employmentType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="temporary">Temporary</option>
          </select>

          <select name="industry" value={filters.industry} onChange={handleFilterChange}>
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>

          <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
            <option value="">All Experience Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead Level</option>
          </select>

          <select name="salaryPeriod" value={filters.salaryPeriod} onChange={handleFilterChange}>
            <option value="">All Periods</option>
            <option value="hourly">Per Hour</option>
            <option value="monthly">Per Month</option>
            <option value="yearly">Per Year</option>
          </select>

          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>

          <button onClick={clearFilters} className="clear-btn">Clear Filters</button>
        </div>

        <div className="active-filters">
          {Object.entries(filters)
            .filter(([key, value]) => value && key !== 'page' && key !== 'limit' && key !== 'sort')
            .map(([key, value]) => (
              <span key={key} className="filter-tag">
                {key}: {value}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                  className="remove-filter"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      </div>
      </div>

      {isLoading && <div className="loading">Loading jobs...</div>}

      {error && <div className="error">Error loading jobs: {error.message}</div>}

      <div className="job-results">
        <div className="results-info">
          {!isLoading && !error && (
            <span>Found {data?.total || 0} jobs</span>
          )}
        </div>

            <div className="job-cards">
        {jobs.map(job => (
          <JobCard
            key={job._id}
            _id={job._id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            salaryCurrency={job.salaryCurrency}
            salaryPeriod={job.salaryPeriod}
            employmentType={job.employmentType}
            experienceLevel={job.experienceLevel}
            onClick={() => onSelectJob?.(job._id)}
          />
        ))}
      </div>

        {/* <div className="job-cards">
          {jobs.map(job => (
            <JobCard
              key={job._id}
              _id={job._id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              salaryCurrency={job.salaryCurrency}
              salaryPeriod={job.salaryPeriod}
              employmentType={job.employmentType}
              experienceLevel={job.experienceLevel}
            />
          ))}
        </div> */}

        {!isLoading && !error && jobs.length === 0 && (
          <div className="no-results">No jobs found matching your criteria</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="page-btn prev"
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`page-number ${filters.page === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            className="page-btn next"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobListingPage;