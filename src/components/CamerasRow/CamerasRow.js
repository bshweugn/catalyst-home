import React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './CamerasRow.scss';

function CamerasRow({ children }) {
    const options = {
        type: 'slide',
        perPage: 1,
        perMove: 1,
        pagination: false,
        arrows: false,
        drag: true,
        snap: true,
        gap: '0.5rem',
        fixedWidth: 'calc(80% - 0rem)',
        padding: { left: '1rem', right: '1rem' },
        flickPower: 300,
    };

    return (
        <div className="cameras-row">
            <Splide options={options}>
                {React.Children.map(children, (child, index) => (
                    <SplideSlide key={index}>
                        {child}
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
}

export default CamerasRow;
