import React, { useState, useRef, useEffect } from 'react';
import './BtnCard.scss';

const BtnCard = ({ shouldClose, ...args }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [cardPosition, setCardPosition] = useState({});
    const [contentVisible, setContentVisible] = useState(false); // Добавлено для управления прозрачностью
    const cardRef = useRef(null);

    const handleClick = () => {
        const rect = cardRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Сохраняем позицию карточки с учётом скролла
        setCardPosition({
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height,
        });

        setIsExpanded(true);
        setTimeout(() => setContentVisible(true, 0)); // Показываем контент через 0.4 секунды после открытия
    };

    const handleClose = () => {
        setContentVisible(false); // Прозрачность контента на этапе закрытия
        setIsClosing(true);
        setTimeout(() => {
            setIsExpanded(false);
            setIsClosing(false);
        }, 500);
    };

    useEffect(() => {
        if (shouldClose) {
            handleClose();
        }
    }, [shouldClose]);

    return (
        <>
            <div 
                ref={cardRef} 
                onClick={() => { args.onClick(args.index); handleClick(); }} 
                className={`btn-card ${args.className || ''} ${isExpanded ? "btn-card--transparent" : ''} ${isExpanded && !isClosing ? "btn-card--invisible-content" : ''} ${isClosing ? 'btn-card--closing' : ''} ${args.hidden ? "btn-card--hidden" : ''}`}
            >
                <args.icon className="btn-card__icon" size="2.5rem" color="white" />
                <div className="btn-card__text">
                    <p className='btn-card__title'>{args.title}</p>
                    <p className='btn-card__label'>{args.label}</p>
                </div>
                {args.children}
            </div>

            {isExpanded && (
                <div
                    className={`btn-card__expanded ${isClosing ? 'btn-card__closing' : ''}`}
                    style={{
                        position: 'absolute',
                        top: cardPosition.top - 128,
                        left: cardPosition.left,
                        width: cardPosition.width,
                        height: cardPosition.height,
                        transition: (isClosing ? '0.4s cubic-bezier(0.27, -0.01, 0.01, 1.12), opacity 0.2s' : '0.4s cubic-bezier(0.27, -0.01, 0, 1.18), opacity 0.2s'),
                    }}
                    ref={(expandedCard) => {
                        if (expandedCard && !isClosing) {
                            setTimeout(() => {
                                expandedCard.style.top = '0';
                                expandedCard.style.left = '0';
                                expandedCard.style.width = '100%';
                                expandedCard.style.height = '100%';
                                expandedCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                            }, 0);
                        } else if (expandedCard && isClosing) {
                            expandedCard.style.top = `${cardPosition.top - 126}px`;
                            expandedCard.style.left = `${cardPosition.left}px`;
                            expandedCard.style.width = `${cardPosition.width}px`;
                            expandedCard.style.height = `${cardPosition.height}px`;
                            expandedCard.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        }
                    }}
                >
                    <div 
                        className={`btn-card__expanded-content ${contentVisible ? 'visible' : 'hidden'}`} 
                        style={{ transition: 'opacity 0.3s ease', opacity: contentVisible ? 1 : 0 }}
                    >
                        {args.content}
                    </div>
                </div>
            )}
        </>
    );
};

export default BtnCard;
