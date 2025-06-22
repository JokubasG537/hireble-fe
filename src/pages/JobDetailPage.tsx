import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import Loader from '../components/Loader';
import '../style/JobDetail.scss';
import Popup from '../components/Popup';
import { UserContext } from '../contexts/UserContext';
import closeImg from '../assets/icons8-close.svg';
import shareImg from '../assets/icons8-share.svg';
import copyImg from '../assets/icons8-copy-24.png';
import useShare from '../hooks/useShare';
import portfolioImg from '../assets/icons8-bag-24.png';
import dateImg from '../assets/icons8-date-50.png';

const JobDetailPage = () => {
  const { share, copy } = useShare();
  const navigate = useNavigate();
  const { user: contextUser, token } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  // Get jobId from route parameters
  const { jobId } = useParams<{ jobId: string }>();

  const handlePopupShow = () => { setShowPopup(true); };
  const handlePopupClose = () => { setShowPopup(false); };

  const handleShare = () => {
    share(window.location.href);
  }

  const handleCopy = () => {
    copy(window.location.href);
  }

  const handleUnselectJob = () => {
    // Navigate back to jobs list or previous page
    navigate(-1); // or navigate(-1) to go back
  }

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
      <div className="detail-header">
        <button className="close-button">
          <img src={closeImg} alt="Close" onClick={handleUnselectJob} />
        </button>
        <div className="detail-header-wrapper">
          <h2>{job.title}</h2>

          <div className="job-detail-line-1">
            {companyInfo.id ? (
              <span className='detail-company-name'
                onClick={viewCompanyDetails}
              >
                {companyInfo.name}
              </span>
            ) : (
              <span>{companyInfo.name}</span>
            )}

            <span className='bullet'> {job.location}</span>
            <span className='bullet'> {job.employmentType}</span>

            <div className='salary'>
              {job.salary && (
                <span>
                  {job.salary} {job.salaryCurrency || 'USD'}{' '}
                  per {job.salaryPeriod || 'year'}
                </span>
              )}
            </div>
          </div>

          <div className="job-detail-line-2">
            {token ? (
              <button className="apply-button" onClick={() => navigate(`/apply/${job._id}`)}>Apply Now</button>
            ) : (
              <button className="apply-button" onClick={handlePopupShow}>Apply Now</button>
            )}

            <button onClick={handleShare}>
              <img src={shareImg} alt="Share" />
            </button>

            <button onClick={handleCopy}>
              <img src={copyImg} alt="Copy" />
            </button>
          </div>
        </div>
      </div>

      <div className="job-detail-wrapper">
        <div className="job-post-info">
          <h2>Job Information</h2>

          <div className="job-post-info-item">
            <div className="job-post-info-item-icon">
              <img src={portfolioImg} alt="" />
              <span>Experience Level:</span>
            </div>
            <span className="job-post-info-item-value">
              {job.experienceLevel || 'Not specified'}
            </span>
          </div>

          <div className="job-post-info-item">
            <div className="job-post-info-item-icon">
              <img src={dateImg} alt="date img" />
              <span>Posted:</span>
            </div>
            <span className="job-post-info-item-value">
              {formatDate(job.createdAt)}
            </span>
          </div>
        </div>

        <div className="job-description-wrapper">
          <h2>Description</h2>
          <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>
      </div>

      {/*
      {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={handlePopupClose}
          title="Notice"
          message="You need to be logged in to apply for this job."
          confirmText="OK"
          onConfirm={handlePopupClose}
        />
      )} */}
    </div>
  );
};

export default JobDetailPage;
