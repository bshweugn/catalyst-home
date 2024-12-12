import React, { useEffect, useRef, useState } from 'react';
import './Popup.scss';
import Close from '../icons/Close/Close';

const Popup = (args) => {
    const [contentHeight, setContentHeight] = useState(0);
    const [previousContentHeight, setPreviousContentHeight] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [currentChildren, setCurrentChildren] = useState(args.children);
    const [currentTitle, setCurrentTitle] = useState(args.title);
    const [currentLabel, setCurrentLabel] = useState(args.label);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [prevFullscreen, setPrevFullscreen] = useState(false);
    const [fullscreenChanged, setFullscreenChanged] = useState(false);
    const [inProgress, setInProgress] = useState(false);

    const contentRef = useRef(null);

    const handleContentClick = (event) => {
        if (event.target === event.currentTarget) {
            args.func(false);
            setIsInitialRender(true);
        }
    };

    const update = () => {
        if (args.visible && !isInitialRender) {
            const shouldAnimate = args.animation;

            if (shouldAnimate) {
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
            } else {
                setCurrentChildren(args.children);
                setCurrentTitle(args.title);
                setCurrentLabel(args.label);
            }
        } else if (args.visible && isInitialRender) {
            setCurrentChildren(args.children);
            setCurrentTitle(args.title);
            setCurrentLabel(args.label);
            setOpacity(1);
            setIsInitialRender(false);

        }
    };

    useEffect(() => {
        if (contentRef.current && !inProgress) {
            const height = contentRef.current.offsetHeight;
            setPreviousContentHeight(contentHeight);
            setContentHeight(height);
        }

        if (!args.visible) setIsInitialRender(true);
        update();
        
    }, [args.visible, args.children, currentChildren, args.title, args.label, args.fullscreen]);


    useEffect(() => {
        if (prevFullscreen !== args.fullscreen) {
            setFullscreenChanged(true);
        } else {
            setFullscreenChanged(false);
        }

        // console.log("FS " + fullscreenChanged)

        setPrevFullscreen(args.fullscreen);
    }, [args.fullscreen]);


    const handleResize = () => {
        if (!args.fullscreen) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.clientHeight;
            const keyboardHeight = documentHeight - windowHeight;

            setKeyboardHeight(keyboardHeight > 0 ? keyboardHeight : 0);
            setKeyboardHeight(() => keyboardHeight - 32);
        } else {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.clientHeight;
            const keyboardHeight = documentHeight - windowHeight;

            setKeyboardHeight(keyboardHeight > 0 ? keyboardHeight : 0);
            setKeyboardHeight(() => keyboardHeight);
        }
    };

    const finalClassName = 'popup ' + (args.visible ? "" : "popup--hidden ") + (args.className || '');

    return (
        <div className={finalClassName} onClick={handleContentClick}>
            <div
                className={`popup__window ${args.fullscreen ? "popup__window--fullscreen" : ""}`}
                style={{ height: `${contentHeight + 64 + 32}px`, bottom: `${keyboardHeight}px` }}
            >
                <div className='popup__close-btn' onClick={() => { args.func(false); setIsInitialRender(true); setPreviousContentHeight(contentHeight) }}>
                    <Close size="0.6rem" fill={"gray"} />
                </div>
                <div
                    ref={contentRef}
                    style={{ opacity: opacity, transition: 'opacity 0.3s ease-in-out' }}
                >
                    <h2 className={`popup__title ${args.smallTitle ? "popup__title--small" : ""}`}>{currentTitle}</h2>
                    <p className="popup__label">{currentLabel}</p>

                    {currentChildren}
                </div>
            </div>
        </div>
    );
};

export default Popup;