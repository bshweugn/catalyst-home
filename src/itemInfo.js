import Curtains from "./components/icons/Curtains/Curtains";
import Drop from "./components/icons/Drop/Drop";
import Fan from "./components/icons/Fan/Fan";
import Humidifier from "./components/icons/Humidifier/Humidifier";
import Lightbulb from "./components/icons/Lightbulb/Lightbulb";
import Relay from "./components/icons/Relay/Relay";
import Thermometer from "./components/icons/Thermometer/Thermometer";
import Valve from "./components/icons/Valve/Valve";
import VideoIcon from "./components/icons/VideoIcon/VideoIcon";

export function renderItemStatus(device, concise) {
    const [mainType, subType] = device.deviceType.split('_');

    switch (mainType) {
        case 'TEMPERATURE': // Температурный датчик
            return null;

        case 'HUMIDITY': // Температурный датчик
            return null;

        case 'LAMP': // Лампа
            if (device.features.BRIGHTNESS !== undefined && device.features.COLOR_TEMP !== undefined) {
                if (device.status === 'ON' && device.features.BRIGHTNESS !== 0) {
                    return `${device.features.BRIGHTNESS}%`;
                } else {
                    return 'Выкл.'
                }
            } else if (device.features.BRIGHTNESS !== undefined) {
                if (device.status === 'ON' && device.features.BRIGHTNESS !== 0) {
                    return `${device.features.BRIGHTNESS}%`;
                } else {
                    return 'Выкл.'
                }
            } else if (device.features.COLOR !== undefined) {
                return `Цвет: ${device.features.COLOR}`;
            }
            return device.status === 'ON' ? 'Вкл.' : 'Выкл.';

        case 'CURTAIN': // Лампа
            if (device.features.PERCENTAGE !== undefined) {
                if (device.features.PERCENTAGE === 0) {
                    return 'Закрыто';
                } else if (device.features.PERCENTAGE === 100) {
                    return 'Открыто';
                } else {
                    return `Открыто на ${device.features.PERCENTAGE}%`;
                }
            }
            if (device.status === "CLOSED") {
                return 'Закрыто';
            }
            return 'Открыто';

        case 'FAN': // Вентилятор
            return device.status === 'ON' ? 'Вкл.' : 'Выкл.';

        case 'RELAY': // Реле
            return device.status === 'ON' ? 'Вкл.' : 'Выкл.';

        case 'LEAK': // Датчик протечки
            return device.status === 'ALERT' ? 'Обнаружена протечка' : 'В норме';

        case 'VALVE': // Клапан
            return device.status === 'OPENED' ? 'Открыт' : 'Закрыт';

        case 'THERMOSTAT': // Термостат
            const current = device.features.CURRENT_TEMP;
            const target = device.features.TARGET_TEMP;
            if (device.status !== "OFF") {
                if (current !== undefined && target !== undefined) {
                    if (current < target) return `Подогрев до ${target}°C`;
                    if (current > target) return `Охлаждение до ${target}°C`;
                    return concise ? "Поддержание" : 'Поддержание температуры';
                }
                return 'Нет данных';
            } else {
                return 'Выключен'
            }

        case 'AC': // Термостат
            const currentAC = device.features.CURRENT_TEMP;
            const targetAC = device.features.TARGET_TEMP;
            if (device.status !== "OFF") {
                if (currentAC !== undefined && targetAC !== undefined) {
                    if (currentAC < targetAC) return `Подогрев до ${targetAC}°C`;
                    if (currentAC > targetAC) return `Охлаждение до ${targetAC}°C`;
                    return concise ? "Поддержание" : 'Поддержание температуры';
                }
                return 'Нет данных';
            } else {
                return 'Выключен'
            }

        case 'HUMIDIFIER': // Увлажнитель
            const currentHum = device.features.CURRENT_HUM;
            const targetHum = device.features.TARGET_HUM;
            if (currentHum !== undefined && targetHum !== undefined) {
                if (currentHum < targetHum) return `Увлажнение до ${target}%`;
                if (currentHum > targetHum) return `Ожидание`;
                return concise ? "Поддержание" : 'Поддержание влажности';
            }
            return 'Нет данных';

        case 'CAMERA': // Камера
            if (device.features.RECORDING && device.status === 'ON') {
                return 'Запись активна';
            }
            return device.status === 'ON' ? 'Камера включена' : 'Камера выключена';

        case 'ROBOT': // Робот-пылесос
            return device.status === 'WORKING'
                ? 'Уборка'
                : device.status === 'PAUSED'
                    ? 'Пауза'
                    : device.status === 'ERROR'
                        ? 'Ошибка'
                        : device.status === 'RETURNING'
                            ? 'Возврат'
                            : device.status === 'ON'
                                ? 'Ожидание' :
                                'Выключен';

        default:
            return 'Неизвестное устройство';
    }
}


export function getItemStatus(device) {
    const [mainType, subType] = device.deviceType.split('_');

    if (mainType !== "ROBOT" && mainType !== "VALVE" && mainType !== "CURTAIN" && mainType !== "LAMP" && mainType !== "RELAY") {
        return (device.status !== "OFF");
    } else if (mainType === "ROBOT") {
        if (device.status !== "OFF" && device.status !== "PAUSED" && device.status !== "ERROR") {
            return true;
        } else {
            return false;
        }
    } else if (mainType === "VALVE") {
        if (device.status === "CLOSED") {
            return false;
        } else {
            return true;
        }
    } else if (mainType === "CURTAIN") {
        if (device.status === "CLOSED" || device.features.PERCENTAGE === 100) {
            return false;
        } else {
            return true;
        }
    } else if (mainType === "LAMP") {
        if (device.status === "OFF" || device.features.BRIGHTNESS === 0) {
            return false;
        } else {
            return true;
        }
    } else if (mainType === "RELAY") {
        if (device.status === "OFF") {
            return false;
        } else {
            return true;
        }
    }
}


export function getItemAction(device, enableAction) {
    const [mainType, subType] = device.deviceType.split('_');

    if (enableAction) {
        switch (mainType) {
            case 'LAMP': // Лампа
                return 'TURN_ON';

            case 'CURTAIN':
                return 'CLOSE';

            case 'FAN': // Вентилятор
                return 'TURN_ON'

            case 'RELAY': // Реле
                return 'TURN_ON';

            case 'VALVE': // Клапан
                return 'OPEN';

            case 'THERMOSTAT': // Термостат
                return 'TURN_ON';

            case 'AC':
                return 'TURN_ON';

            case 'HUMIDIFIER':
                return 'TURN_ON';

            case 'ROBOT':
                return 'RUN'

            default:
                return 'TURN_ON';
        }
    } else {
        switch (mainType) {
            case 'LAMP': // Лампа
                return 'TURN_OFF';

            case 'CURTAIN':
                return 'OPEN';

            case 'FAN': // Вентилятор
                return 'TURN_OFF'

            case 'RELAY': // Реле
                return 'TURN_OFF';

            case 'VALVE': // Клапан
                return 'CLOSE';

            case 'THERMOSTAT': // Термостат
                return 'TURN_OFF';

            case 'AC':
                return 'TURN_OFF';

            case 'HUMIDIFIER':
                return 'TURN_OFF';

            case 'ROBOT':
                return 'FINISH'

            default:
                return 'TURN_OFF';
        }
    }
}



export function renderItemName(device) {
    const [mainType] = (device.deviceType || device.type || "").split('_');

    switch (mainType) {
        case 'LAMP':
            return 'Умная лампа';
        case 'THERMOSTAT':
            return 'Термостат';
        case 'VALVE':
            return 'Умный клапан';
        case 'RELAY':
            return 'Умное реле';
        case 'LEAK':
            return 'Датчик протечки';
        case 'TEMPERATURE':
            return 'Датчик температуры';
        case 'HUMIDITY':
            return 'Датчик влажности';
        case 'FAN':
            return 'Вентилятор';
        case 'CURTAIN':
            return 'Шторы';
        case 'HUMIDIFIER':
            return 'Увлажнитель';
        case 'CAMERA':
            return 'Камера';
        case 'ROBOT':
            return 'Робот-пылесос';
        case 'AC':
            return 'Кондиционер';
        default:
            return 'Неизвестное устройство';
    }
}

export function renderItemIcon(device, displayText, size, className) {
    const [mainType, subType] = (device.deviceType || device.type || "").split('_');


    if (device !== undefined) {
        if (mainType === "AC" || mainType == "THERMOSTAT") {
            const target = device.features.TARGET_TEMP;
            if (displayText) {
                return <p className={`item-card__temp`}>{target}°</p>;
            } else {
                return <p className={`item-card__temp--small`}>{target}°</p>;
            }
        } else if (mainType === "TEMPERATURE") {
            const current = device.features.CURRENT_TEMP;
            if (displayText) {
                return <p className={`item-card__temp`}>{current}°</p>;
            } else {
                return <p className={`item-card__temp--small`}>{current}°</p>;
            }
        } else if (mainType === "HUMIDITY") {
            const current = device.features.CURRENT_HUM;
            if (displayText) {
                return <p className={`item-card__temp`}>{current}%</p>;
            } else {
                return <p className={`item-card__temp--small`}>{current}%</p>;
            }
        } else {
            if (mainType === 'LAMP') {
                return <Lightbulb size={(size ? size : "1.6rem")} fill="#ffbf0d" className={className} />
            }

            if (mainType === 'CURTAIN') {
                return <Curtains size={(size ? size : "1.6rem")} fill="rgb(162 0 226)" className={className} />
            }

            if (mainType === 'LEAK') {
                return <Drop size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'FAN') {
                return <Fan size={(size ? size : "1.4rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'HUMIDIFIER') {
                return <Humidifier size={(size ? size : "1.8rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'RELAY') {
                return <Relay size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'VALVE') {
                return <Valve size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'CAMERA') {
                return <VideoIcon size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            return null;
        }
    } else {
        return null;
    }
}

export function itemPrimaryType(device) {
    console.log(device);
    const [mainType, subType] = (device.deviceType).split('_');

    return mainType;
}

export function isSensor(device) {
    const [mainType, subType] = device.deviceType.split('_');

    if (device !== undefined) {
        if (mainType === "TEMPERATURE" || mainType == "LEAK" || mainType == "HUMIDITY") {
            return true;
        }
        return false;
    }
}

export function isVerticalControls(device) {
    const [mainType, subType] = (device.deviceType || device.type || "").split('_');

    switch (mainType) {
        case 'THERMOSTAT':
            return true;
        case 'AC':
            return true;
        case 'TEMPERATURE':
            return true;
        case 'HUMIDIFIER':
            return true;
        default:
            return false;
    }
}