import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import closeImg from '../assets/icons8-close.svg';
import { Link } from 'react-router-dom';
import '../style/Login-Popup.scss'; 

const portalRoot = document.getElementById('portal-root') || document.body;

const Popup = ({
  isOpen,
  onClose,
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = true,
  children,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);



    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if(isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button onClick={onConfirm} className="closeButton">
          <img src={closeImg} alt="close button icon" />
        </button>

        <div className="container">
          <div className="imageContainer">

          </div>

          <div className="textWrapper">
            <h2 className="title">
              Log in to unlock full features
            </h2>
            <p className="message">
              To access this feature, please log in to your account. Enjoy smarter job tracking, resume tools, and saved job listings.
            </p>

            <div className="linksContainer">
              <Link to="/login" className="link">
                Log in
              </Link>
              <Link to="/register" className="link">
                Register
              </Link>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default Popup;
