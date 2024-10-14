import React from 'react';
import './Row.scss';

const Row = (args) => {
    const finalClassName = 'row ' + (args.className || '')
    return (
        <div className={finalClassName}>
            {args.children}
        </div>
    );
};

export default Row;
