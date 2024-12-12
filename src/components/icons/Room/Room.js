import React from 'react';

const Room = ({ size = '24px', fill = 'currentColor', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      className={`room ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.3281 35.9961">
        <g>
          <rect height="35.9961" opacity="0" width="36.3281" x="0" y="0" />
          <path d="M16.3867 35.9961L16.3867 21.7188C16.3867 18.418 18.4766 16.4258 21.9336 16.4258L35.957 16.4258L35.957 19.5703L21.9727 19.5703C20.4297 19.5703 19.5312 20.4102 19.5312 21.8555L19.5312 35.9961ZM6.13281 35.9766L29.8242 35.9766C33.9258 35.9766 35.957 33.9648 35.957 29.9414L35.957 6.07422C35.957 2.05078 33.9258 0.0195312 29.8242 0.0195312L6.13281 0.0195312C2.05078 0.0195312 0 2.05078 0 6.07422L0 29.9414C0 33.9648 2.05078 35.9766 6.13281 35.9766Z" />
        </g>
      </svg>
    </svg>
  );
};

export default Room;
