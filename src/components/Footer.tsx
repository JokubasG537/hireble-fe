import '../style/Footer.scss';
import { Link } from 'react-router-dom';
import facebookLogo from '../assets/footer/icons8-facebook-circled.svg';
import redditLogo from '../assets/footer/icons8-reddit.svg';
import instagramLogo from '../assets/footer/icons8-instagram-circle.svg';
import githubLogo from '../assets/footer/icons8-github.svg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-top-wrapper">


        <div className="footer-left-c">
        <Link to="/" className="footer-logo">Hireble</Link>

        <p className="footer-description">Hireble is a modern job platform connecting professionals with meaningful opportunities across industries. Explore curated listings, build your resume, and take the next step in your career journey — all in one place.</p>

        <div className="footer-icons">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img src={facebookLogo} alt="Facebook" />
          </a>
          <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer">
            <img src={redditLogo} alt="Reddit" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img src={instagramLogo} alt="Instagram" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="GitHub" />
          </a>
        </div>
        </div>
        <div className="footer-links">
        {/* <div className="footer-column">
          <a className="footer-link">About</a>
          <a className="footer-link">Company</a>
          <a className="footer-link">Careers</a>
        </div> */}
             <div className="footer-column">
  <h4 className="footer-heading">Legal</h4>
  <a href="#" className="footer-link">Privacy Policy</a>
  <a href="#" className="footer-link">Terms of Service</a>
  <a href="#" className="footer-link">Cookie Settings</a>
</div>
<div className="footer-column">
  <h4 className="footer-heading">Support</h4>
  <a href="#" className="footer-link">Help Center</a>
  <a href="#" className="footer-link">Contact</a>
  <a href="#" className="footer-link">FAQ</a>
</div>


        </div>
        </div>
      <p className="footer-copy">&copy; {currentYear} Hireble. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;