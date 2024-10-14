import React from 'react';
import './TempStatus.scss';

const TempStatus = (args) => {
    const finalClassName = 'temp-status ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className='temp-status__pair'>
                <p className='temp-status__temp'>{args.temp}°</p>
                <div className='temp-status__triangle'/>
            </div>
            <p className='temp-status__name'>{args.name}</p>
            <p className='temp-status__status'>{args.status}</p>
        </div>
    );
};

export default TempStatus;
