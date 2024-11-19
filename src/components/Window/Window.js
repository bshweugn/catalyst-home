import React, { useState } from 'react';
import './Window.scss';
import Back from '../icons/Back/Back';
import BtnCard from '../BtnCard/BtnCard';

const Window = ({ visible, vertical, title, idFunc, cards }) => {
    const [openCardIndex, setOpenCardIndex] = useState(null);

    const handleCardClick = (index) => {
        setOpenCardIndex(index);
    };

    const handleCloseCard = () => {
        setOpenCardIndex(null);
    };

    const handleBack = () => {
        handleCloseCard();
    };

    return (
        <div className={`window ${!visible ? "window--hidden" : ""} ${vertical ? "window--vertical" : ""}`}>
            <div className='window__header'>
                <Back
                    size="1.25rem"
                    className={`window__back-btn${openCardIndex !== null ? " window__back-btn--visible" : ''}`}
                    onClick={handleBack}
                />
                <p className='window__header-title' onClick={() => { openCardIndex !== null && handleCloseCard() }}>
                    {title}
                </p>
                <p className='window__close-btn' onClick={() => { idFunc(0); setTimeout(() => handleBack(), 300); }}>
                    Готово
                </p>
            </div>
            <div className={'window__content' + (openCardIndex !== null ? " window__content--minimized" : '')}>
                <div className='window__content-wrapper'>
                    {cards.map((card, index) => (
                        <BtnCard
                            key={index}
                            index={index}
                            hidden={openCardIndex !== index && openCardIndex !== null}
                            icon={card.icon}
                            title={card.title}
                            label={card.label}
                            shouldClose={openCardIndex !== index}
                            content={card.content}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Window;
