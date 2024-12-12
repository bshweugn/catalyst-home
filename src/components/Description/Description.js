import React from 'react';
import './Description.scss';

const Description = (args) => {
    const finalClassName = 'description ' + (args.bottomSeparated ? 'description--bottom-separated ' : "") + (args.className || '')
    return (
        <div className={finalClassName}>
            {args.text}
        </div>
    );
};

export default Description;
