import React from 'react';

const Drop = ({ size = '24px', fill = 'currentColor', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      className={`drop ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.8965 19.7949">
        <g>
          <rect height="19.7949" opacity="0" width="13.8965" x="0" y="0" />
          <path d="M6.76758 19.7754C10.8301 19.7754 13.5352 17.1289 13.5352 13.1641C13.5352 11.2109 12.7734 9.26758 12.1973 7.96875C11.1523 5.61523 9.35547 3.02734 7.8418 0.683594C7.54883 0.244141 7.16797 0 6.76758 0C6.37695 0 5.98633 0.244141 5.69336 0.683594C4.17969 3.02734 2.38281 5.61523 1.33789 7.96875C0.771484 9.26758 0 11.2109 0 13.1641C0 17.1289 2.70508 19.7754 6.76758 19.7754Z" />
        </g>
      </svg>
    </svg>
  );
};

export default Drop;
