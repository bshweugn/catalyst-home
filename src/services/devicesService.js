import { checkDeviceRequest, deleteDeviceRequest, importDeviceRequest, syncDevicesRequest } from "../api/devicesAPI";
import { setDevice, removeDevice } from "../store";

export const addDevice = async (dispatch, token, deviceData) => {
    try {
        const result = await importDeviceRequest(token, deviceData);
        dispatch(setDevice({ id: result.data.id, data: result.data, status: result.status }));
        return result;
    } catch (error) {
        console.error('Ошибка при добавлении устройства:', error);
    }
};

export const deleteDevice = async (dispatch, token, id) => {
    try {
        await deleteDeviceRequest(token, id);
        dispatch(removeDevice({ id }));
    } catch (error) {
        console.error('Ошибка при удалении устройства:', error);
    }
};

export const syncDevices = async (dispatch, token) => {
    try {
        const result = await syncDevicesRequest(token);
        result.data.forEach((device) => {
            dispatch(setDevice({ id: device.id, data: device, status: result.status }));
        });
    } catch (error) {
        console.error('Ошибка при синхронизации устройств:', error);
    }
};

export const checkDevice = async (dispatch, token, serialNumber) => {
    try {
        const result = await checkDeviceRequest(token, { serialNumber });
        if (result.json) {
            return result.json;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка при проверке устройства:', error);
        throw new Error('Ошибка при запросе устройства.');
    }
};


export const getDevicesByHouseId = (houses, houseId) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с id ${houseId} не найден.`);
        return [];
    }

    const devices = house.floors.flatMap(floor =>
        floor.rooms.flatMap(room => room.devices || [])
    );

    return devices;
};

export const getCamerasByHouseId = (houses, houseId) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с id ${houseId} не найден.`);
        return [];
    }

    const devices = house.floors.flatMap(floor =>
        floor.rooms.flatMap(room => room.cameras || [])
    );

    return devices;
};

export const getDevicesByIdsInRooms = (devicesIds, rooms) => {
    const allDevices = [];

    rooms.forEach(room => {

        const devices = room.devices || [];

        devices.forEach(device => {
            if (devicesIds.includes(device.id)) {
                if (device.type !== 'camera') {
                    allDevices.push(device);
                }
            }
        });
    });

    if (allDevices.length === 0) {
        console.warn('Не найдено ни одного устройства по указанным ID.');
    }

    return allDevices;
};

export const getDevicesAndCamerasByRoomAndHouseId = (houseId, roomId, houses) => {
    console.log(`Ищем дом с ID: ${houseId}`);

    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с ID ${houseId} не найден.`);
        return [];
    }
    console.log(`Найден дом: ${house.name}`);

    if (!house.floors || house.floors.length === 0) {
        console.warn(`В доме с ID ${houseId} нет этажей.`);
        return [];
    }

    let room = null;

    house.floors.forEach(floor => {
        if (!floor.rooms || floor.rooms.length === 0) {
            return;
        }

        const foundRoom = floor.rooms.find(r => r.id === roomId);
        if (foundRoom) {
            room = foundRoom;
        }
    });

    if (!room) {
        console.warn(`Комната с ID ${roomId} не найдена в доме с ID ${houseId}.`);
        return [];
    }

    console.log(`Найдена комната: ${room.name}`);

    const devices = room.devices || [];
    const cameras = room.cameras || [];

    if (devices.length === 0 && cameras.length === 0) {
        console.warn(`В комнате с ID ${roomId} нет устройств или камер.`);
    }

    return [...devices, ...cameras];
};
