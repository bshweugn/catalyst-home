import React, { useState, useEffect, useRef } from 'react';
import './CameraWindow.scss';
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

const CameraWindow = (args) => {
    const dispatch = useDispatch();

    const renderDeviceControls = () => {
        if (args.camera.xDeg !== null) {
            <div>
                <p>Кручение и верчение</p>
            </div>
        }
    };

    const [isFav, setIsFav] = useState(args.camera.favourite);
    const statusRef = useRef(null);

    const handleFavChange = (dID, fav) => {
        dispatch(setFav({ id: dID, favourite: fav }));
    };

    useEffect(() => {
        handleFavChange(args.camera.id, isFav);
    }, [isFav])


    return (
        <div className={`camera-window ${!args.visible ? "camera-window--hidden" : ""}`}>
            <div className='camera-window__back' />
            <div className='camera-window__header'>
                <div className='camera-window__item-icon'>
                    {renderItemIcon(args.camera)}
                </div>
                <p className='camera-window__header-title'>{args.camera.name}</p>
                <p className='camera-window__close-btn' onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div className='camera-window__content'>
                <div className='camera-window__item-info'>
                    <p className='camera-window__item-name'>{args.camera.name}</p>
                    <p className='camera-window__room-name'>{args.rooms[("id" + args.camera.roomID)].name}</p>
                </div>
                <div className='camera-window__content-wrapper'>
                    {renderDeviceControls()}
                </div>
            </div>
            <div className='camera-window__toolbar'>
                <div className='camera-window__tool-btn camera-window__tool-btn--circle' onClick={() => setIsFav(!isFav)}>
                    {isFav ? <Star size="1.2rem" color="white" /> : <StarOutline size="1.2rem" color="white" />}
                </div>
                <div className='camera-window__tool-btn'>
                    <p className='camera-window__tool-btn-label'>Параметры</p>
                    {/* <Gear size="1.2rem" color="white" /> */}
                </div>
            </div>
        </div>
    );
};

export default CameraWindow;
