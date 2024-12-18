import React from 'react';
import './RoomItemsList.scss';
import ItemsList from '../ItemsList/ItemsList';

const RoomItemsList = ({rooms, setSelectedRoomId, setItemId, itemId, currentRoomId, editMode, className}) => {
    const finalClassName = 'room-items-list ' + (className || '')

    return (
        <div className={finalClassName}>
            {Object.values(rooms)
                .filter((room) => currentRoomId === 0 || room.id === currentRoomId)
                .map((room) => (
                    <ItemsList
                        key={room.id}
                        roomName={room.name}
                        roomID={room.id}
                        func={setSelectedRoomId}
                        devices={room.devices}
                        editMode={editMode}
                        setItemID={setItemId}
                        openedID={itemId}
                        hiddenTitle={currentRoomId !== 0}
                    />
                    // <p>{JSON.stringify(room)}</p>
                ))}
        </div>
    );
};

export default RoomItemsList;
