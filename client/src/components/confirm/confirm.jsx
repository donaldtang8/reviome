import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const Confirm = ({
  confirmOpenCallback,
  confirmDataCallback,
  confirmOpen,
  message,
}) => {
  // confirmOpen will toggle confirm popup
  const [open, setOpen] = useState(confirmOpen);
  // refs
  const [refs, setRefs] = useState({
    popupConfirmRef: React.createRef(),
  });
  const { popupConfirmRef } = refs;

  // when the openData property changes, we should update the local open toggle
  useEffect(() => {
    setOpen(confirmOpen);
  }, [confirmOpen]);

  // when the local open toggle is changed, we add or remove the mousedown listener depending on whether open toggle is open or closed
  useEffect(() => {
    handlePopup();
    if (open) {
      document.addEventListener('mousedown', handleCheckPopup);
    } else {
      document.removeEventListener('mousedown', handleCheckPopup);
    }
  }, [open]);

  // when the close button is clicked, we want to update the confirmOpen toggle in the parent component and the local confirmOpen toggle in the current component
  const handleClose = () => {
    confirmOpenCallback(false);
    setOpen(false);
  };

  // mousedown listener event that will check if popup is to be closed
  const handleCheckPopup = (e) => {
    if (popupConfirmRef.current) {
      if (popupConfirmRef.current.contains(e.target)) {
        return;
      }
      handleClose();
    }
  };

  // popup handler that is called when open toggle is changed to either open or close the popup
  const handlePopup = (e) => {
    if (open) {
      const popup = document.querySelector('#popupConfirm');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
    } else {
      const popup = document.querySelector('#popupConfirm');
      popup.style.opacity = '0';
      popup.style.visibility = 'hidden';
      handleClose();
    }
  };

  // when user has made a selection, we want to call the callback to set the selection and close the confirm popup
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (e.target.value === 'Confirm') {
      confirmDataCallback(true);
    } else {
      confirmDataCallback(false);
    }
    handleClose();
  };

  return (
    <div className="popup popupConfirm" id="popupConfirm">
      <div
        ref={popupConfirmRef}
        className="popup__content popupConfirm__content"
        id="popupConfirm__content"
      >
        <div className="popup__header">
          <div className="popup__header--title">Confirm</div>
          <div className="popup__close" id="popup__close" onClick={handleClose}>
            &times;
          </div>
        </div>
        {message && <div className="popup__message">{message}</div>}
        <div className="popup__main confirm-form__container">
          <form className="confirm-form__container--form">
            <input
              className="input__submit"
              type="submit"
              value="Cancel"
              onClick={handleSubmitClick}
            />
            <input
              className="input__submit"
              type="submit"
              value="Confirm"
              onClick={handleSubmitClick}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

Confirm.propTypes = {
  confirmOpenCallback: PropTypes.func,
  confirmDataCallback: PropTypes.func,
  confirmOpen: PropTypes.bool,
  message: PropTypes.string,
};

export default Confirm;
