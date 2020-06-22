import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

const Confirm = ({ parentCallback, message }) => {
  const [visible, setVisible] = useState(true);
  const [refs, setRefs] = useState({
    popupConfirmRef: React.createRef(),
  });

  const { popupConfirmRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleCheckPopup);
    } else {
      document.removeEventListener('mousedown', handleCheckPopup);
    }
  }, [visible]);

  const handleClick = (e) => {
    console.log(e.target.value);
    console.log(typeof e.target.value);
    e.preventDefault();
    if (e.target.value === 'Confirm') {
      parentCallback(true);
    } else {
      parentCallback(false);
    }
    handlePopup();
  };

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupConfirm');
    const popupContent = document.querySelector('#popupConfirmContent');
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
    setVisible(false);
    // popupContent.opacity = "0";
    // popupContent.transform = "translate(0, 0) scale(0)";
  };

  const handleCheckPopup = (e) => {
    if (popupConfirmRef.current) {
      if (popupConfirmRef.current.contains(e.target)) {
        return;
      }
      handlePopup();
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
          <div className="popup__close" id="popup__close" onClick={handlePopup}>
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
              onClick={handleClick}
            />
            <input
              className="input__submit"
              type="submit"
              value="Confirm"
              onClick={handleClick}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

Confirm.propTypes = {
  parentCallback: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default Confirm;
