import React from 'react';
import './MainWidget.scss';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';


const MainWidget = (args) => {
    const finalClassName = 'main-widget ' + (args.className || '')
    return (
            <div className={finalClassName}>
                {/* <div className='main-widget__head'>
                    <p className='main-widget__title'>{args.title}</p>
                    <p className='main-widget__badge'>{args.badge}</p>
                </div> */}
                {args.children}
            </div>
    );
};

export default MainWidget;
