import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery, useApiMutation } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import { useJobApplicationState, useJobApplicationDispatch } from '../contexts/JobApplicationContext';
import ResumeUpload from '../components/resume/ResumeUpload';


type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

const ApplicationForm = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { applications } = useJobApplicationState();
  const dispatch = useJobApplicationDispatch();


  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');
  const [showResumeUpload, setShowResumeUpload] = useState(false);


  const { data: jobDetails, isLoading: jobLoading } = useApiQuery(
    ['job-post', jobId],
    `/jobPosts/${jobId}`,
    !!jobId
  );


  const { data: resumes, isLoading: resumesLoading, refetch: refetchResumes } = useApiQuery(
    ['resumes'],
    '/resumes',
    true
  );


  const { mutate: submitApplication, isLoading: submitting } = useApiMutation(
    '/jobApplications',
    'POST',
    ['jobApplications']
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResume) {
      alert('Please select a resume');
      return;
    }


    const applicationData = {
      jobPost: jobId,
      resume: selectedResume,
      notes: notes || coverLetter,
    };

    // Submit application
    submitApplication(applicationData, {
      onSuccess: (newApplication) => {
        // Update application context
        dispatch({ type: 'ADD_APPLICATION', payload: newApplication });
        alert('Application submitted successfully!');
        navigate(`/jobs/${jobId}`);
      },
      onError: (error) => {
        alert(`Error submitting application: ${error.message}`);
      }
    });
  };

  
  const handleResumeUploaded = () => {
    refetchResumes();
    setShowResumeUpload(false);
  };

  if (jobLoading || resumesLoading) return <p>Loading...</p>;

  // Check if user already applied for this job
  const hasApplied = applications.some(app => app.jobPost === jobId);

  return (
    <div>
      <h2>Apply for: {jobDetails?.title}</h2>
      <h3>{jobDetails?.company?.name}</h3>

      {hasApplied ? (
        <div>
          <p>You have already applied for this position.</p>
          <button onClick={() => navigate(`/jobs/${jobId}`)}>
            Back to Job Details
          </button>
        </div>
      ) : (
        <>
          {showResumeUpload ? (
            <div>
              <h3>Upload a Resume First</h3>
              <ResumeUpload onSuccess={handleResumeUploaded} />
              <button type="button" onClick={() => setShowResumeUpload(false)}>
                Cancel Upload
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="resume">Select Resume</label>
                {resumes && resumes.length > 0 ? (
                  <select
                    id="resume"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    required
                  >
                    <option value="">-- Select a resume --</option>
                    {resumes.map(resume => (
                      <option key={resume._id} value={resume._id}>
                        {resume.title} (Uploaded: {new Date(resume.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <p>No resumes found. Please upload a resume first.</p>
                    <button
                      type="button"
                      onClick={() => setShowResumeUpload(true)}
                    >
                      Upload Resume
                    </button>
                  </div>
                )}

                {resumes && resumes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowResumeUpload(true)}
                  >
                    Upload New Resume
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="coverLetter">Cover Letter (Optional)</label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a good fit for this position..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="notes">Additional Notes (Optional)</label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes for the recruiter..."
                ></textarea>
              </div>

              <div>
                <button type="button" onClick={() => navigate(`/jobs/${jobId}`)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedResume}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationForm;
