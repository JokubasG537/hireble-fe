import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";
import ResumeList from "../components/resume/ResumeList";
import ImageUpload from "../components/ImageUpload";
import "../style/UserDashboard.scss";
const UserDashboard: React.FC = () => {
  const { user: contextUser, token } = useContext(UserContext);
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useApiQuery(
    ["current-user"],
    "/users/current",
    !!token
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (isLoading) return <div>Loading user dashboard...</div>;
  if (error) return <div>Error loading user data: {(error as Error).message}</div>;
  if (!user) return <div>User information not available.</div>;

  const companyId = typeof user.company === 'object' ? user.company?._id : user.company;
  const companyName = typeof user.company === 'object' ? user.company?.name : null;




  return (
    <div className="user-dashboard">
      <header className="user-dashboard-header">
        <h2>User Profile</h2>
        <span className="user-role">{user.role}</span>
      </header>

      <section className="user-image-section">
        <ImageUpload />
      </section>

      <section className="user-info-section">
        <div className="user-info-list">
          <div className="user-info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>

          {user.company && (
            <div className="user-info-item">
              <span className="label">Company:</span>
              <Link to={`/companies/${companyId}`} className="company-link">
                {companyName || "View Company Details"}
              </Link>
            </div>
          )}

          {user.savedJobs && (
            <div className="user-info-item">
              <span className="label">Saved Jobs:</span>
              <span className="value">{user.savedJobs.length}</span>
            </div>
          )}

          <div className="user-info-item">
            <span className="label">Member since:</span>
            <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      <section className="user-resume-section">
        <ResumeList />
      </section>
    </div>
  );
};

export default UserDashboard;
