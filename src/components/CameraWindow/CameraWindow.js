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
import { IonSpinner } from '@ionic/react';
import Tap from '../icons/Tap/Tap';
import Back from '../icons/Back/Back';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import CameraSettings from '../CameraSettings/CameraSettings';

const SECONDS_PER_PIXEL = 1;

const CameraWindow = (args) => {
    const dispatch = useDispatch();

    const scrubberWrapperRef = useRef(null);

    const [baseTime, setBaseTime] = useState(() => new Date().getTime());
    const [displayedTime, setDisplayedTime] = useState(baseTime);

    const [moving, setMoving] = useState(false);

    const [delta, setDelta] = useState(0);

    const [isLive, setIsLive] = useState(true);

    const [isScrolling, setIsScrolling] = useState(false);

    const [isManualScroll, setIsManualScroll] = useState(false);

    const [currJoystickZone, setCurrJoystickZone] = useState(-1);

    const [settingsVisible, setSettingsVisible] = useState(false);


    useEffect(() => {
        const timer = setInterval(() => {
            setBaseTime(new Date().getTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Обновляем отображаемое время при изменении baseTime или delta
        const deltaSeconds = delta * SECONDS_PER_PIXEL;
        const newTime = baseTime + deltaSeconds * 1000;
        setDisplayedTime(newTime);
    }, [baseTime, delta, isLive, isManualScroll]);


    useEffect(() => {
        if (scrubberWrapperRef.current) {
            const scrubberWrapper = scrubberWrapperRef.current;
            scrubberWrapper.scrollLeft = scrubberWrapper.scrollWidth;
            startAutoScroll();
        }
    }, []);

    useEffect(() => {
        if (!isLive) {
            Haptics.impact({ style: ImpactStyle.Light });
            startAutoScroll(); // Начинаем прокрутку, если перестали быть LIVE
        }
    }, [isLive]);

    const startAutoScroll = () => {
        if (isScrolling) return; // Предотвращаем дублирование таймера

        setIsScrolling(true);
        const interval = setInterval(() => {
            if (!scrubberWrapperRef.current) return;

            const scrubberWrapper = scrubberWrapperRef.current;
            const scrollLeft = scrubberWrapper.scrollLeft;
            const maxScrollLeft = scrubberWrapper.scrollWidth - scrubberWrapper.clientWidth;

            if (scrollLeft < maxScrollLeft) {
                scrubberWrapper.scrollLeft += 1;
            } else {
                clearInterval(interval); // Останавливаем прокрутку, когда достигнут конец
                setIsScrolling(false);
                setIsLive(true);
            }
        }, 1000);
    };

    const startManualScroll = () => {
        setIsManualScroll(true);
    };

    const stopManualScroll = () => {
        setTimeout(setIsManualScroll(false), 1000);
    };

    const handleScroll = () => {
        if (!scrubberWrapperRef.current) return;

        const scrubberWrapper = scrubberWrapperRef.current;
        const scrollLeft = scrubberWrapper.scrollLeft;
        const maxScrollLeft = scrubberWrapper.scrollWidth - scrubberWrapper.clientWidth;

        if (isManualScroll) {
            const delta = scrollLeft - maxScrollLeft;
            // if(delta % 20 ==  0){
            //     Haptics.impact({ style: ImpactStyle.Light });
            // }
            setDelta(delta);
        }

        setIsLive(scrollLeft >= maxScrollLeft - 1);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ru-RU', { hour12: false });
    };

    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const joystickWrapperRef = useRef(null);

    const handleTouchStart = (event) => {
        Haptics.impact({ style: ImpactStyle.Medium });
        const touch = event.touches[0];
        const rect = joystickWrapperRef.current.getBoundingClientRect();
        setJoystickPosition({
            x: touch.clientX - rect.left - rect.width / 2,
            y: touch.clientY - rect.top - rect.height / 2,
        });
        setMoving(true);
    };

    const handleTouchMove = (event) => {
        const touch = event.touches[0];
        const rect = joystickWrapperRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const touchX = touch.clientX - rect.left - centerX;
        const touchY = touch.clientY - rect.top - centerY;

        setJoystickPosition({
            x: touchX,
            y: touchY,
        });

        const centralSize = 30;
        const halfCentralSize = centralSize / 2;

        let zone;
        if (
            touchX > -halfCentralSize &&
            touchX < halfCentralSize &&
            touchY > -halfCentralSize &&
            touchY < halfCentralSize
        ) {
            zone = -1;
        } else if (Math.abs(touchY) > Math.abs(touchX)) {
            zone = touchY < 0 ? 0 : 1;
        } else {
            zone = touchX < 0 ? 2 : 3;
        }

        setCurrJoystickZone(zone);
    };

    useEffect(() => {
        if (currJoystickZone !== -1) {
            Haptics.impact({ style: ImpactStyle.Light });
        }
    }, [currJoystickZone]);

    const handleTouchEnd = () => {
        setMoving(false);
        setCurrJoystickZone(-1);
        setTimeout(() => setJoystickPosition({ x: 0, y: 0 }), 200);
    };

    const renderDeviceControls = () => {
        return (
            <>
                <div className='camera-window__camera-view'>
                    <IonSpinner color={"light"}></IonSpinner>
                </div>
                {args.camera.xDeg !== null && (
                    <div
                        className={`camera-window__camera-joystick-wrapper ${(!isLive) ? "camera-window__camera-joystick-wrapper--inactive" : ""}`}
                        ref={joystickWrapperRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="camera-window__camera-joystick-inner">
                            <div className={`camera-window__camera-joystick-arrows-pair ${moving ? 'camera-window__camera-joystick-arrows-pair--moving' : ''}`}>
                                <Back fill="white" size="0.875rem" className={`camera-window__camera-joystick-arrow ${currJoystickZone == 2 ? 'camera-window__camera-joystick-arrow--current' : ''}`} />
                                <Back fill="white" size="0.875rem" className={`camera-window__camera-joystick-arrow camera-window__camera-joystick-arrow--second ${currJoystickZone == 3 ? 'camera-window__camera-joystick-arrow--current' : ''}`} />
                            </div>
                            <div className={`camera-window__camera-joystick-arrows-pair camera-window__camera-joystick-arrows-pair--second ${moving ? 'camera-window__camera-joystick-arrows-pair--moving' : ''}`}>
                                <Back fill="white" size="0.875rem" className={`camera-window__camera-joystick-arrow ${currJoystickZone == 0 ? 'camera-window__camera-joystick-arrow--current' : ''}`} />
                                <Back fill="white" size="0.875rem" className={`camera-window__camera-joystick-arrow camera-window__camera-joystick-arrow--second ${currJoystickZone == 1 ? 'camera-window__camera-joystick-arrow--current' : ''}`} />
                            </div>
                            <Tap fill="white" size="2rem" className={`camera-window__camera-joystick-icon ${moving ? 'camera-window__camera-joystick-icon--moving' : ''}`} />
                            <div style={{
                                transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px) translate(-50%, -50%)`,
                            }}
                                className={`camera-window__camera-joystick ${moving ? 'camera-window__camera-joystick--moving' : ''}`}></div>
                        </div>
                    </div>
                )}
                <div className='camera-window__scrubber-control'>
                    <p className='camera-window__scrubber-current-time'>{(!isLive) ? formatTime(displayedTime) : "LIVE"}</p>
                    <div className='camera-window__scrubber-inner'>
                        <div className='camera-window__scrubber-fade' />
                        <div className='camera-window__scrubber-fade camera-window__scrubber-fade--second' />
                        <div className='camera-window__scrubber-now' />
                        <div className='camera-window__scrubber-wrapper' ref={scrubberWrapperRef} onScroll={handleScroll}
                            onMouseDown={startManualScroll}
                            onMouseUp={stopManualScroll}
                            onTouchStart={startManualScroll}
                            onTouchEnd={stopManualScroll}>
                            <div className='camera-window__scrubber'>
                                <div className='camera-window__scrubber-handle'></div>
                                <div className='camera-window__scrubber-handle camera-window__scrubber-handle--disabled'></div>
                                <div className='camera-window__scrubber-handle'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
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
            <CameraSettings fetchData={args.fetchData} token={args.token} camera={args.camera} rooms={args.rooms}
                room={args.room} name={args.camera.name} visible={settingsVisible} visibilityFunc={setSettingsVisible} />

            <div className='camera-window__back' />
            <div className={`camera-window__header ${settingsVisible ? "camera-window__header--hidden" : ""}`}>
                <div className='camera-window__item-info'>
                    <p className='camera-window__item-name'>{args.camera.name}</p>
                    <p className='camera-window__room-name'>{args.room.name} · {args.camera.isRecording ? 'Запись' : 'Запись приостановлена'}</p>
                </div>
                <div className='camera-window__item-icon'>
                    {renderItemIcon(args.camera)}
                </div>
                <p className='camera-window__close-btn' onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div className={`camera-window__content ${settingsVisible ? "camera-window__content--hidden" : ""}`}>
                <div className='camera-window__content-wrapper'>
                    {renderDeviceControls()}
                </div>
            </div>
            <div className={`item-window__toolbar ${settingsVisible ? "item-window__toolbar--hidden" : ""}`}>
                <div className='item-window__tool-btn item-window__tool-btn--circle' onClick={() => { setIsFav(!isFav); Haptics.impact({ style: ImpactStyle.Light }); }}>
                    {isFav ? <Star size="1.2rem" color="white" /> : <StarOutline size="1.2rem" color="white" />}
                </div>
                <div className='item-window__tool-btn'>
                    <p className='item-window__tool-btn-label' onClick={() => { setSettingsVisible(true); Haptics.impact({ style: ImpactStyle.Light }); }}>Параметры</p>
                    {/* <Gear size="1.2rem" color="white" /> */}
                </div>
            </div>
        </div>
    );
};

export default CameraWindow;
