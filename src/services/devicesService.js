import { checkDeviceRequest, deleteDeviceRequest, executeDeviceCommandRequest, importDeviceRequest, moveDeviceToRoomRequest, syncDevicesRequest } from "../api/devicesAPI";
import { setDevice, removeDevice } from "../store";

export const addDevice = async (dispatch, token, deviceData) => {
    try {
        const result = await importDeviceRequest(token, deviceData);
        if (result) {
            dispatch(setDevice({ id: result.data.id, data: result.data }));
        }
        return result;
    } catch (error) {
        console.error('Ошибка при добавлении устройства:', error);
        throw error;
    }
};


export const deleteDevice = async (token, id, houseId, isDevice, dispatch) => {
    try {
        const result = await deleteDeviceRequest(token, id, houseId, isDevice);
        if (result) {
            // dispatch(removeDevice({ id }));
        }
        return result;
    } catch (error) {
        console.error('Ошибка при удалении устройства:', error);
        throw error;
    }
};


export const syncDevices = async (dispatch, token) => {
    try {
        const result = await syncDevicesRequest(token);
        if (result?.data) {
            result.data.forEach((device) => {
                dispatch(setDevice({ id: device.id, data: device }));
            });
        }
    } catch (error) {
        console.error('Ошибка при синхронизации устройств:', error);
        throw error;
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

export const getDeviceById = (deviceId, houses) => {
    console.log(`Ищем устройство с ID: ${deviceId}`);

    for (const house of houses) {
        if (!house.floors || house.floors.length === 0) {
            continue;
        }

        for (const floor of house.floors) {
            if (!floor.rooms || floor.rooms.length === 0) {
                continue;
            }

            for (const room of floor.rooms) {
                const device = room.devices?.find(d => d.id === deviceId);
                if (device) {
                    console.log(`Найдено устройство: ${device.name}`);
                    return device;
                }
            }
        }
    }

    console.warn(`Устройство с ID ${deviceId} не найдено.`);
    return null; // Возвращаем null, если устройство не найдено
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


export const moveDeviceToRoom = async (token, deviceId, roomId, isCamera) => {
    try {
        const result = await moveDeviceToRoomRequest(token, deviceId, roomId, isCamera);
        if (result) {
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка при перемещении устройства: ', error);
        throw error;
    }
};


export const executeDeviceCommand = async (token, deviceId, command, argument) => {
    try {
        const result = await executeDeviceCommandRequest(token, deviceId, command, argument);
        if (result) {
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Не удалось отправить команду:', error);
        throw new Error('Не удалось отправить команду.');
    }
}