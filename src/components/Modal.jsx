import BsModal from 'react-bootstrap/Modal';

/**
 * Reusable modal shell (react-bootstrap). Pass `footer` for action buttons.
 */
function Modal({ show, onHide, title, children, footer, size, backdrop = 'static' }) {
  return (
    <BsModal show={show} onHide={onHide} centered size={size} backdrop={backdrop}>
      <BsModal.Header closeButton>
        <BsModal.Title as="h2" className="h5 mb-0">
          {title}
        </BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
      {footer != null ? <BsModal.Footer className="border-top-0 pt-0">{footer}</BsModal.Footer> : null}
    </BsModal>
  );
}

export default Modal;
