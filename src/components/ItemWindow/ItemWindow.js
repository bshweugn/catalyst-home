import React, { useState, useEffect, useRef } from 'react';
import './ItemWindow.scss';
import VerticalSlider from '../VerticalSlider/VerticalSlider';
import HueSelector from '../HueSelector/HueSelector';
import HorizontalSelector from '../HorizontalSelector/HorizontalSelector';
import ActionButton from '../ActionButton/ActionButton';
import Sun from '../icons/Sun/Sun';
import Power from '../icons/Power/Power';
import { useDispatch } from 'react-redux';
import { setThermostatTemp, toggleDeviceStatus } from '../../store';
import { renderItemIcon, renderItemStatus } from '../../itemInfo';
import TextInput from '../TextInput/TextInput';

const ItemWindow = (args) => {
    const dispatch = useDispatch();

    const handleToggle = (dID) => {
        dispatch(toggleDeviceStatus({ id: dID }));
    };

    const handleTempChange = (dID, temp) => {
        dispatch(setThermostatTemp({ id: dID, temp: temp }));
    };

    const renderDeviceControls = () => {
        if (args.device.type === 'LAMP') {
            if (args.device.dimmable) {
                return (
                    <>
                        <VerticalSlider sliderIcon={Sun} color={args.device.color} />
                        <HueSelector setColorFunc={args.setColor} colors={["#74B9FF", "#B4D9FF", "#DEEEFF", "#FFFFFF", "#FFE8D6", "#FFD8B9", "#FFB073"]} color={args.device.color} setColor={(newColor) => handleTempChange(args.device.id, newColor)} />
                    </>
                );
            } else {
                return (
                    <>
                        <VerticalSlider sliderIcon={Sun} color={args.device.color} />
                    </>
                );
            }
        }

        if (args.device.type === 'THERMOSTAT') {
            return (
                <>
                    <HorizontalSelector values={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} append={"°"} selectedValue={args.device.targetTemp} setValue={(newTemp) => handleTempChange(args.device.id, newTemp)} id={args.device.id} />
                    <ActionButton active={args.device.status === 'HEATING'} icon={Power} labels={["Вкл.", "Выкл."]} />
                </>
            );
        }

        if (args.device.isSensor) {
            return (
                <>
                    {/* <TextInput value="Имя" label="Имя сенсора"/> */}
                </>
            );
        }
    };

    const [deviceStatus, setDeviceStatus] = useState(renderItemStatus(args.device));
    const [statusWidth, setStatusWidth] = useState('auto');
    const [isFading, setIsFading] = useState(false);
    const statusRef = useRef(null);

    const updateStatusWidth = () => {
        const currentWidth = statusRef.current?.offsetWidth || 0;
        setStatusWidth(currentWidth + 32);
    };

    useEffect(() => {
        const newStatus = renderItemStatus(args.device);
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
    }, [args.device.status, args.device.dim, args.device.targetTemp]);

    useEffect(() => {
        requestAnimationFrame(() => {
            updateStatusWidth();
        });
    }, []);

    return (
        <div className={`item-window ${!args.visible ? "item-window--hidden" : ""} ${args.device.type === 'THERMOSTAT' ? "item-window--vertical" : ""}`}>
            <div className='item-window__back' />
            <div className='item-window__header'>
                <div className='item-window__item-icon'>
                    {renderItemIcon(args.device)}
                </div>
                <p className='item-window__header-title'>{args.device.name}</p>
                <p className='item-window__close-btn' onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div className='item-window__content'>
                <div className='item-window__item-info'>
                    <p className='item-window__item-name'>{args.device.name}</p>
                    <p className='item-window__room-name'>{args.rooms[("id" + args.device.roomID)].name}</p>
                    <div className='item-window__item-status' style={{ width: statusWidth }}>
                        <p ref={statusRef} className={isFading ? 'fading' : ''}>{deviceStatus}</p>
                    </div>
                </div>
                <div className='item-window__content-wrapper'>
                    {renderDeviceControls()}
                </div>
            </div>
        </div>
    );
};

export default ItemWindow;
