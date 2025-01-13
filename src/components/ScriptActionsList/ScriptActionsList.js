import React from 'react';
import './ScriptActionsList.scss';
import Play from '../icons/Play/Play';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import PlusIcon from '../icons/PlusIcon/PlusIcon';
import { itemPrimaryType, renderItemName } from '../../itemInfo';
import { getDeviceById } from '../../services/devicesService';

const ScriptActionsList = (args) => {
    const finalClassName = 'script-actions-list ' + (args.className || '');

    // Разбор строки действий в массив объектов
    const parseActions = (actionsString) => {
        const actions = actionsString
            .split(' -> ')
            .filter(Boolean) // Убираем пустые элементы
            .map((action) => {
                const match = action.match(/\((\d+), "([^"]+)", "([^"]+)"\)/);
                if (match) {
                    const [_, id, deviceAction, parameter] = match;
                    return { id: parseInt(id), deviceAction, parameter };
                }
                return null;
            })
            .filter(Boolean);
        return actions;
    };

    // Группировка действий по ID устройства
    const groupActionsByDevice = (actions) => {
        return actions.reduce((acc, action) => {
            if (!acc[action.id]) {
                acc[action.id] = [];
            }
            acc[action.id].push(action);
            return acc;
        }, {});
    };

    // Отображение текста действия
    const renderActionText = (deviceType, deviceAction, parameter) => {
        switch (deviceAction) {
            case 'STATE':
                switch (deviceType) {
                    case 'LAMP':
                        return parameter === "OFF" ? "Выключить" : "Включить";
                    case 'FAN':
                        return parameter === "OFF" ? "Выключить" : "Включить";
                    case 'RELAY':
                        return parameter === "OFF" ? "Открыть" : "Закрыть";
                    case 'VALVE':
                        return parameter === "OFF" ? "Открыть" : "Закрыть";
                    case 'CURTAIN':
                        return parameter === "OFF" ? "Открыть" : "Закрыть";
                    default:
                        return parameter === "OFF" ? "Выключить" : "Включить";
                }
            case 'BRIGHTNESS':
                return `Установить яркость на ${parameter}%`;
            case 'COLOR_TEMPERATURE':
                return Number.isInteger(Number(parameter))
                    ? 'Установить температуру свечения'
                    : 'Установить цвет';
            case 'TARGET_TEMP':
                return `Установить температуру на ${parameter}°C`;
            default:
                return `Выполнить действие ${deviceAction} с параметром ${parameter}`;
        }
    };


    // Основная логика
    const actionsString = args.actionsString || ''; // Переданная строка действий
    const parsedActions = parseActions(actionsString);
    const groupedActions = groupActionsByDevice(parsedActions);

    return (
        <div className={finalClassName}>
            {Object.entries(groupedActions).map(([deviceId, actions]) => {
                const device = getDeviceById(parseInt(deviceId), args.houses);
                if (!device) return null;

                return (
                    <div className="script-actions-list__action" key={deviceId}>
                        <div className="script-actions-list__device-icon-wrapper">
                            <Lightbulb
                                className="script-actions-list__device-icon"
                                fill="rgba(255, 213, 0, 1)"
                                size="1.6rem"
                            />
                        </div>
                        <div className="script-actions-list__action-info">
                            <p className="script-actions-list__device-name">
                                {renderItemName(device)}
                            </p>
                            {actions.map((action, index) => (
                                <p
                                    className="script-actions-list__action-text"
                                    key={`${deviceId}-${index}`}
                                >
                                    {renderActionText(
                                        itemPrimaryType(device),
                                        action.deviceAction,
                                        action.parameter
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div
                className="script-actions-list__add-button"
                onClick={() => args.openDevicesList()}
            >
                <PlusIcon
                    className="script-actions-list__add-icon"
                    size="1rem"
                    fill="black"
                />
                <p className="script-actions-list__add-label">Добавить действие</p>
            </div>
            {parsedActions.length === 0 && (
                <div className="script-actions-list__add-hint">
                    <Play
                        className="script-actions-list__add-hint-icon"
                        fill="rgba(0, 0, 0, 0.3)"
                        size="1.4rem"
                    />
                    <p className="script-actions-list__add-hint-text">
                        Начните с добавления первого действия,<br />
                        выполняемого данной автоматизацией.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScriptActionsList;
