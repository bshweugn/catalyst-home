import React, { useState } from 'react';
import './ItemSettings.scss';
import Close from '../icons/Close/Close';
import TextInput from '../TextInput/TextInput';
import IconSelector from '../IconSelector/IconSelector';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import CapitalLabel from '../CapitalLabel/CapitalLabel';
import WideButton from '../WideButton/WideButton';
import { deleteDevice, moveDeviceToRoom } from '../../services/devicesService';

const ItemSettings = (args) => {
    const finalClassName = 'item-settings ' + (args.visible ? 'item-settings--visible ' : '') + (args.className || '')

    const [currentRoom, setCurrentRoom] = useState(args.room);


    const handleRoomChange = async (newRoom) => {
        try {
            const result = await moveDeviceToRoom(args.token, args.device.id, newRoom.id, false);
            if (result) {
                const result = await args.fetchData(args.token);
                console.log(result);
            }  
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
        }
    }


    const handleDeviceDelete = async () => {
        try {
            const result = await deleteDevice(args.token, args.itemId, args.houseId, true);

            if (result) {
                args.visibilityFunc(false);
                args.closeRequired(true)
            }
        } catch {
            console.log("Ошибка удаления устройтва.");
        }
    }


    return (
        <div className={finalClassName}>
            <div className="item-settings__header">
                <p className="item-settings__title">{args.name}</p>
                <div className='item-settings__close-button' onClick={() => args.visibilityFunc(false)}>
                    <Close size="0.75rem" fill='white' className='item-settings__close-button-icon' />
                </div>
            </div>
            <div className='item-settings__content'>
                <TextInput value={args.name} label="Имя устройства" setValue={args.visibilityFunc} placeholder={""} />
                <IconSelector
                    label="Значок устройства"
                    components={args.icons}
                    selectedComponent={args.selectedIcon}
                    onSelect={args.setSelectedIcon}
                />
                <CapitalLabel label="Расположение" />
                <DropdownSelect
                    options={args.rooms.map(room => ({ id: room.id, name: room.name }))}
                    selectedOption={currentRoom?.id || null}
                    setSelectedOption={(roomId) => {
                        const selectedRoom = args.rooms.find(room => room.id === roomId);
                        setCurrentRoom(selectedRoom);
                        handleRoomChange(selectedRoom);
                    }}
                    label="Комната"
                />
                <WideButton red separated label={"Удалить устройство"} onClick={() => handleDeviceDelete()} />
            </div>
        </div>
    );
};

export default ItemSettings;
