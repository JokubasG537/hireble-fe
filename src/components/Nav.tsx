import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Nav = () => {
  return (
    <nav>
      <div>
        <Link to="/job-posts">Jobs</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>

      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/dashboard">Company Dashboard</Link>
      </div>
      <div>
        <Link to="/user-dashboard">User Dashboard</Link>
      </div>
      <div>
        <Link to="/create-job">Create Job</Link>
      </div>
      <div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Nav;