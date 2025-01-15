import React from 'react';
import './Button.scss';

const Button = (args) => {
    const finalClassName = 'button ' + (args.inactive ? "button--inactive " : "") + (args.primary ? "button--primary " : "") + (args.description ? "button--with-description " : "") + (args.className || '')
    return (
        <div className={finalClassName} onClick={args.onClick}>
            <p className='button__label'>{args.label}</p>
            {args.description ? <p className='button__description'>{args.description}</p> : null}
        </div>
    );
};

export default Button;
