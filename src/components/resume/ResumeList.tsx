import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiQuery } from '../../hooks/useApiQuery';
import { Upload, FileText, Eye, Info, Plus } from 'lucide-react';
import '../../style/ResumeList.scss';

const ResumeList = () => {
  const navigate = useNavigate();
  const { data: resumes, isLoading, error } = useApiQuery(['resumes'], '/resumes', true);

  if (isLoading) return <div className="loading">Loading resumes...</div>;
  if (error) return <div className="error">Error loading resumes</div>;

  return (
    <section className="resume-list-section">
      <div className="resume-list-header">
        <h2>
          <FileText size={24} />
          My Resumes
        </h2>
        <button className="resume-upload-btn" onClick={() => navigate('/resumes/upload')}>
          <Plus size={16} />
          Upload New Resume
        </button>
      </div>

      {resumes && resumes.length > 0 ? (
        <div className="resume-list-container">
          {resumes.map(resume => (
            <div key={resume._id} className="resume-list-item">
              <div className="resume-info">
                <div className="resume-title-row">
                  <h3 className="resume-title">
                    <FileText size={18} />
                    {resume.title}
                  </h3>
                  <span className="resume-date">
                    Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="resume-actions">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-action-btn view-btn"
                >
                  <Eye size={16} />
                  View
                </a>

                <button
                  className="resume-action-btn details-btn"
                  onClick={() => navigate(`/resumes/${resume._id}`)}
                >
                  <Info size={16} />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="resume-empty">
          <Upload size={48} />
          <p>No resumes found. Upload your first resume!</p>
        </div>
      )}
    </section>
  );
};

export default ResumeList;
