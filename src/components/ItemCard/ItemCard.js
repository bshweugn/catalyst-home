import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './ItemCard.scss';
import Minimize from '../icons/Minimize/Minimize';
import Maximize from '../icons/Maximize/Maximize';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import Power from '../icons/Power/Power';
import { renderItemIcon, renderItemStatus } from '../../itemInfo';

const ItemCard = ({ device, index, moveCard, editMode, opened, idFunc }) => {
    const [maximized, setMaximized] = useState(false);
    const [shakeClass, setShakeClass] = useState('');
    const [active, setActive] = useState(device.active);
    const [isHolding, setIsHolding] = useState(false);
    const [isHeld, setIsHeld] = useState(false);

    const holdTimeout = useRef(null);

    const [, drop] = useDrop({
        accept: 'item',
        hover(item) {
            if (item.index !== index) {
                moveCard(item.index, index);
                item.index = index;
            }
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'item',
        item: { id: device.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => editMode, // Only allow dragging if editMode is true
    });

    const opacity = isDragging ? 0.5 : 1; // Set opacity to 0.5 when dragging

    useEffect(() => {
        let timeoutId;
        if (editMode) {
            const delay = Math.random() * 100;
            timeoutId = setTimeout(() => {
                setShakeClass('item-card--edit-mode');
            }, delay);
        } else {
            setShakeClass('');
        }

        return () => clearTimeout(timeoutId);
    }, [editMode]);

    const handleCardClick = () => {
        if (!editMode && !isHolding) {
            console.log(editMode, isHolding)
            idFunc(device.id);
            hapticsImpactLight();
        }
    };

    const hapticsImpactLight = async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
    };

    const hapticsImpactMedium = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    const startHold = (e) => {
        setIsHolding(true);
        holdTimeout.current = setTimeout(() => {
            setIsHolding(true);
            setIsHeld(true);
            hapticsImpactMedium();
        }, 100);
        setIsHolding(true);
    };

    const stopHold = (e) => {
        hapticsImpactMedium();
        e.stopPropagation();
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
        }

        if (isHeld) {
            setActive((prevActive) => !prevActive);
        }

        setIsHeld(false);
        setTimeout(() => setIsHolding(false), 100);
    };

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`item-card ${shakeClass} ${opened ? "item-card--opened" : ""} ${maximized ? "item-card--maximized" : ""} ${active ? "item-card--active" : ""}`}
            style={{ opacity }}
            onClick={handleCardClick}
        >
            <div className="item-card__max-btn" onClick={(e) => { e.stopPropagation(); setMaximized(!maximized); }}>
                {maximized ? <Minimize size="0.875rem" fill='black' /> : <Maximize size="0.875rem" fill='black' />}
            </div>
            {!device.isSensor && (
                <div
                    className='item-card__action-btn'
                    onTouchStart={startHold}
                    onTouchEnd={stopHold}
                >
                    <Power size="1rem" fill={!active ? "white" : "black"} />
                </div>
            )}
            <div className='item-card__item-icon'>
                {renderItemIcon(device)}
            </div>
            <div className='item-card__item-info'>
                <p className='item-card__item-name'>{device.name}</p>
                <p className='item-card__item-status'>{renderItemStatus(device, true)}</p>
            </div>
        </div>
    );
};

export default ItemCard;
