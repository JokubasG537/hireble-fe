import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiQuery } from '../../hooks/useApiQuery';
import '../../style/ResumeList.scss';


const ResumeList = () => {
  const navigate = useNavigate();
  const { data: resumes, isLoading, error } = useApiQuery(['resumes'], '/resumes', true);

  if (isLoading) return <p>Loading resumes...</p>;
  if (error) return <p>Error loading resumes</p>;

  return (
    <section className="resume-list-section">
      <div className="resume-list-header">
        <h2>My Resumes</h2>
        <button className="resume-upload-btn" onClick={() => navigate('/resumes/upload')}>
          Upload New Resume
        </button>
      </div>

      {resumes && resumes.length > 0 ? (
        <ul className="resume-list">
          {resumes.map(resume => (
            <li key={resume._id} className="resume-list-item">
              <div className="resume-title-row">
                <h3 className="resume-title">{resume.title}</h3>
                <span className="resume-date">
                  Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="resume-actions">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-action-link"
                >
                  View
                </a>
                {/* <button
                  className="resume-action-btn"
                  onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                >
                  Edit
                </button> */}
                <button
                  className="resume-action-btn"
                  onClick={() => navigate(`/resumes/${resume._id}`)}
                >
                  Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="resume-empty">No resumes found. Upload your first resume!</p>
      )}
    </section>
  );
};

export default ResumeList;
