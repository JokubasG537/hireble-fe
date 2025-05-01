import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
const Nav = () => {
  return (
    <nav>
      <div>
        <Link to="/jobs">Jobs</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Nav;