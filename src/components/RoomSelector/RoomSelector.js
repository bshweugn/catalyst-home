import React, { useState, useRef } from 'react';
import './RoomSelector.scss';
import SuperEllipse from 'react-superellipse';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const RoomSelector = ({ rooms, setRoomId, roomId, className, setActiveRoom }) => {
    const [heldRoomId, setHeldRoomId] = useState(null);
    const holdTimeoutRef = useRef(null);
    const clickTimeoutRef = useRef(null);

    const finalClassName = 'room-selector ' + (className || '');

    const hapticsImpactLight = async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
    };

    const hapticsImpactMedium = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    const handleHoldStart = (room) => {
        setHeldRoomId(room.id);
        holdTimeoutRef.current = setTimeout(() => {
            setActiveRoom(room.id);
            hapticsImpactMedium();
            holdTimeoutRef.current = null; // Clear to prevent click logic
        }, 400);
    };

    const handleHoldEnd = (room) => {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
        setHeldRoomId(null);
    };

    const handleClick = (room) => {
        if (holdTimeoutRef.current === null) {
            setRoomId(room.id);
        }
    };

    return (
        <div className={finalClassName}>
            <div 
                className={`room-selector__room ${roomId === 0 ? "room-selector__room--selected" : ""}`} 
                onClick={() => { setRoomId(0); }}
            >
                Обзор
            </div>
            <div className='room-selector__separator' />
            {rooms.map((room, index) => (
                <div
                    key={index}
                    className={`room-selector__room ${roomId === room.id ? "room-selector__room--selected" : ""} ${heldRoomId === room.id ? "room-selector__room--hold" : ""}`}
                    onMouseDown={() => handleHoldStart(room)}
                    onMouseUp={() => handleHoldEnd(room)}
                    onMouseLeave={() => handleHoldEnd(room)}
                    onTouchStart={() => handleHoldStart(room)}
                    onTouchEnd={() => {
                        handleHoldEnd(room);
                        handleClick(room);
                    }}
                    onClick={() => handleClick(room)}
                >
                    {room.name}
                </div>
            ))}
        </div>
    );
};

export default RoomSelector;
