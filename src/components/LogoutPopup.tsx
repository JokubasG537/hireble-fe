import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import closeImg from '../assets/icons8-close.svg';
import { Link } from 'react-router-dom';
import '../style/Login-Popup.scss';
import LogoutButton from './LogoutButton';

const portalRoot = document.getElementById('logout-root') || document.body;

const LogoutPopup = ({
  isOpen,
  onClose,
  onConfirm,
  // showCancel = true,
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
      <div className="modal-3" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button onClick={onClose} className="closeButton">
          <img src={closeImg} alt="close button icon" />
        </button>

        <div className="container">


          <div className="textWrapper">
            <h2 className="title">
              Log out of your account?
            </h2>
            <p className="message">
              You will need to sign in again to access your saved jobs, applications, and preferences.
            </p>

            <div className="linksContainer">
              <LogoutButton/>
              <button className='cancel-button' onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default LogoutPopup;
