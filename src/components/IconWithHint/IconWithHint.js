import React from 'react';
import './IconWithHint.scss';

const IconWithHint = (args) => {
    const finalClassName = 'icon-with-hint ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className="icon-with-hint__icon">
                <args.icon size={"1.875rem"} fill="black" />
            </div>
            <div className="icon-with-hint__pair">
                <p className="icon-with-hint__title">{args.title}</p>
                <p className="icon-with-hint__label">{args.label}</p>
            </div>
        </div>
    );
};

export default IconWithHint;
