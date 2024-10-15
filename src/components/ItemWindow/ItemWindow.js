import React, { useState, useEffect, useRef } from 'react';
import './ItemWindow.scss';

const ItemWindow = (args) => {
    const renderDeviceStatus = () => {
        if (args.device.type === 'LAMP') {
            if (args.device.dimmable) {
                return args.device.dim > 0 ? `${args.device.dim}%` : "Выкл.";
            } else {
                return args.device.status === 'ON' ? "Вкл." : "Выкл.";
            }
        }
        if (args.device.type === 'THERMOSTAT') {
            return args.device.status === 'HEATING' ? `Подогрев до ${args.device.targetTemp}°` : args.device.status === 'HOLD' ? `Поддержание температуры` : `Охлаждение до ${args.device.targetTemp}°`;
        }
    };

    const [deviceStatus, setDeviceStatus] = useState(renderDeviceStatus());
    const [statusWidth, setStatusWidth] = useState('auto');
    const [isFading, setIsFading] = useState(false);

    const statusRef = useRef(null);

    const renderDeviceIcon = () => {
        if (args.device.currentTemp !== undefined) {
            return <p className='item-card__temp'>{args.device.currentTemp}°</p>;
        } else {
            return <args.device.icon size="1.6rem" fill={args.device.color} />;
        }
    };

    const updateStatusWidth = () => {
        const currentWidth = statusRef.current?.offsetWidth || 0;
        setStatusWidth(currentWidth + 32); // Добавляем дополнительные 32px для отступов
    };

    useEffect(() => {
        const newStatus = renderDeviceStatus();

        if (newStatus !== deviceStatus) {
            setIsFading(true);

            setTimeout(() => {
                setDeviceStatus(newStatus);

                requestAnimationFrame(() => {
                    updateStatusWidth();
                    setIsFading(false);
                });
            }, 300);
        }
    }, [args.visible, args.device.status, args.device.dim, args.device.targetTemp]);

    useEffect(() => {
        requestAnimationFrame(() => {
            updateStatusWidth();
        });
    }, []);

    return (
        <div className={`item-window ${!args.visible ? "item-window--hidden" : ""} ${args.vertical ? "item-window--vertical" : ""}`}>
            <div className='item-window__back' />
            <div className='item-window__header'>
                <div className='item-window__item-icon'>
                    {renderDeviceIcon()}
                </div>
                <p className='item-window__header-title'>{args.device.name}</p>
                <p className='item-window__close-btn' onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div className='item-window__content'>
                <div className='item-window__item-info'>
                    <p className='item-window__item-name'>{args.device.name}</p>
                    <p className='item-window__room-name'>{args.device.roomName}</p>
                    <div className='item-window__item-status' style={{ width: statusWidth }}>
                        <p ref={statusRef} className={isFading ? 'fading' : ''}>{deviceStatus}</p>
                    </div>
                </div>
                <div className='item-window__content-wrapper'>
                    {args.children}
                </div>
            </div>
        </div>
    );
};

export default ItemWindow;
