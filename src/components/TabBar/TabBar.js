import React, { useState } from 'react';
import './TabBar.scss';
import Star from '../icons/Star/Star';
import House from '../icons/House/House';
import Play from '../icons/Play/Play';

const TabBar = (args) => {
    const finalClassName = 'tab-bar ' + (args.className || '');

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tab-bar-wrapper">
            <div className={finalClassName}>
                <div className={`tab-bar__pair ${activeTab === 0 ? "tab-bar__pair--active" : ""}`} onClick={() => setActiveTab(0)}>
                    <div className='tab-bar__icon'>
                        <House size='1.5rem' color="white" />
                    </div>
                    <p className='tab-bar__label'>Мой дом</p>
                </div>
                <div className={`tab-bar__pair ${activeTab === 1 ? "tab-bar__pair--active" : ""}`} onClick={() => setActiveTab(1)}>
                    <div className='tab-bar__icon'>
                        <Star size='1.5rem' color="white" />
                    </div>
                    <p className='tab-bar__label'>Избранное</p>
                </div>
                <div className={`tab-bar__pair ${activeTab === 2 ? "tab-bar__pair--active" : ""}`} onClick={() => setActiveTab(2)}>
                    <div className='tab-bar__icon'>
                        <Play size='1.5rem' color="white" />
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
