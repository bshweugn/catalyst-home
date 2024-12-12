import React from 'react';

const Video = ({ size = '24px', fill = 'currentColor', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      className={`video ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Paste your SVG content here */}
    </svg>
  );
};

export default Video;
