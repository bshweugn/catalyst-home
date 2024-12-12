import React, { useEffect, useState } from 'react';
import './Sheet.scss';
import Popup from '../Popup/Popup';

const Sheet = (args) => {
    const [view, setView] = useState("default");
    const [fullscreenRequired, setFullscreenRequired] = useState(true);
    const [shouldAnimate, setSholudAnimate] = useState(false);

    const handleClose = () => {
        args.func(false);
    };

    const animate = () => {
        setSholudAnimate(true);
        setTimeout(() => setSholudAnimate(false), 400);
    };


    return (
        <Popup
            animation={shouldAnimate}
            fullscreen={fullscreenRequired}
            className={`add-accessory-popup ${args.className || ''}`}
            visible={args.visible}
            func={handleClose}
            title={args.title}
            smallTitle
        >
            {args.children}
        </Popup >
    );
};

export default Sheet;
