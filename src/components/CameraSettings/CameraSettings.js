import React, { useEffect, useState } from 'react';
import './CameraSettings.scss';
import Close from '../icons/Close/Close';
import TextInput from '../TextInput/TextInput';
import IconSelector from '../IconSelector/IconSelector';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import CapitalLabel from '../CapitalLabel/CapitalLabel';
import WideButton from '../WideButton/WideButton';
import ToggleList from '../ToggleList/ToggleList';
import { executeCameraCommand } from '../../services/camerasService';
import { moveDeviceToRoom } from '../../services/devicesService';

const CameraSettings = (args) => {
    const finalClassName =
        'camera-settings ' +
        (args.visible ? 'camera-settings--visible ' : '') +
        (args.className || '');

    const [currentRoom, setCurrentRoom] = useState(args.room);


    const handleRoomChange = async (newRoom) => {
        try {
            const result = await moveDeviceToRoom(args.token, args.camera.id, newRoom.id, true);
            if (result) {
                const result = await args.fetchData(args.token);
            }
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
        }
    }

    const [toggleStates, setToggleStates] = useState([
        { label: 'Камера включена', value: args.camera.status !== "OFF", setter: (value) => handleToggleChange(0, value) },
        { label: 'Запись видео', value: args.camera.isRecording, setter: (value) => handleToggleChange(1, value) },
        { label: 'Обнаружение движения', value: args.camera.motionSensorEnabled, setter: (value) => handleToggleChange(2, value) },
    ]);

    const [manualToggle, setManualToggle] = useState(false); // Флаг ручного изменения

    const handleToggleChange = (index, value) => {
        setManualToggle(true); // Устанавливаем флаг при ручном изменении
        const newToggles = [...toggleStates];
        newToggles[index].value = value;
        setToggleStates(newToggles);
    };

    useEffect(() => {
        const toggleCameraPower = async (state) => {
            const command = state ? 'TURN_ON' : 'TURN_OFF';

            try {
                const camera = await executeCameraCommand(args.token, args.camera.id, command, '');

                if (camera !== null) {
                    console.log(JSON.stringify(camera));
                } else {
                    console.error('Не удалось отправить команду ВКЛ/ВЫКЛ.');
                }
            } catch (error) {
                console.error('Не удалось отправить команду ВКЛ/ВЫКЛ:', error);
            }
        };

        if (manualToggle) {
            toggleCameraPower(toggleStates[0].value);
            setManualToggle(false);
        }
    }, [toggleStates[0].value]);

    useEffect(() => {
        const toggleCameraRecording = async (state) => {
            const command = state ? 'START_RECORDING' : 'STOP_RECORDING';

            try {
                const camera = await executeCameraCommand(args.token, args.camera.id, command, '');

                if (camera !== null) {
                    console.log(JSON.stringify(camera));
                } else {
                    console.error('Не удалось отправить команду ВКЛ/ВЫКЛ.');
                }
            } catch (error) {
                console.error('Не удалось отправить команду ВКЛ/ВЫКЛ:', error);
            }
        };

        if (manualToggle) {
            toggleCameraRecording(toggleStates[1].value);
            setManualToggle(false);
        }
    }, [toggleStates[1].value]);

    useEffect(() => {
        const toggleCameraMS = async (state) => {
            const command = state ? 'ENABLE_MS' : 'DISABLE_MS';

            try {
                const camera = await executeCameraCommand(args.token, args.camera.id, command, '');

                if (camera !== null) {
                    console.log(JSON.stringify(camera));
                } else {
                    console.error('Не удалось отправить команду MS.');
                }
            } catch (error) {
                console.error('Не удалось отправить команду MS:', error);
            }
        };

        if (manualToggle) {
            toggleCameraMS(toggleStates[2].value);
            setManualToggle(false);
        }
    }, [toggleStates[2].value]);

    return (
        <div className={finalClassName}>
            <div className="camera-settings__header">
                <p className="camera-settings__title">{args.name}</p>
                <div
                    className="camera-settings__close-button"
                    onClick={() => args.visibilityFunc(false)}
                >
                    <Close size="0.75rem" fill="white" className="camera-settings__close-button-icon" />
                </div>
            </div>
            <div className="camera-settings__content">
                <TextInput
                    value={args.name}
                    label="Имя камеры"
                    setValue={args.visibilityFunc}
                    placeholder={''}
                />
                <ToggleList
                    separated
                    bottomSeparated
                    toggles={toggleStates}
                    label="Настройки камеры"
                />
                <CapitalLabel label="Расположение" />
                {/* <p>{JSON.stringify(args.rooms)}</p> */}
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
                <WideButton red separated label={'Удалить камеру'} />
            </div>
        </div>
    );
};

export default CameraSettings;
