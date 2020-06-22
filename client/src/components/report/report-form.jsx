import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { createReport } from './../../redux/actions/reports';

const ReportForm = ({ createReport, item, type, history }) => {
  let userToId = type === 'User' ? item._id : item.user._id;
  const [formData, setFormData] = useState({
    user_to: userToId,
    item_id: item._id,
    item_type: type,
    report_type: '',
    message: '',
  });

  const { user_to, item_id, item_type, report_type, message } = formData;

  const [visible, setVisible] = useState(true);
  const [refs, setRefs] = useState({
    popupReportRef: React.createRef(),
  });

  const { popupReportRef } = refs;

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleCheckPopup);
    } else {
      document.removeEventListener('mousedown', handleCheckPopup);
    }
  }, [visible]);

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
  };

  const handlePopup = (e) => {
    const popup = document.querySelector('#popupReport');
    const popupContent = document.querySelector('#popupReportContent');
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
    setVisible(false);
    // popupContent.opacity = "0";
    // popupContent.transform = "translate(0, 0) scale(0)";
  };

  const handleCheckPopup = (e) => {
    if (popupReportRef.current) {
      if (popupReportRef.current.contains(e.target)) {
        return;
      }
      handlePopup();
    }
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
          <div className="popup__close" id="popup__close" onClick={handlePopup}>
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
};

const mapStateToProps = (state) => ({
  categories: state.categories,
});

export default connect(mapStateToProps, { createReport })(
  withRouter(ReportForm)
);
