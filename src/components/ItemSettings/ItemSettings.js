import React from 'react';
import './ItemSettings.scss';
import Close from '../icons/Close/Close';
import TextInput from '../TextInput/TextInput';
import IconSelector from '../IconSelector/IconSelector';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import CapitalLabel from '../CapitalLabel/CapitalLabel';
import WideButton from '../WideButton/WideButton';

const ItemSettings = (args) => {
    const finalClassName = 'item-settings ' + (args.visible ? 'item-settings--visible ' : '') + (args.className || '')
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
                    options={args.rooms}
                    selectedOption={args.room}
                    setSelectedOption={args.setRoom}
                    label="Комната"
                />
                <WideButton red separated label={"Удалить устройство"}/>
            </div>
        </div>
    );
};

export default ItemSettings;
