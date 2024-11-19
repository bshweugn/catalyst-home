import React from 'react';
import './TempIndicator.scss';

const TempIndicator = (args) => {
    const finalClassName = 'temp-indicator ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <p className='temp-indicator__temp'>{args.temp}°</p>
        </div>
    );
};

export default TempIndicator;
