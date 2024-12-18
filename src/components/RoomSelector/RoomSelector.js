import React from 'react';
import './RoomSelector.scss';
import SuperEllipse from 'react-superellipse';

const RoomSelector = ({ rooms, setRoomId, roomId, className }) => {
    const finalClassName = 'room-selector ' + (className || '')
    return (
        <div className={finalClassName}>
            <div className={`room-selector__room ${roomId === 0 ? "room-selector__room--selected" : ""}`} onClick={() => { setRoomId(0) }}>
                Обзор
            </div>
            <div className='room-selector__separator' />
            {rooms.map((room, index) => (
                <div key={index} className={`room-selector__room ${roomId === room.id ? "room-selector__room--selected" : ""}`} onClick={() => { setRoomId(room.id) }}>
                    {room.name}
                </div>
            ))}
        </div>
    );
};

export default RoomSelector;
