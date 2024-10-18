import Drop from "./components/icons/Drop/Drop";
import Lightbulb from "./components/icons/Lightbulb/Lightbulb";

export function renderItemStatus(device, concise){
    if (device.type === 'LAMP') {
        return device.dimmable ? `${device.dim}%` : device.status === 'ON' ? "Вкл." : "Выкл.";
    } 

    if (device.type === 'THERMOSTAT') {
        return device.currentTemp < device.targetTemp ? `Подогрев до ${device.targetTemp}°` 
            : device.currentTemp === device.targetTemp ? 'Поддержание температуры' 
            : `Охлаждение до ${device.targetTemp}°`;
    }

    if (device.type === 'LEAK_SENSOR') {
        if (device.status == 'NORMAL'){
            return "В норме";
        } else if (device.status == 'ALERT'){
            return "Обнаружена протечка";
        }
    }
}

export function renderItemIcon(device){

    if (device.currentTemp !== undefined) {
        return <p className={`item-card__temp`}>{device.currentTemp}°</p>;
    } else {
        if (device.type === 'LAMP') {
            return <Lightbulb size="1.6rem" fill="#FFD700" />
        }
        
        if (device.type === 'LEAK_SENSOR') {
            return <Drop size="1.6rem" fill="#1290ff" />
        }
    }
}