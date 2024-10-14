import React from 'react';
import './Icon.scss';

const Icon = ({ className, icon, size = 24, fill = 'currentColor' }) => {
    const iconStyle = {
      width: `${size}px`,
      height: `${size}px`,
      fill: fill,
    };

    const finalClassName = 'icon ' + (className || '')
  
    return (
      <div style={iconStyle} className={finalClassName}>
        <img src={icon} alt="icon" style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };

export default Icon;
