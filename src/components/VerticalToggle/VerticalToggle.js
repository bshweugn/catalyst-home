import React from 'react';
import './VerticalToggle.scss';

const VerticalToggle = (args) => {
    const finalClassName = 'vertical-toggle ' + (args.className || '')
    return (
        <div className={finalClassName}>
        </div>
    );
};

export default VerticalToggle;
