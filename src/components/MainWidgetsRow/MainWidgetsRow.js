import React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './MainWidgetsRow.scss';

function MainWidgetsRow({ children }) {
    const options = {
        type: 'slide',
        perPage: 1,
        perMove: 1,
        pagination: false,
        arrows: false,
        drag: true,
        snap: true,
        gap: '0.5rem',
        fixedWidth: '100%',
        padding: { left: '1rem', right: '1rem' }
    };

    return (
        <div className="main-widgets-row">
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

export default MainWidgetsRow;
