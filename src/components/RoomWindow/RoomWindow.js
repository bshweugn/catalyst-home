import React, { useState, useEffect, useRef } from 'react';
import './RoomWindow.scss';
import TextInput from '../TextInput/TextInput';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import { moveRoomToFloor } from '../../services/housesService';
import WideButton from '../WideButton/WideButton';

const RoomWindow = (args) => {
    const [name, setName] = useState(args.room.name);

    const [selectedOption, setSelectedOption] = useState('');

    const [currentFloor, setCurrentFloor] = useState(args.floor);


    const handleFloorChange = async (newFloor) => {
        try {
            const result = await moveRoomToFloor(args.token, args.room.id, newFloor.id);
            if (result) {
                const result = args.fetchData(args.token);
            }
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
        }
    }


    // const handleFloorDelete = async (newFloor) => {
    //     try {
    //         const result = await deleteFloor(args.token, args.room.id);
    //         if (result) {
    //             const result = args.fetchData(args.token);
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при получении устройства:', error);
    //     }
    // }



    return (
        <div className={`room-window ${!args.visible ? "room-window--hidden" : ""} ${args.vertical ? "room-window--vertical" : ""} ${args.room.id}`}>
            <div className='room-window__back' />
            <div className='room-window__header'>
                <p className='room-window__header-title'>{args.room.name}</p>
                <p className='room-window__close-btn' onClick={() => args.idFunc(-1)}>Готово</p>
            </div>
            <div className='room-window__content'>
                <div className='room-window__content-wrapper'>
                    <TextInput value={name} label="Имя комнаты" setValue={setName} placeholder={""} />
                    <DropdownSelect
                        options={args.floors.map(floor => ({ id: floor.id, name: floor.name }))}
                        selectedOption={currentFloor?.id || null}
                        setSelectedOption={(floorId) => {
                            const selectedFloor = args.floors.find(floor => floor.id === floorId);
                            setCurrentFloor(selectedFloor);
                            handleFloorChange(selectedFloor);
                        }}
                        label="Этаж"
                    />
                    <WideButton red label={"Удалить комнату"} onClick={() => {}} />
                    {args.children}
                </div>
            </div>
        </div>
    );
};

export default RoomWindow;
