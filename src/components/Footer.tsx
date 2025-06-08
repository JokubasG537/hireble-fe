import '../style/Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="footer-column">
          <a className="footer-link">About</a>
          <a className="footer-link">Company</a>
          <a className="footer-link">Careers</a>
        </div>
        <div className="footer-column">
          <a className="footer-link">Privacy Policy</a>
          <a className="footer-link">Terms of Service</a>
          <a className="footer-link">Cookie Settings</a>
        </div>
        <div className="footer-column">
          <a className="footer-link">Help Center</a>
          <a className="footer-link">Contact</a>
          <a className="footer-link">FAQ</a>
        </div>
      </div>
      <p className="footer-copy">&copy; {currentYear} Hireble. All rights reserved.</p>
    </footer>
  );
};

export default Footer;