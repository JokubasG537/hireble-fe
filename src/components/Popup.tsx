import  { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('portal-root') || document.body;

const Popup = ({
  isOpen,
  onClose,
  title = 'Notice',
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
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      tabIndex={-1}
      ref={modalRef}
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="popup-title" style={styles.title}>
          {title}
        </h2>

        {message && <p style={styles.message}>{message}</p>}


        {children}

        <div style={styles.actions}>
          {showCancel && (
            <button onClick={onClose} style={styles.cancelButton}>
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} style={styles.confirmButton}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#fff',
    padding: '25px 30px',
    borderRadius: '10px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
    outline: 'none',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '22px',
    fontWeight: '700',
  },
  message: {
    marginBottom: '20px',
    fontSize: '16px',
    lineHeight: 1.4,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default Popup;
