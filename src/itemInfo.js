import Drop from "./components/icons/Drop/Drop";
import Lightbulb from "./components/icons/Lightbulb/Lightbulb";
import Thermometer from "./components/icons/Thermometer/Thermometer";

export function renderItemStatus(device, concise) {
    if (device.type === 'LAMP') {
        return device.dimmable ? `${device.dim}%` : device.status === 'ON' ? "Вкл." : "Выкл.";
    }

    if (device.type === 'THERMOSTAT') {
        return device.currentTemp < device.targetTemp ? `Подогрев до ${device.targetTemp}°`
            : device.currentTemp === device.targetTemp ? 'Поддержание температуры'
                : `Охлаждение до ${device.targetTemp}°`;
    }

    if (device.type === 'VALVE') {
        return device.status === "OPENED" ? "Открыто" : "Закрыто"
    }

    if (device.type === 'LEAK_SENSOR') {
        if (device.status == 'NORMAL') {
            return "В норме";
        } else if (device.status == 'ALERT') {
            return "Обнаружена протечка";
        }
    }
}

export function renderItemName(device) {
    if (device.type === 'LAMP') {
        return "Умная лампа";
    }

    if (device.type === 'THERMOSTAT') {
        return "Термостат"
    }

    if (device.type === 'VALVE') {
        return "Умный клапан"
    }

    if (device.type === 'LEAK_SENSOR') {
        return "Датчик протечки"
    }
}

export function renderItemIcon(device, displayText, size, className) {

    if (device !== undefined) {
        if (device.currentTemp !== undefined) {
            if (displayText) {
                return <p className={`item-card__temp`}>{device.currentTemp}°</p>;
            } else {
                return <p className={`item-card__temp--small`}>{device.currentTemp}°</p>;
            }
        } else {
            if (device.type === 'LAMP') {
                return <Lightbulb size={(size ? size : "1.6rem")} fill="#ffbf0d" className={className} />
            }

            if (device.type === 'LEAK_SENSOR') {
                return <Drop size={(size ? size : "1.6rem")} fill="#1290ff" className={className} />
            }

            return null;
        }
    } else {
        return null;
    }
}