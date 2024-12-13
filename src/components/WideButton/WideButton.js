import React from 'react';
import './WideButton.scss';

const WideButton = (args) => {
    const finalClassName = 'wide-button ' + (args.red ? "wide-button--red " : "") + (args.separated ? "wide-button--separated " : "") + (args.light ? "wide-button--light " : "") + (args.className || '')
    return (
        <p className={finalClassName} onClick={args.onClick}>
            {args.label}
        </p>
    );
};

export default WideButton;
