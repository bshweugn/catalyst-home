import React, { useEffect, useRef, useState } from 'react';

const VisibilityWrapper = ({ defaultState, visible = defaultState, children }) => {
    const [height, setHeight] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(visible ? contentHeight : 0);
            setOpacity(visible ? 1 : 0);
        }
    }, [visible]);

    return (
        <div
            style={{
                transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                opacity: opacity,
                transformOrigin: 'top',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                width: '100%'
            }}
        >
            <div ref={contentRef}>
                {children}
            </div>
        </div>
    );
};

export default VisibilityWrapper;
