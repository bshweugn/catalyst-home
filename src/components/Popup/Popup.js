import React, { useEffect, useRef, useState } from 'react';
import './Popup.scss';
import Close from '../icons/Close/Close';

const Popup = (args) => {
    const [contentHeight, setContentHeight] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [opacity, setOpacity] = useState(1); // Управление прозрачностью
    const [currentChildren, setCurrentChildren] = useState(args.children); // Текущие дети
    const [currentTitle, setCurrentTitle] = useState(args.title); // Текущий заголовок
    const [currentLabel, setCurrentLabel] = useState(args.label); // Текущее описание
    const [isInitialRender, setIsInitialRender] = useState(true); // Флаг первого рендера
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.offsetHeight);
        }

        if(!args.visible) setIsInitialRender(true);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [args.visible, currentChildren]);

    useEffect(() => {
        if (args.visible && !isInitialRender) {
            console.log(isInitialRender)
            if (
                args.children !== currentChildren || 
                args.title !== currentTitle || 
                args.label !== currentLabel
            ) {
                setOpacity(0);

                const timeout = setTimeout(() => {
                    setCurrentChildren(args.children);
                    setCurrentTitle(args.title);
                    setCurrentLabel(args.label);
                    setOpacity(1);
                }, 300);

                return () => clearTimeout(timeout);
            }
        } else if (args.visible && isInitialRender) {
            setCurrentChildren(args.children);
            setCurrentTitle(args.title);
            setCurrentLabel(args.label);
            setOpacity(1);
            setIsInitialRender(false);
        }
    }, [args.children, args.title, args.label, args.visible]);

    const handleResize = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        const keyboardHeight = documentHeight - windowHeight;

        setKeyboardHeight(keyboardHeight > 0 ? keyboardHeight : 0);
        setKeyboardHeight(() => keyboardHeight - 32);
    };

    const finalClassName = 'popup ' + (args.visible ? "" : "popup--hidden ") + (args.className || '');

    return (
        <div className={finalClassName}>
            <div 
                className="popup__window" 
                style={{ height: `${contentHeight + 64 + 16 + 32}px`, bottom: `${keyboardHeight}px` }}
            >
                <div className='popup__close-btn' onClick={() => {args.func(false); setIsInitialRender(true)}}>
                    <Close size="0.6rem" fill={"gray"} />
                </div>
                <div 
                    ref={contentRef} 
                    style={{ opacity: opacity, transition: 'opacity 0.3s ease-in-out' }}
                >
                    <h2 className="popup__title">{currentTitle}</h2>
                    <p className="popup__label">{currentLabel}</p>

                    {currentChildren}
                </div>
            </div>
        </div>
    );
};

export default Popup;
