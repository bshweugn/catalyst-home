import React, { useState, useRef } from 'react';
import './VerticalSlider.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const VerticalSlider = ({ sliderIcon: SliderIconComponent, color = "gray" }) => {
    const [value, setValue] = useState(50);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        // e.preventDefault();
        // e.stopPropagation();

        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY.current - currentY;

        const containerHeight = containerRef.current.clientHeight;

        setValue((prevValue) => {
            const newValue = Math.min(Math.max(prevValue + (deltaY / containerHeight) * 100, 0), 100);

            if (newValue === 0 || newValue === 100) {
                if (newValue !== prevValue) Haptics.impact({ style: ImpactStyle.Medium });
            }

            return newValue;
        });

        touchStartY.current = currentY;
    };

    return (
        <div className="vertical-slider" ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            <div className="vertical-slider__track">
                {/* <div className="vertical-slider__thumb" style={{ height: `${value}%`, backgroundColor: color }}></div> */}
                <div className="vertical-slider__thumb" style={{ height: `${value}%` }}></div>

            </div>
            <SliderIconComponent className="vertical-slider__icon" size="2.25rem" color="black" />
        </div>
    );
};

export default VerticalSlider;
