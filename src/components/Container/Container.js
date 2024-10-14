import React from 'react';
import './Container.scss';

const Container = (args) => {
    const finalClassName = 'container ' + (args.className || '')
    return (
        <div className={finalClassName}>
            {args.children}
        </div>
    );
};

export default Container;
