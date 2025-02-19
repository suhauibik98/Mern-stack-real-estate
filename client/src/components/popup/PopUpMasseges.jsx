import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import "../../styles/popupMessages.css";

const PopUpMessages = ({ message, code }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false),3000); // Show for 2 seconds
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Determine the border color based on the code
  const getBorderColor = () => {
    if (code >= 200 && code <= 299) return 'green';
    if (code >= 300 && code <= 399) return 'yellow';
    if (code >= 400) return 'red';
    return 'gray'; // Default color
  };

  return (
    <div
      className={`popup-main ${isVisible ? 'show' : 'hide'}`}
      style={{ borderColor: getBorderColor() }}
    >
      <p>{message}</p>
      {/* <p>{code}</p> */}
      <div className="progress-bar">
        <div className="progress" style={{backgroundColor:getBorderColor()}}></div>
      </div>
    </div>
  );
};

PopUpMessages.propTypes = {
  message: PropTypes.string.isRequired,
  code: PropTypes.any.isRequired,
};

export default PopUpMessages;
