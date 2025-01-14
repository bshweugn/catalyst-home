import React, { useState, useRef, useEffect } from 'react';
import './RoomSelector.scss';
import SuperEllipse from 'react-superellipse';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Search from '../Search/Search';

const RoomSelector = ({ rooms, setRoomId, roomId, className, setActiveRoom }) => {
    const [heldRoomId, setHeldRoomId] = useState(null);
    const holdTimeoutRef = useRef(null);
    const sliderRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [maskStyle, setMaskStyle] = useState({});

    const finalClassName = 'room-selector ' + (className || '');

    const hapticsImpactLight = async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
    };

    // const hapticsImpactMedium = async () => {
    //     await Haptics.impact({ style: ImpactStyle.Medium });
    // };

    // const handleHoldStart = (room) => {
    //     setHeldRoomId(room.id);
    //     holdTimeoutRef.current = setTimeout(() => {
    //         setActiveRoom(room.id);
    //         hapticsImpactMedium();
    //         holdTimeoutRef.current = null; // Clear to prevent click logic
    //     }, 400);
    // };

    // const handleHoldEnd = (room) => {
    //     clearTimeout(holdTimeoutRef.current);
    //     holdTimeoutRef.current = null;
    //     setHeldRoomId(null);
    // };

    const handleClick = (room) => {
        setRoomId(room.id);
    };

    const updateMaskStyle = () => {
        if (sliderRef.current) {
            const scrollLeft = sliderRef.current.scrollLeft;
            const scrollWidth = sliderRef.current.scrollWidth;
            const clientWidth = sliderRef.current.clientWidth;

            if (scrollLeft === 0) {
                // Крайнее левое положение
                setMaskStyle({
                    maskImage: `linear-gradient(90deg, transparent, black 85%, black 100%)`,
                    WebkitMaskImage: `linear-gradient(90deg, transparent, black 0%, black 85%, transparent)`,
                });
            } else if (scrollLeft + clientWidth >= scrollWidth) {
                // Крайнее правое положение
                setMaskStyle({
                    maskImage: `linear-gradient(90deg, black 0%, black 15%, transparent)`,
                    WebkitMaskImage: `linear-gradient(90deg, transparent, black 15%, black 100%, transparent)`,
                });
            } else {
                // Промежуточное положение
                setMaskStyle({
                    maskImage: `linear-gradient(90deg, transparent, black 15%, black 85%, transparent)`,
                    WebkitMaskImage: `linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent 100%);`,
                });
            }
        }
    };

    useEffect(() => {
        updateMaskStyle();
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', updateMaskStyle);
        }
        return () => {
            if (slider) {
                slider.removeEventListener('scroll', updateMaskStyle);
            }
        };
    }, []);

    return (
        <div className={`${finalClassName}`}>
            <div className={`room-selector__slider-wrapper`} style={maskStyle}>
                <div className={`room-selector__slider`} ref={sliderRef}>
                    <div
                        className={`room-selector__room ${roomId === 0 ? "room-selector__room--selected" : ""}`}
                        onClick={() => { setRoomId(0); }}
                    >
                        Обзор
                    </div>
                    <div
                        className={`room-selector__room ${roomId === 100 ? "room-selector__room--selected" : ""}`}
                        onClick={() => { setRoomId(100); }}
                    >
                        Гостиная
                    </div>
                    <div
                        className={`room-selector__room ${roomId === 100 ? "room-selector__room--selected" : ""}`}
                        onClick={() => { setRoomId(100); }}
                    >
                        Гостиная
                    </div>
                    <div
                        className={`room-selector__room ${roomId === 100 ? "room-selector__room--selected" : ""}`}
                        onClick={() => { setRoomId(100); }}
                    >
                        Гостиная
                    </div>
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            className={`room-selector__room ${roomId === room.id ? "room-selector__room--selected" : ""} ${heldRoomId === room.id ? "room-selector__room--hold" : ""}`}
                            onClick={() => handleClick(room)}
                        >
                            {room.name}
                        </div>
                    ))}
                </div>
            </div>
            <Search className="room-selector__search-btn" />
        </div>
    );
};

export default RoomSelector;
