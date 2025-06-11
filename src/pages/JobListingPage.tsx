import React, { useState, useEffect } from 'react';
import { useApiQuery} from '../hooks/useApiQuery';
import JobCard from '../components/JobCard';
import '../style/JobListingPage.scss';
import {  useSearchParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import JobDetail from '../components/JobDetail';
import { motion, AnimatePresence } from "framer-motion";
import {useSavedJobMutations} from "../hooks/handleToggleSave";
import Loader from '../components/Loader'

interface JobPost {
  _id: string;
  title: string;
  company: string | { name: string; _id: string } | undefined;
  location: string;
  salary: number | undefined;
  salaryCurrency?: string;
  salaryPeriod?: string;
  employmentType?: string;
  experienceLevel?: string;
  iSaved?: boolean;

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



  const { user: contextUser, token } = useContext(UserContext);

  const { data: savedJobs } = useApiQuery(
    ['savedJobs'],
    `/savedJobs`,
    !!token
  );


  const {saveJob, unsaveJob} = useSavedJobMutations();
  const [savedJobIds, setSavedJobIds] = useState(new Set<string>());



  useEffect(() => {
    if(savedJobs?.length) {
      const ids = new Set(savedJobs.map((job) => job.jobPost._id));
      setSavedJobIds(ids);
    } else {
      setSavedJobIds(new Set())
    }
  }, [savedJobs]);

  // const handleToggleSave = (jobId: string) => {
  //     console.log('Toggling job', jobId, 'saved:', savedJobIds.has(jobId));
  //   if (savedJobIds.has(jobId)) {
  //     unsaveJob(jobId)

  //     setSavedJobIds(prev => {
  //       const newSet = new Set(prev)
  //       newSet.delete(jobId)
  //       return newSet
  //     })
  //   } else {
  //     saveJob(jobId)
  //     setSavedJobIds(prev => new Set(prev).add(jobId))
  //   }
  // }

  // const handleToggleSave = (jobId: string) => {
  //   const isSaved = savedJobIds.has(jobId)

  //   if (isSaved) {
  //     unsaveJob(jobId, {
  //       onSuccess: () => {
  //         setSavedJobIds((prev) => {
  //           const newSet = new Set(prev)
  //           newSet.delete(jobId)
  //           return newSet
  //         })
  //       }
  //     })
  //   } else {
  //     saveJob(jobId, {
  //       onSuccess: () => {
  //         setSavedJobIds((prev) => new Set(prev).add(jobId))
  //       }
  //     })
  //   }
  // }

  // const isSaved = savedJobIds.has(jobId)

  const handleToggleSave = (jobId: string) => {
    const isSaved = savedJobIds.has(jobId)

    // if (isSaved) {
    //   unsaveJob(jobId)
    //   console.log('unsaveJob', jobId)
    // } else {
    //   saveJob(jobId)
    //   console.log('saveJob', jobId)
    // }
    setSavedJobIds(prev => {
    const newSet = new Set(prev);
    isSaved ? newSet.delete(jobId) : newSet.add(jobId);
    return newSet;
    })
    
  }

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

    const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobId = searchParams.get('jobId');
  // const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
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



  const handleSelectJob = (jobId : string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('jobId', jobId);
    setSearchParams(newParams);
  }



  return (
    <div className="job-listing-page">


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

      {isLoading && <div className="loading"><Loader/></div>}

      {error && <div className="error">Error loading jobs: {error.message}</div>}

      <div className="job-results">


        <div className="split-screen-container">
        <div className="job-cards">
        <div className="results-info">
          {!isLoading && !error && (
            <span>Found {data?.total || 0} jobs</span>
          )}
        </div>


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
            isSaved={savedJobIds.has(job._id)}
            onToggleSave={handleToggleSave}
            onClick={() => handleSelectJob(job._id)}
            selected={selectedJobId === job._id}

          />
        ))}
      </div>




      <AnimatePresence mode="wait">
  {selectedJobId && (
    <motion.div
      key={selectedJobId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
    {selectedJobId ? <JobDetail jobId={selectedJobId} /> : "Please select a job to view details."}
    </motion.div>
  )}
</AnimatePresence>



        {!isLoading && !error && jobs.length === 0 && (
          <div className="no-results">No jobs found matching your criteria</div>
        )}
        </div>
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