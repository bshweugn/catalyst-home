import React, { useState } from 'react';
import './TabBar.scss';
import Star from '../icons/Star/Star';
import House from '../icons/House/House';
import Play from '../icons/Play/Play';
import Room from '../icons/Room/Room';
import VideoIcon from '../icons/VideoIcon/VideoIcon';

const TabBar = (args) => {
    const finalClassName = 'tab-bar ' + (args.className || '');


    return (
        <div className="tab-bar-wrapper">
            <div className={finalClassName}>
                <div className={`tab-bar__pair ${args.activeTab === 0 ? "tab-bar__pair--active" : ""}`} onClick={() => args.setActiveTab(0)}>
                    <div className='tab-bar__icon'>
                        <House size='1.5rem' color="black" />
                    </div>
                    <p className='tab-bar__label'>Мой дом</p>
                </div>
                <div className={`tab-bar__pair ${args.activeTab === 1 ? "tab-bar__pair--active" : ""}`} onClick={() => args.setActiveTab(1)}>
                    <div className='tab-bar__icon'>
                        <VideoIcon size='1.5rem' color="black" />
                    </div>
                    <p className='tab-bar__label'>Камеры</p>
                </div>
                <div className={`tab-bar__pair ${args.activeTab === 2 ? "tab-bar__pair--active" : ""}`} onClick={() => args.setActiveTab(2)}>
                    <div className='tab-bar__icon'>
                        <Play size='1.5rem' color="black" />
                    </div>
                    <p className='tab-bar__label'>Автоматизации</p>
                </div>
            </div>
            <div className="gradient-blur">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default TabBar;
