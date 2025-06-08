import {  useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import Loader from './Loader';
import '../style/JobDetail.scss';
import Popup from './Popup';
import { UserContext } from '../contexts/UserContext';
interface JobDetailProps {
  jobId: string;
}


const JobDetail = ( { jobId }: JobDetailProps) => {
  const navigate = useNavigate();
  const { user: contextUser, token } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);


  const handlePopupShow = ( ) => { setShowPopup(true); };
  const handlePopupClose = () => { setShowPopup(false); };
  console.log(token)

  const { data: job, isLoading, error } = useApiQuery(
    ['job-post', jobId],
    `/jobPosts/${jobId}`,
    !!jobId
  );

  if (isLoading) return <Loader />;
  if (error) return <p>{(error as Error).message}</p>;
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
    <div className="job-detail-panel">


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

      {token ? (
        <button onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</button>
      ) : (
        <button onClick={handlePopupShow}>Apply Now</button>
      )}

      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={handlePopupClose}
          title="Notice"
          message="You need to be logged in to apply for this job."
          confirmText="OK"
          onConfirm={handlePopupClose}
        />
      )}


    </div>
  );
};

export default JobDetail;