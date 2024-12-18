import React from 'react';
import './SimpleLabel.scss';

const SimpleLabel = (args) => {
    const finalClassName = 'simple-label ' + (args.className || '')
    return (
        <div className={finalClassName}>
            {args.children}
        </div>
    );
};

export default SimpleLabel;
