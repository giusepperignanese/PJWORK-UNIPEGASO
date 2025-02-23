import React from 'react';
import { Monitor, User } from 'lucide-react';

const LoadingSpinner = () => {

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="#86BC25"
              strokeWidth="5"
              fill="none"
              strokeDasharray="110"
              strokeDashoffset="110"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="360"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <div className="icon-container">
            <Monitor className="icon monitor" size={20} />
            <User className="icon user" size={16} />
          </div>
        </div>
        <p className="loading-subtext">
         loading
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
