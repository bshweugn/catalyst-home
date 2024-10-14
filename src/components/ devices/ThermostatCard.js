import React from 'react';
import ItemCard from './ItemCard';
import ThermostatIcon from '../icons/ThermostatIcon'; // Замените на реальную иконку термостата

const ThermostatCard = ({ currentTemp, targetTemp, mode, roomName, active, maximized, editMode }) => {
    const states = {
        heating: 'Нагрев',
        maintaining: 'Поддержание',
        off: 'Выключен',
    };

    return (
        <ItemCard
            name="Термостат"
            roomName={roomName}
            temp={targetTemp} // Задать температуру вместо иконки
            state={mode}
            states={states}
            active={active}
            maximized={maximized}
            editMode={editMode}
            icon={ThermostatIcon}
            actionIcon={ThermostatIcon} // можно заменить на кнопку активации или другой элемент
        />
    );
};

export default ThermostatCard;
