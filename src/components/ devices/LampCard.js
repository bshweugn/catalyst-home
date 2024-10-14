import React from 'react';
import Power from '../icons/Power/Power';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import ItemCard from '../ItemCard/ItemCard';

const LampCard = ({ dimmable, brightness, colorTemperature, active, roomName }) => {
    const state = active
        ? dimmable
            ? `${brightness}%`
            : "Вкл."
        : "Выкл.";

    return (
        <ItemCard
            name="Лампочка"
            icon={Lightbulb}
            actionIcon={active ? Power : Power}
            color={active ? "#FFD700" : "#CCCCCC"}
            roomName={roomName}
            state={state}
            active={active}
            dimmable={dimmable}
            isSensor={false} // Лампочка не сенсор
        />
    );
};

export default LampCard;
