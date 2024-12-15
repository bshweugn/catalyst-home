import Drop from "./components/icons/Drop/Drop";
import Fan from "./components/icons/Fan/Fan";
import Lightbulb from "./components/icons/Lightbulb/Lightbulb";
import Thermometer from "./components/icons/Thermometer/Thermometer";

export function renderItemStatus(device, concise) {
    const [mainType, subType] = device.deviceType.split('_');

    switch (mainType) {
        case 'TEMPERATURE': // Температурный датчик
            return null;

        case 'HUMIDITY': // Температурный датчик
            return null;

        case 'LAMP': // Лампа
            if (device.features.BRIGHTNESS !== undefined && device.features.COLOR_TEMP !== undefined) {
                return `${device.features.BRIGHTNESS}%`;
            } else if (device.features.BRIGHTNESS !== undefined) {
                return `${device.features.BRIGHTNESS}%`;
            } else if (device.features.COLOR !== undefined) {
                return `Цвет: ${device.features.COLOR}`;
            }
            return device.status === 'ON' ? 'Вкл.' : 'Выкл.';

        case 'FAN': // Вентилятор
            return device.status === 'ON' ? 'Вкл.' : 'Выкл.';

        case 'LEAK': // Датчик протечки
            return device.status === 'ALERT' ? 'Обнаружена протечка' : 'В норме';

        case 'VALVE': // Клапан
            return device.status === 'OPENED' ? 'Открыт' : 'Закрыт';

        case 'THERMOSTAT': // Термостат
            const current = device.features.CURRENT_TEMP;
            const target = device.features.TARGET_TEMP;
            if (current !== undefined && target !== undefined) {
                if (current < target) return `Подогрев до ${target}°C`;
                if (current > target) return `Охлаждение до ${target}°C`;
                return concise ? "Поддержание" : 'Поддержание температуры';
            }
            return 'Нет данных';

        case 'AC': // Термостат
            const currentAC = device.features.CURRENT_TEMP;
            const targetAC = device.features.TARGET_TEMP;
            if (currentAC !== undefined && targetAC !== undefined) {
                if (currentAC < targetAC) return `Подогрев до ${target}°C`;
                if (currentAC > targetAC) return `Охлаждение до ${target}°C`;
                return concise ? "Поддержание" : 'Поддержание температуры';
            }
            return 'Нет данных';

        case 'HUMIDIFIER': // Увлажнитель
            const currentHum = device.features.CURRENT_HUM;
            const targetHum = device.features.TARGET_HUM;
            if (concise) return `${currentHum || 0}% влажности`;
            return `Цель: ${targetHum || 0}%, текущая: ${currentHum || 0}%`;

        case 'CAMERA': // Камера
            if (device.features.RECORDING && device.status === 'ON') {
                return 'Запись активна';
            }
            return device.status === 'ON' ? 'Камера включена' : 'Камера выключена';

        case 'ROBOT': // Робот-пылесос
            return device.status === 'CLEANING'
                ? 'Уборка'
                : device.status === 'CHARGING'
                    ? 'Зарядка'
                    : 'Ожидание';

        default:
            return 'Неизвестное устройство';
    }
}



export function renderItemName(device) {
    const [mainType] = device.type.split('_');

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

            if (mainType === 'LEAK') {
                return <Drop size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            if (mainType === 'FAN') {
                return <Fan size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            return null;
        }
    } else {
        return null;
    }
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
        default:
            return false;
    }
}