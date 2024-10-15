import React, { useEffect, useRef, useState } from 'react';
import './ItemCard.scss';
import Minimize from '../icons/Minimize/Minimize';
import Maximize from '../icons/Maximize/Maximize';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons } from '@ionic/react';

const ItemCard = ({ device, editMode, opened, presentingElement, children, idFunc }) => {
    const [maximized, setMaximized] = useState(false);
    const [shakeClass, setShakeClass] = useState('');
    const [active, setActive] = useState(device.active);
    const modalRef = useRef(null);
    const pageRef = useRef(null);


    const hapticsImpactLight = async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
    };

    const hapticsImpactMedium = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    const handleActionClick = async () => {
        if (!device.apiEndpoint) return;

        try {
            const response = await fetch(device.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: device.id, newStatus: !active })
            });

            if (response.ok) {
                setActive(!active);
                hapticsImpactMedium();
            } else {
                console.error('Failed to update device status');
            }
        } catch (error) {
            console.error('Error occurred while updating device status:', error);
        }
    };

    const handleCardClick = () => {
        if (!editMode) {
            idFunc(device.id)
            hapticsImpactLight();
        }
    };

    const finalClassName = `item-card ${shakeClass} ${opened ? "item-card--opened" : ""} ${maximized ? "item-card--maximized" : ""} ${active ? "item-card--active" : ""}`;

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

    const renderDeviceIcon = () => {
        if (device.currentTemp !== undefined) {
            return <p className={`item-card__temp ${maximized ? 'item-card__temp--huge' : ''}`}>{device.currentTemp}°</p>
        } else {
            return <device.icon size="1.6rem" fill={device.color} />
        }
    };

    const renderDeviceStatus = () => {
        if (device.type === 'LAMP') {
            if (device.dimmable) {
                return device.dim > 0 ? `${device.dim}%` : "Выкл.";
            } else {
                return device.status === 'ON' ? "Вкл." : "Выкл.";
            }
        }
        if (device.type === 'THERMOSTAT') {
            return device.status === 'HEATING' ? `Подогрев до ${device.targetTemp}°` : device.status === 'HOLD' ? `Поддержание` : `Охлаждение до ${device.targetTemp}°`;
        }
    };

    return (
        <>
            <div className={finalClassName} onClick={handleCardClick}>
                <div className={`item-card__max-btn`} onClick={(e) => { e.stopPropagation(); setMaximized(!maximized); }}>
                    {maximized ? (
                        <Minimize className="item-card__btn-arrows" size="0.875rem" fill='black' />
                    ) : (
                        <Maximize className="item-card__btn-arrows" size="0.875rem" fill='black' />
                    )}
                </div>

                {device.actionEnabled && (
                    <div className='item-card__action-btn' onClick={(e) => { e.stopPropagation(); handleActionClick(); }}>
                        <device.actionIcon size="1rem" fill={!active ? "white" : "black"} />
                    </div>
                )}

                <div className='item-card__item-icon'>
                    {renderDeviceIcon()}
                </div>
                <div className='item-card__item-info'>
                    <p className='item-card__item-name'>{device.name}</p>
                    <p className='item-card__item-status'>{renderDeviceStatus()}</p>
                </div>
            </div>
        </>
    );
};

export default ItemCard;
