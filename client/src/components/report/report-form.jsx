import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { createReport } from './../../redux/actions/reports';

const ReportForm = ({
  createReport,
  item,
  type,
  history,
  reportOpen,
  reportOpenCallback,
}) => {
  // reportOpen will toggle report popup
  const [open, setOpen] = useState(reportOpen);
  // refs
  const [refs, setRefs] = useState({
    popupReportRef: React.createRef(),
  });
  const { popupReportRef } = refs;

  // when the reportOpen property changes, we should update the local open toggle
  useEffect(() => {
    setOpen(reportOpen);
  }, [reportOpen]);

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
    reportOpenCallback(false);
    setOpen(false);
  };

  // mousedown listener event that will check if popup is to be closed
  const handleCheckPopup = (e) => {
    if (popupReportRef.current) {
      if (popupReportRef.current.contains(e.target)) {
        return;
      }
      handleClose();
    }
  };

  // popup handler that is called when open toggle is changed to either open or close the popup
  const handlePopup = (e) => {
    if (open) {
      const popup = document.querySelector('#popupReport');
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
      // const popupContent = document.querySelector('#popupReport');
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
    } else {
      const popup = document.querySelector('#popupReport');
      popup.style.opacity = '0';
      popup.style.visibility = 'hidden';
      // const popupContent = document.querySelector('#popupReport');
      // popupContent.opacity = "1";
      // popupContent.transform = "translate(-50%, -50%) scale(1)";
      handleClose();
    }
  };

  // grab user id from props
  let userToId = type === 'User' ? item._id : item.user._id;

  // create formData in state
  const [formData, setFormData] = useState({
    user_to: userToId,
    item_id: item._id,
    item_type: type,
    report_type: '',
    message: '',
  });

  const { message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createReport(formData);
    setFormData({
      user_to: '',
      item_id: '',
      item_type: '',
      report_type: '',
      message: '',
    });
    document.querySelector('select#report_type').selectedIndex = 0;
    handleClose();
  };

  return (
    <div className="popup popupReport" id="popupReport">
      <div
        ref={popupReportRef}
        className="popup__content popupReport__content"
        id="popupReport__content"
      >
        <div className="popup__header">
          <div className="popup__header--title">Create Report</div>
          <div className="popup__close" id="popup__close" onClick={handleClose}>
            &times;
          </div>
        </div>
        <div className="popup__main report-form__container">
          <form
            className="report-form__container--form"
            onSubmit={handleSubmit}
          >
            <input
              className="report-form__container--item"
              type="text"
              name="message"
              placeholder="Message"
              value={message}
              onChange={handleChange}
              required
            />
            <div className="report-form__container--item">
              {/* <label htmlFor="reportType">Report Type:</label> */}
              <select
                className="input__select"
                id="report_type"
                name="report_type"
                onChange={handleChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Report Type
                </option>
                <option className="report-form__container--option" value="Spam">
                  Spam
                </option>
                <option
                  className="report-form__container--option"
                  value="Inappropriate"
                >
                  Inappropriate
                </option>
                <option
                  className="report-form__container--option"
                  value="Harassment"
                >
                  Harassment
                </option>
                <option
                  className="report-form__container--option"
                  value="Harmful"
                >
                  Harmful
                </option>
              </select>
            </div>
            <input className="input__submit" type="submit" value="Report" />
          </form>
        </div>
      </div>
    </div>
  );
};

ReportForm.propTypes = {
  report: PropTypes.object,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  reportOpen: PropTypes.bool,
  reportOpenCallback: PropTypes.func,
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, { createReport })(
  withRouter(ReportForm)
);
