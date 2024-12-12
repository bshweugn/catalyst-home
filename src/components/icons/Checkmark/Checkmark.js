import React from 'react';

const Checkmark = ({ size = '24px', fill = 'currentColor', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      className={`checkmark ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.0078 43.6523">
        <g>
          <rect height="43.6523" opacity="0" width="43.0078" x="0" y="0" />
          <path d="M15.8008 43.6523C16.7188 43.6523 17.4023 43.2422 17.9102 42.5L42.0898 4.58984C42.4805 3.98438 42.6367 3.51562 42.6367 3.04688C42.6367 1.85547 41.8555 1.07422 40.6641 1.07422C39.8438 1.07422 39.3555 1.36719 38.8672 2.16797L15.7031 38.7695L3.86719 23.7305C3.33984 23.0078 2.83203 22.6953 2.03125 22.6953C0.839844 22.6953 0 23.5156 0 24.6875C0 25.1953 0.195312 25.7227 0.625 26.25L13.6133 42.4609C14.2578 43.2812 14.9023 43.6523 15.8008 43.6523Z" />
        </g>
      </svg>
    </svg>
  );
};

export default Checkmark;
