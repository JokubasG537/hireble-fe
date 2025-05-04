import React from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import JobCard from '../components/JobCard';

const JobListingPage = () => {

  const { data, isLoading, error } = useApiQuery(
    ['job-posts'],
    '/jobPosts',
    true
  );


  const jobs = data?.jobPosts || [];

  return (
    <div>
      <h1>Available Jobs</h1>

      {isLoading && <p>Loading jobs...</p>}
      {error && <p>Error loading jobs</p>}

      <div>
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

        {!isLoading && jobs.length === 0 && <p>No jobs found</p>}
      </div>
    </div>
  );
};

export default JobListingPage;
