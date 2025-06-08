import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
// import img from "../assets/220042797.png"
import "../style/Nav.scss"



const Nav = () => {
  const { user } = useContext(UserContext);
  const isLoggedIn = !!user;
  const isRecruiter = user?.role === "recruiter";

  return (
    <nav>

      <Link to="/">
        <h2 className='logo'>Hirible</h2>
      </Link>

      <div className='nav-links'>
      {!isLoggedIn && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}

      {isRecruiter && (
        <Link to="/dashboard">Company Dashboard</Link>
      )}

      {isLoggedIn && (
        <>
          <Link to="/user-dashboard">User Dashboard</Link>
          <LogoutButton />
        </>
      )}
      </div>
    </nav>
  );
};

export default Nav;
