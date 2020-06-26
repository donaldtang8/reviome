import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const Confirm = ({
  confirmOpenCallback,
  confirmDataCallback,
  openData,
  message,
}) => {
  // confirmOpen will toggle confirm popup
  const [confirmOpen, setConfirmOpen] = useState(openData);
  // refs
  const [refs, setRefs] = useState({
    popupConfirmRef: React.createRef(),
  });
  const { popupConfirmRef } = refs;

  // when the openData property changes, we should update the local open toggle
  useEffect(() => {
    setConfirmOpen(openData);
  }, [openData]);

  // when the confirmOpen toggle changes, we want to open/close the confirm popup based on the toggle setting
  // when the confirmOpen toggle changes, we also want to add or remove a listener to see if a click was pressed outside the confirm window. If yes, then we close
  useEffect(() => {
    handleConfirmPopup();
    if (confirmOpen) {
      document.addEventListener('mousedown', handleCheckPopup);
    } else {
      document.removeEventListener('mousedown', handleCheckPopup);
    }
  }, [confirmOpen]);

  // when the close button is clicked, we want to update the confirmOpen toggle in the parent component and the local confirmOpen toggle in the current component
  const handleClose = () => {
    confirmOpenCallback(false);
    setConfirmOpen(false);
  };

  // Handle confirm popup
  const handleConfirmPopup = (e) => {
    if (confirmOpen) {
      const popup = document.querySelector('#popupConfirm');
      const popupContent = document.querySelector('#popupConfirm');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
    } else {
      const popup = document.querySelector('#popupConfirm');
      const popupContent = document.querySelector('#popupConfirm');
      popup.style.opacity = '0';
      popup.style.visibility = 'hidden';
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
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

  const handleCheckPopup = (e) => {
    if (popupConfirmRef.current) {
      if (popupConfirmRef.current.contains(e.target)) {
        return;
      }
      handleClose();
    }
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
  openData: PropTypes.bool,
  message: PropTypes.string,
};

export default Confirm;
