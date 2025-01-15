import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './ItemCard.scss';
import Minimize from '../icons/Minimize/Minimize';
import Maximize from '../icons/Maximize/Maximize';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import Power from '../icons/Power/Power';
import { getItemAction, getItemStatus, isSensor, itemColor, renderItemIcon, renderItemStatus } from '../../itemInfo';
import Checkmark from '../icons/Checkmark/Checkmark';
import ConditionWindow from '../ConditionWindow/ConditionWindow';
import SuperEllipse from 'react-superellipse';
import { executeDeviceCommand, getDeviceById } from '../../services/devicesService';
import { fetchHousesData } from '../../services/housesService';

const ItemCard = ({ device, index, moveCard, editMode, opened, idFunc, preview, selectable, setter, selectedList, conditionWindow, setCondition, canSave, atomicSelected, toDelete, token }) => {
    const [minimized, setminimized] = useState(false);
    const [shakeClass, setShakeClass] = useState('');
    const [active, setActive] = useState(getItemStatus(device));
    const [status, setStatus] = useState(renderItemStatus(device, true));
    const [isHolding, setIsHolding] = useState(false);
    const [isHeld, setIsHeld] = useState(false);


    const [selected, setSelected] = useState(false);


    const [toDeleteState, setToDeleteState] = useState(false);

    const holdTimeout = useRef(null);


    useEffect(() => {
        const handleToggle = async () => {
            try {
                const newState = !active;
                let result;

                if (newState) {
                    result = await executeDeviceCommand(token, device.id, getItemAction(device, false), "");

                } else {
                    result = await executeDeviceCommand(token, device.id, getItemAction(device, true), "");
                }

                if (result) {
                    const updatedStatus = getItemStatus(result.data);
                    console.log(updatedStatus !== active)

                    if (updatedStatus !== active) {
                        console.log("LALA")
                        setActive(updatedStatus);

                    }

                    setStatus(renderItemStatus(result.data, true));
                }
            } catch (error) {
                console.error('Ошибка при изменении состояния:', error);
            }
        };

        handleToggle();
    }, [active]);


    useEffect(() => {
        setActive(getItemStatus(device));
    }, []);


    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const result = await fetchHousesData(token);

                if (result) {
                    setStatus(renderItemStatus(getDeviceById(device.id, result), true));
                }
            } catch (error) {
                console.error('Ошибка при получении устройства:', error);
            }
        }

        fetchStatus();
    }, [opened, active]);


    useEffect(() => {
        setTimeout(() => { setToDeleteState(toDelete) }, 700)
    }, [toDelete]);


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


    const getState = (device) => {

    }


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
                className={`item-card ${shakeClass} ${opened ? "item-card--opened" : ""} ${minimized ? "item-card--minimized" : ""} ${active ? "item-card--active" : ""} ${preview ? "item-card--preview" : ""} ${selected || atomicSelected ? "item-card--selected" : ""} ${toDeleteState ? "item-card--to-delete" : ""}`}
                style={{ opacity }}
                onClick={handleCardClick}
            >
                <SuperEllipse
                    r1={!minimized ? 0.05 : 0.1}
                    r2={!minimized ? 0.15 : 0.3}
                    className={`item-card__background ${active ? "item-card__background--active" : ""}`}
                />
                <div className={`item-card__select-indicator ${selected || atomicSelected ? "item-card__select-indicator--visible" : ""}`}>
                    <Checkmark className='item-card__checkmark' fill="black" size="1rem" />
                </div>
                <div className="item-card__max-btn" onClick={(e) => { e.stopPropagation(); setminimized(!minimized); }}>
                    {!minimized ? <Minimize size="0.875rem" fill='black' /> : <Maximize size="0.875rem" fill='black' />}
                </div>
                {/* {!isSensor(device) && (
                    <div
                        className='item-card__action-btn'
                        onTouchStart={startHold}
                        onTouchEnd={stopHold}
                    >
                        <Power size="1rem" fill={!active ? "white" : "black"} />
                    </div>
                )} */}
                <div className={`item-card__item-icon ${!isSensor(device) ? 'item-card__action-btn' : ''}`} onTouchStart={startHold} onTouchEnd={stopHold} style={{ backgroundColor: active ? itemColor(device) : '' }}>
                    {renderItemIcon(device, true)}
                </div>
                <div className='item-card__item-info'>
                    <p className='item-card__item-name'>{device.name}</p>
                    <p className='item-card__item-status'>{status}</p>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
