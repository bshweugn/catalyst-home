import React, { useState } from 'react';
import './CameraSettings.scss';
import Close from '../icons/Close/Close';
import TextInput from '../TextInput/TextInput';
import IconSelector from '../IconSelector/IconSelector';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import CapitalLabel from '../CapitalLabel/CapitalLabel';
import WideButton from '../WideButton/WideButton';
import ToggleList from '../ToggleList/ToggleList';

const CameraSettings = (args) => {
    const finalClassName = 'camera-settings ' + (args.visible ? 'camera-settings--visible ' : '') + (args.className || '');

    const [toggleStates, setToggleStates] = useState([
        { label: 'Запись видео', value: false, setter: (value) => handleToggleChange(0, value) },
        { label: 'Обнаружение движения', value: false, setter: (value) => handleToggleChange(1, value) },
    ]);

    const handleToggleChange = (index, value) => {
        const newToggles = [...toggleStates];
        newToggles[index].value = value;
        setToggleStates(newToggles);
    };

    return (
        <div className={finalClassName}>
            <div className="camera-settings__header">
                <p className="camera-settings__title">{args.name}</p>
                <div className='camera-settings__close-button' onClick={() => args.visibilityFunc(false)}>
                    <Close size="0.75rem" fill='white' className='camera-settings__close-button-icon' />
                </div>
            </div>
            <div className='camera-settings__content'>
                <TextInput value={args.name} label="Имя камеры" setValue={args.visibilityFunc} placeholder={""} />
                <ToggleList separated bottomSeparated toggles={toggleStates} label="Настройки камеры" />
                <CapitalLabel label="Расположение" />
                <p>{JSON.stringify(args.rooms)}</p>
                <DropdownSelect
                    options={args.rooms}
                    selectedOption={args.room}
                    setSelectedOption={args.setRoom}
                    label="Комната"
                />
                <WideButton red separated label={"Удалить камеру"} />
            </div>
        </div>
    );
};

export default CameraSettings;
