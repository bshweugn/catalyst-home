import React, { useState, useRef, useEffect } from 'react';
import './AddAccessoryPopup.scss';
import Popup from '../Popup/Popup';
import ScannerPreview from '../ScannerPreview/ScannerPreview';
import Button from '../Button/Button';
import IconWithHint from '../IconWithHint/IconWithHint';
import Power from '../icons/Power/Power';
import QR from '../icons/QR/QR';

const AddAccessoryPopup = (args) => {
    const [manualInput, setManualInput] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    const handleManualInput = () => {
        setManualInput(true);
    };

    const handleCameraUse = () => {
        setManualInput(false);
    };

    const handleClose = () => {
        setManualInput(false);
        args.func(false);
    }


    const finalClassName = 'add-accessory-popup ' + (args.className || '');

    return (
        <Popup
            className={finalClassName}
            visible={args.visible}
            func={handleClose}
            title={manualInput ? "Код добавления" : "Добавить аксессуар"}
            label={manualInput ? "Введите код, указанный на устройстве, упаковке или документации." : "Отсканируйте код на аксессуаре для добавления в Ваш дом."}
        >
            {manualInput ? (
                <div>
                    <input
                        className='add-accessory-popup__code-input'
                        type="text"
                    />

                    <Button primary onClick={handleCameraUse} label="Далее" />
                    <Button onClick={handleCameraUse} label="Использовать камеру" />
                </div>
            ) : (
                <>
                    <ScannerPreview />
                    <IconWithHint icon={QR} title="Отсканируйте код настройки" label="Код может располагаться на устройстве, упаковке или документации."/>
                    <Button onClick={handleManualInput} label="Ввести код вручную" />
                </>
            )}
        </Popup>
    );
};

export default AddAccessoryPopup;
