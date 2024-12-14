import React from 'react';
import './Button.scss';

const Button = (args) => {
    const finalClassName = 'button ' + (args.inactive ? "button--inactive " : "") + (args.primary ? "button--primary " : "") + (args.className || '')
    return (
        <div className={finalClassName} onClick={args.onClick}>
            <p className='button__label'>{args.label}</p>
        </div>
    );
};

export default Button;
