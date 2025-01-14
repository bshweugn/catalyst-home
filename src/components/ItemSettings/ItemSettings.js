import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import './ItemSettings.scss';
import Close from '../icons/Close/Close';
import TextInput from '../TextInput/TextInput';
import IconSelector from '../IconSelector/IconSelector';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import CapitalLabel from '../CapitalLabel/CapitalLabel';
import WideButton from '../WideButton/WideButton';
import { deleteDevice, moveDeviceToRoom } from '../../services/devicesService';
import { rename } from '../../services/housesService';
import { setDevice, removeDevice } from '../../store';

const ItemSettings = memo((args) => {
    const dispatch = useDispatch();
    const finalClassName = 'item-settings ' + (args.visible ? 'item-settings--visible ' : '') + (args.className || '');

    const [currentRoom, setCurrentRoom] = useState(args.room);
    const [itemName, setItemName] = useState(args.device.name);
    const [isEditing, setIsEditing] = useState(false);

    const handleRoomChange = async (newRoom) => {
        try {
            const result = await moveDeviceToRoom(args.token, args.device.id, newRoom.id, false);
            if (result?.data) {
                dispatch(setDevice({ id: args.device.id, data: { ...args.device, roomId: newRoom.id } }));
            }
        } catch (error) {
            setCurrentRoom(args.room);
            console.error('Ошибка при перемещении устройства:', error);
        }
    };

    const handleDeviceRename = async (newName) => {
        try {
            const result = await rename(args.token, args.device.id, newName, 'DEVICE');
            if (result?.data) {
                dispatch(setDevice({ id: args.device.id, data: { ...args.device, name: newName } }));
            }
        } catch (error) {
            setItemName(args.device.name);
            console.error('Ошибка переименования устройства:', error);
        }
    };

    const handleDeviceDelete = async () => {
        try {
            const result = await deleteDevice(args.token, args.device.id, args.houseId, true);
            if (result) {
                dispatch(removeDevice({ id: args.device.id }));
                args.visibilityFunc(false);
                args.closeRequired(true);
            }
        } catch (error) {
            console.error('Ошибка удаления устройства:', error);
        }
    };

    const handleBlur = () => {
        if (isEditing) {
            handleDeviceRename(itemName);
            setIsEditing(false);
        }
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    return (
        <div className={finalClassName}>
            <div className="item-settings__header">
                <p className="item-settings__title">{itemName}</p>
                <div className="item-settings__close-button" onClick={() => args.visibilityFunc(false)}>
                    <Close size="0.75rem" fill="white" className="item-settings__close-button-icon" />
                </div>
            </div>
            <div className="item-settings__content">
                <TextInput
                    value={itemName}
                    label="Имя устройства"
                    setValue={setItemName}
                    placeholder=""
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    light
                />
                <IconSelector
                    label="Значок устройства"
                    components={args.icons}
                    selectedComponent={args.selectedIcon}
                    onSelect={args.setSelectedIcon}
                />
                <CapitalLabel label="Расположение" />
                <DropdownSelect
                    options={args.rooms.map((room) => ({ id: room.id, name: room.name }))}
                    selectedOption={currentRoom?.id || null}
                    setSelectedOption={(roomId) => {
                        const selectedRoom = args.rooms.find((room) => room.id === roomId);
                        setCurrentRoom(selectedRoom);
                        handleRoomChange(selectedRoom);
                    }}
                    label="Комната"
                />
                <WideButton red separated label="Удалить устройство" onClick={() => handleDeviceDelete()} />
            </div>
        </div>
    );
});

export default ItemSettings;
