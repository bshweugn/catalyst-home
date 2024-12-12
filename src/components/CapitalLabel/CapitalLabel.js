import React from 'react';
import './CapitalLabel.scss';

const CapitalLabel = (args) => {
    const finalClassName = 'capital-label ' + (args.className || '')
    return (
        <p className={finalClassName}>{args.label}</p>
    );
};

export default CapitalLabel;
