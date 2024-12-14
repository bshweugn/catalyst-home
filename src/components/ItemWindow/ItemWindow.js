import React, { useState, useEffect, useRef } from 'react';
import './ItemWindow.scss';
import VerticalSlider from '../VerticalSlider/VerticalSlider';
import HueSelector from '../HueSelector/HueSelector';
import HorizontalSelector from '../HorizontalSelector/HorizontalSelector';
import ActionButton from '../ActionButton/ActionButton';
import Sun from '../icons/Sun/Sun';
import Power from '../icons/Power/Power';
import { useDispatch } from 'react-redux';
import { setFav, setThermostatTemp, toggleDeviceStatus } from '../../store';
import { renderItemIcon, renderItemStatus } from '../../itemInfo';
import TextInput from '../TextInput/TextInput';
import StarOutline from '../icons/StarOutline/StarOutline';
import Star from '../icons/Star/Star';
import TempIndicator from '../TempIndicator/TempIndicator';
import Gear from '../icons/Gear/Gear';
import ItemSettings from '../ItemSettings/ItemSettings';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import DeskLamp from '../icons/DeskLamp/DeskLamp';
import CeilingLamp from '../icons/CeilingLamp/CeilingLamp';



const ItemWindow = (args) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [icons, setIcons] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(<Lightbulb />);

    const dispatch = useDispatch();

    const handleContentClick = (event) => {
        if (event.target === event.currentTarget) {
            args.idFunc(0);
        }
    };

    useEffect(() => {
        if (args.device.type === 'LAMP') {
            setIcons([<Lightbulb />, <DeskLamp />, <CeilingLamp />]);
        }
    }, [args.device.type]);

    const renderDeviceControls = () => {
        if (args.device.type === 'LAMP') {
            if (args.device.dimmable) {
                return (
                    <>
                        <VerticalSlider sliderIcon={Sun} color={args.device.color} />
                        <HueSelector setColorFunc={args.setColor} colors={["#74B9FF", "#B4D9FF", "#DEEEFF", "#FFFFFF", "#FFE8D6", "#FFD8B9", "#FFB073"]} color={"#74B9FF"} setColor={() => {}} /> // TODO: fix
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
                    <TempIndicator temp={args.device.currentTemp} />
                    <HorizontalSelector values={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} append={"°"} selectedValue={20} setValue={() => {}} id={0} /> // TODO: fix
                    <ActionButton active={args.device.status === 'HEATING'} icon={Power} labels={["Вкл.", "Выкл."]} />
                </>
            );
        }

        if (args.device.type === 'VALVE') {
            return (
                <>
                    <ActionButton active={args.device.status === 'OPENED'} icon={Power} labels={["Открыто", "Закрыто"]} />
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
    const [isFav, setIsFav] = useState(args.device.favourite);
    const statusRef = useRef(null);

    const handleFavChange = (dID, fav) => {
        dispatch(setFav({ id: dID, favourite: fav }));
    };

    useEffect(() => {
        handleFavChange(args.device.id, isFav);
    }, [isFav])

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
            <ItemSettings rooms={Object.values(args.rooms).map(room => room.name)} room={args.rooms[("id" + args.device.roomID)].name} name={args.device.name} visible={settingsVisible} visibilityFunc={setSettingsVisible} icons={icons} selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon}/>
            <div className='item-window__back' />
            <div className={`item-window__header ${settingsVisible ? "item-window__header--hidden" : ""}`}>
                <div className='item-window__item-icon'>
                    {renderItemIcon(args.device)}
                </div>
                <p className='item-window__header-title'>{args.device.name}</p>
                <p className='item-window__close-btn' onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div onClick={handleContentClick} className={`item-window__content ${settingsVisible ? "item-window__content--hidden" : ""}`}>
                <div className='item-window__item-info' onClick={handleContentClick}>
                    <p className='item-window__item-name'>{args.device.name}</p>
                    <p className='item-window__room-name'>{args.rooms[("id" + args.device.roomID)].name}</p>
                    <div className='item-window__item-status' style={{ width: statusWidth }}>
                        <p ref={statusRef} className={isFading ? 'fading' : ''}>{deviceStatus}</p>
                    </div>
                </div>
                <div className='item-window__content-wrapper' onClick={handleContentClick}>
                    {renderDeviceControls()}
                </div>
            </div>
            <div className={`item-window__toolbar ${settingsVisible ? "item-window__toolbar--hidden" : ""}`}>
                <div className='item-window__tool-btn item-window__tool-btn--circle' onClick={() => {setIsFav(!isFav); Haptics.impact({ style: ImpactStyle.Light });}}>
                    {isFav ? <Star size="1.2rem" color="white" /> : <StarOutline size="1.2rem" color="white" />}
                </div>
                <div className='item-window__tool-btn'>
                    <p className='item-window__tool-btn-label' onClick={() => {setSettingsVisible(true); Haptics.impact({ style: ImpactStyle.Light });}}>Параметры</p>
                    {/* <Gear size="1.2rem" color="white" /> */}
                </div>
            </div>
        </div>
    );
};

export default ItemWindow;
