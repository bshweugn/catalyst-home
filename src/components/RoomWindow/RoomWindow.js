import React, { useState, useEffect, useRef } from 'react';
import './RoomWindow.scss';
import TextInput from '../TextInput/TextInput';
import DropdownSelect from '../DropdownSelect/DropdownSelect';

const RoomWindow = (args) => {
    const [name, setName] = useState(args.room.name);

    const [selectedOption, setSelectedOption] = useState('');
    const options = ['Основной', 'Чердак', 'Подвал'];

    return (
        <div className={`room-window ${!args.visible ? "room-window--hidden" : ""} ${args.vertical ? "room-window--vertical" : ""}`}>
            <div className='room-window__back' />
            <div className='room-window__header'>
                <p className='room-window__header-title'>{args.room.name}</p>
                <p className='room-window__close-btn' onClick={() => args.idFunc(-1)}>Готово</p>
            </div>
            <div className='room-window__content'>
                <div className='room-window__content-wrapper'>
                    <TextInput value={name} label="Имя комнаты" setValue={setName} placeholder={""} />
                    <DropdownSelect
                        options={options}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        label="Этаж"
                    />
                    {args.children}
                </div>
            </div>
        </div>
    );
};

export default RoomWindow;
