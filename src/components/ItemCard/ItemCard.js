import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './ItemCard.scss';
import Minimize from '../icons/Minimize/Minimize';
import Maximize from '../icons/Maximize/Maximize';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import Power from '../icons/Power/Power';
import { isSensor, renderItemIcon, renderItemStatus } from '../../itemInfo';
import Checkmark from '../icons/Checkmark/Checkmark';
import ConditionWindow from '../ConditionWindow/ConditionWindow';
import SuperEllipse from 'react-superellipse';

const ItemCard = ({ device, index, moveCard, editMode, opened, idFunc, preview, selectable, setter, selectedList, conditionWindow, setCondition, canSave, atomicSelected }) => {
    const [maximized, setMaximized] = useState(false);
    const [shakeClass, setShakeClass] = useState('');
    const [active, setActive] = useState(device.active);
    const [isHolding, setIsHolding] = useState(false);
    const [isHeld, setIsHeld] = useState(false);

    const [selected, setSelected] = useState(false);


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
        canDrag: () => editMode,
    });

    const opacity = isDragging ? 0.5 : 1;

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

    useEffect(() => {
        if (selectedList && selectedList.includes(device.id)) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [selectedList, device.id]);

    const handleCardClick = () => {
        const addDevice = (deviceId) => {
            setter((prevDevices) => {
                if (!prevDevices.includes(deviceId)) {
                    return [...prevDevices, deviceId];
                }
                return prevDevices;
            });
        };

        const removeDevice = (deviceId) => {
            setter((prevDevices) => {
                return prevDevices.filter((id) => id !== deviceId);
            });
        };

        if (!editMode && !isHolding) {
            console.log(editMode, isHolding)
            if (!selectable) {
                idFunc(device.id);
            } else {
                if (!selected) {
                    addDevice(device.id);
                    setSelected(true);
                    console.log("add");
                } else {
                    removeDevice(device.id);
                    setSelected(false);
                    console.log("remove");
                }
                console.log(selectedList);
            }
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
        <>
            {conditionWindow ?
                <ConditionWindow func={() => idFunc(0)} visible={opened && conditionWindow} icon={renderItemIcon(device, true)} name={device.name} canSave={canSave}>
                    {conditionWindow(device, setCondition)}
                </ConditionWindow>
                :
                <></>}
            <div
                ref={(node) => drag(drop(node))}
                className={`item-card ${shakeClass} ${opened ? "item-card--opened" : ""} ${maximized ? "item-card--maximized" : ""} ${active ? "item-card--active" : ""} ${preview ? "item-card--preview" : ""} ${selected || atomicSelected ? "item-card--selected" : ""}`}
                style={{ opacity }}
                onClick={handleCardClick}
            >
                {/* <SuperEllipse
                    r1={0.07}
                    r2={0.2}
                    className={'item-card__background'}
                /> */}
                <div className={`item-card__select-indicator ${selected || atomicSelected ? "item-card__select-indicator--visible" : ""}`}>
                    <Checkmark className='item-card__checkmark' fill="black" size="1rem" />
                </div>
                <div className="item-card__max-btn" onClick={(e) => { e.stopPropagation(); setMaximized(!maximized); }}>
                    {maximized ? <Minimize size="0.875rem" fill='black' /> : <Maximize size="0.875rem" fill='black' />}
                </div>
                {!isSensor(device) && (
                    <div
                        className='item-card__action-btn'
                        onTouchStart={startHold}
                        onTouchEnd={stopHold}
                    >
                        <Power size="1rem" fill={!active ? "white" : "black"} />
                    </div>
                )}
                <div className='item-card__item-icon'>
                    {renderItemIcon(device, true)}
                </div>
                <div className='item-card__item-info'>
                    <p className='item-card__item-name'>{device.name}</p>
                    <p className='item-card__item-status'>{renderItemStatus(device, true)}</p>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
