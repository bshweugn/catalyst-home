import React from 'react';
import './ScriptActionsList.scss';
import Play from '../icons/Play/Play';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import PlusIcon from '../icons/PlusIcon/PlusIcon';
import { itemPrimaryType, renderItemName } from '../../itemInfo';

const ScriptActionsList = (args) => {
    const finalClassName = 'script-actions-list ' + (args.className || '')

    const renderActionText = (deviceType, deviceAction, parameter) => {
        switch (deviceAction) {
            case 'STATE':
                switch (deviceType) {
                    case 'LAMP':
                        return (parameter === "OFF" ? "Выключить" : "Включить");
                    case 'FAN':
                        return (parameter === "OFF" ? "Выключить" : "Включить");
                    case 'RELAY':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    case 'VALVE':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    case 'CURTAIN':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    default:
                        return (parameter === "OFF" ? "Выключить" : "Включить");
                }
            case 'BRIGHTNESS':
                return 'Установить яркость на ' + parameter + "%";
            case 'COLOR_TEMPERATURE':
                if (Number.isInteger(parameter)) {
                    return 'Установить температуру свечения';
                } else {
                    return 'Установить цвет';
                }
            case 'TARGET_TEMP':
                switch (deviceType) {
                    case 'THERMOSTAT':
                        return 'Установить температуру на ' + parameter + "°C";
                    case 'RELAY':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    case 'VALVE':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    case 'CURTAIN':
                        return (parameter === "OFF" ? "Открыть" : "Закрыть");
                    default:
                        return (parameter === "OFF" ? "Выключить" : "Включить");
                }
        }
    }

    return (
        <div className={finalClassName}>
            {args.actions ? args.actions.map((action) => (
                <div className='script-actions-list__action'>
                    <div className='script-actions-list__device-icon-wrapper'>
                        <Lightbulb className='script-actions-list__device-icon' fill='rgba(255, 213, 0, 1)' size="1.6rem" />
                    </div>
                    <div className='script-actions-list__action-info'>
                        <p className='script-actions-list__device-name'>{action.device.name}</p>
                        <p className='script-actions-list__action-text'>{renderActionText(itemPrimaryType(action.device), action.deviceAction, action.parameter)}</p>

                    </div>
                </div>
            )) : null}
            <div className='script-actions-list__add-button' onClick={() => args.openDevicesList()}>
                <PlusIcon className='script-actions-list__add-icon' size="1rem" fill="black" />
                <p className='script-actions-list__add-label'>Добавить действие</p>
            </div>
            {args.actions ? <></> :
                <div className='script-actions-list__add-hint'>
                    <Play className='script-actions-list__add-hint-icon' fill='rgba(0, 0, 0, 0.3)' size="1.4rem" />
                    <p className='script-actions-list__add-hint-text'>Начните с добавленния первого действия,<br />выполняемого данной автоматизацией.</p>
                </div>}
        </div>
    );
};

export default ScriptActionsList;
