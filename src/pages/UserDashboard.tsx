import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useApiQuery } from "../hooks/useApiQuery";
import ResumeList from "../components/resume/ResumeList";
const UserDashboard: React.FC = () => {
  const { user: contextUser, token } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch user data with populated company
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

  // Determine if company is an object or just an ID
  const companyId = typeof user.company === 'object' ? user.company?._id : user.company;
  const companyName = typeof user.company === 'object' ? user.company?.name : null;

  return (
    <div className="user-dashboard">
      <h2>User Profile</h2>

      <div className="user-info-card">
        <div className="user-detail">
          <strong>Email:</strong> {user.email}
        </div>

        <div className="user-detail">
          <strong>Role:</strong> {user.role}
        </div>

        {user.company && (
          <div className="user-detail">
            <strong>Company:</strong>{" "}
            <Link to={`/companies/${companyId}`} className="company-link">
              {companyName || "View Company Details"}
            </Link>
          </div>
        )}

        {user.savedJobs && (
          <div className="user-detail">
            <strong>Saved Jobs:</strong> {user.savedJobs.length}
          </div>
        )}

        <div className="user-detail">
          <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>

      <ResumeList />
    </div>
  );
};

export default UserDashboard;
