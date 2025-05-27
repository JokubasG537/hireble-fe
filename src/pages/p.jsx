import React, { useState, useMemo } from 'react';

const mockJobs = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Frontend Developer ${i + 1}`,
  company: `Company ${Math.ceil(Math.random() * 10)}`,
  location: ['Remote', 'New York', 'Berlin', 'Tokyo'][i % 4],
  type: ['Full-Time', 'Part-Time', 'Contract'][i % 3],
  description: `This is a description for job #${i + 1}`,
}));

const JobCard = ({ job }) => (
  <div className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition bg-white">
    <h2 className="text-xl font-semibold">{job.title}</h2>
    <p className="text-sm text-gray-600">{job.company} — {job.location}</p>
    <p className="mt-2 text-sm">{job.description}</p>
    <div className="mt-4">
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{job.type}</span>
    </div>
  </div>
);

const JobBoard = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [page, setPage] = useState(1);
  const jobsPerPage = 10;

  const filteredJobs = useMemo(() => {
    return mockJobs
      .filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      )
      .filter((job) => typeFilter === 'All' || job.type === typeFilter)
      .filter((job) => locationFilter === 'All' || job.location === locationFilter);
  }, [search, typeFilter, locationFilter]);

  const pageCount = Math.ceil(filteredJobs.length / jobsPerPage);
  const jobsToShow = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Job Board</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title or company..."
          className="flex-1 border rounded-xl px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-xl px-4 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All</option>
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Contract</option>
        </select>
        <select
          className="border rounded-xl px-4 py-2"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option>All</option>
          <option>Remote</option>
          <option>New York</option>
          <option>Berlin</option>
          <option>Tokyo</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobsToShow.length > 0 ? (
          jobsToShow.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="text-center col-span-full">No jobs found.</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded-full"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page} of {pageCount}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded-full"
          onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobBoard;
