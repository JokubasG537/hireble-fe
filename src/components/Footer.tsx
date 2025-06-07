import '../style/Footer.scss';

const Footer : React.FC = () => {
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  }
  const currentYear = getCurrentYear();

  return (
    <footer>
      <p>&copy; {currentYear} Hireble. All rights reserved.</p>
    </footer>
  );
}

export default Footer;