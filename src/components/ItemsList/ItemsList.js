import React, { useState } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ItemsList.scss';
import { TouchBackend } from 'react-dnd-touch-backend';
import CustomDragLayer from '../CustomDragLayer/CustomDragLayer';

const ItemsList = ({ roomName, roomID, func, devices, editMode, setItemID, openedID }) => {
    const [cards, setCards] = useState(devices);

    const moveCard = (fromIndex, toIndex) => {
        const updatedCards = [...cards];
        const [movedCard] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, movedCard);
        setCards(updatedCards);
    };

    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <div className="items-list">
                <h2 className='items-list__room-name' onClick={() => func(roomID)}>{roomName}</h2>
                <div className="items-list__wrapper">
                    {cards.map((device, index) => (
                        <ItemCard
                            key={device.id}
                            index={index}
                            device={device}
                            editMode={editMode}
                            idFunc={setItemID}
                            moveCard={moveCard}
                            opened={device.id === openedID}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
};

export default ItemsList;
