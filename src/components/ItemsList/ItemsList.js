import React, { useState } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ItemsList.scss';
import { TouchBackend } from 'react-dnd-touch-backend';
import CustomDragLayer from '../CustomDragLayer/CustomDragLayer';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const ItemsList = ({ roomName, roomID, func, devices, editMode, setItemID, openedID, light, preview, setter, selected, setSelected, setAsTrigger }) => {
    const [cards, setCards] = useState(devices);

    const moveCard = (fromIndex, toIndex) => {
        const updatedCards = [...cards];
        const [movedCard] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, movedCard);
        setCards(updatedCards);
    };

    const touchFunc = (roomID) => {
        Haptics.impact({ style: ImpactStyle.Light });

        if (!preview) {
            func(roomID);
        } else {
            if (setter) {
                const deviceIds = devices.map((device) => device.id);

                setter((prevSelected) => {
                    const allSelected = deviceIds.every((id) => prevSelected.includes(id));

                    if (allSelected) {
                        return prevSelected.filter((id) => !deviceIds.includes(id));
                    } else {
                        return [...new Set([...prevSelected, ...deviceIds])];
                    }
                });
            }
        }
    };

    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <div className={`items-list ${light ? "items-list--light" : ""}`}>
                <h2 className='items-list__room-name' onClick={() => touchFunc(roomID)}>{roomName}</h2>
                <div className="items-list__wrapper">
                    {cards.map((device, index) => (
                        <ItemCard
                            selectable={setter !== undefined}
                            setter={setter}
                            setAsTrigger={setAsTrigger}
                            selectedList={selected}
                            preview={preview}
                            key={device.id}
                            index={index}
                            device={device}
                            editMode={editMode}
                            idFunc={setter ? setter : setItemID}
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
