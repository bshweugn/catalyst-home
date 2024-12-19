// housesService.js
import { addFloorRequest, addHouseRequest, addRoomRequest, deleteRoomRequest, getHousesData, moveRoomToFloorRequest, renameRequest } from '../api/housesAPI';
import { setFloor, setHouse, setRoom } from '../store';


export const createHouse = async (dispatch, token, name, coordinates) => {
    try {
        const result = await addHouseRequest(token, name, coordinates);
        dispatch(setHouse({ id: result.data.id, data: result.data, status: result.status }));
        return result.data;
    } catch (error) {
        console.error('Ошибка при добавлении дома:', error);
        throw error;
    }
};

export const createFloor = async (dispatch, token, name, houseId) => {
    try {
        const result = await addFloorRequest(token, name, houseId);
        dispatch(setFloor({ houseId, floor: result.data }));
        return result.data;
    } catch (error) {
        console.error('Ошибка при добавлении этажа:', error);
        throw error;
    }
};

export const createRoom = async (dispatch, token, name, floorId) => {
    try {
        const result = await addRoomRequest(token, name, floorId);
        // dispatch(setRoom({ houseId: null, floorId, room: result.data }));
        return result;
    } catch (error) {
        console.error('Ошибка при добавлении комнаты:', error);
        throw error;
    }
};

export const deleteRoom = async (token, roomId) => {
    try {
        const result = await deleteRoomRequest(token, roomId);
        return result;
    } catch (error) {
        console.error('Ошибка при удалении комнаты:', error);
        throw error;
    }
};

export const moveRoomToFloor = async (token, roomId, floorId) => {
    try {
        const result = await moveRoomToFloorRequest(token, roomId, floorId);
        return result;
    } catch (error) {
        console.error('Ошибка при перемещении комнаты:', error);
        throw error;
    }
};


export const rename = async (token, id, newName, entity) => {
    try {
        const result = await renameRequest(token, id, newName, entity);
        return result;
    } catch (error) {
        console.error('Ошибка при переименовании:', error);
        throw error;
    }
};


export const fetchHousesData = async (token) => {
    try {
        const houses = await getHousesData(token);
        return houses;
    } catch (error) {
        console.error('Ошибка при получении данных о домах:', error);
        throw error;
    }
};

const getDevicesByHouseAndRoomId = (houseId, roomId, houses) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с id ${houseId} не найден.`);
        return [];
    }

    for (const floor of house.floors) {
        const room = floor.rooms.find(r => r.id === roomId);
        if (room) {
            return room.devices || [];
        }
    }

    console.error(`Комната с id ${roomId} не найдена в доме с id ${houseId}.`);
    return [];
};

export const getRoomsAndDevicesByHouseId = (houseId, houses) => {
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

    const roomsWithDevices = [];
    const seenRoomNames = new Set();

    house.floors.forEach(floor => {
        console.log(`Обрабатываем этаж: ${floor.name} (ID: ${floor.id})`);
        if (!floor.rooms || floor.rooms.length === 0) {
            console.warn(`На этаже ${floor.name} (ID: ${floor.id}) нет комнат.`);
            return;
        }

        floor.rooms.forEach(room => {
            const hasDevices = (room.devices && room.devices.length > 0);
            const hasCameras = (room.cameras && room.cameras.length > 0);

            // if (!hasDevices && !hasCameras) {
            //     console.warn(`Комната "${room.name}" (ID: ${room.id}) пуста и будет исключена.`);
            //     return;
            // }

            if (seenRoomNames.has(room.name)) {
                console.warn(`Комната с именем "${room.name}" уже обработана, пропускаем.`);
                return;
            }
            seenRoomNames.add(room.name);

            console.log(`Добавляем комнату: ${room.name} (ID: ${room.id})`);
            roomsWithDevices.push({
                id: room.id,
                name: room.name,
                devices: room.devices || [],
                cameras: room.cameras || []
            });
        });
    });

    if (roomsWithDevices.length === 0) {
        console.warn(`В доме с ID ${houseId} не найдено подходящих комнат.`);
    }

    return roomsWithDevices;
};

export const getAllDevicesByHouseId = (houseId, houses) => {
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

    const allDevicesAndCameras = [];

    house.floors.forEach(floor => {
        console.log(`Обрабатываем этаж: ${floor.name} (ID: ${floor.id})`);
        if (!floor.rooms || floor.rooms.length === 0) {
            console.warn(`На этаже ${floor.name} (ID: ${floor.id}) нет комнат.`);
            return;
        }

        floor.rooms.forEach(room => {
            const devices = room.devices || [];
            const cameras = room.cameras || [];

            if (devices.length > 0) {
                console.log(`Добавляем устройства из комнаты "${room.name}" (ID: ${room.id}):`, devices);
                allDevicesAndCameras.push(...devices);
            }

            if (cameras.length > 0) {
                console.log(`Добавляем камеры из комнаты "${room.name}" (ID: ${room.id}):`, cameras);
                allDevicesAndCameras.push(...cameras);
            }
        });
    });

    if (allDevicesAndCameras.length === 0) {
        console.warn(`В доме с ID ${houseId} не найдено ни устройств, ни камер.`);
    }

    return allDevicesAndCameras;
};


export const getRoomsByHouseId = (houseId, houses) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с id ${houseId} не найден.`);
        return [];
    }

    const allRooms = house.floors.reduce((rooms, floor) => {
        return rooms.concat(floor.rooms || []);
    }, []);

    return allRooms;
};


export const getFloorsByHouseId = (houseId, houses) => {
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        console.error(`Дом с id ${houseId} не найден.`);
        return [];
    }

    return house.floors || [];
};


export const getFloorByRoomId = (roomId, houses) => {
    for (const house of houses) {
        for (const floor of house.floors || []) {
            if (floor.rooms && floor.rooms.some(room => room.id === roomId)) {
                return floor;
            }
        }
    }

    console.error(`Этаж с комнатой id ${roomId} не найден.`);
    return null;
};



export const ensureFloorExists = async (dispatch, token, currentHouseId, houses) => {
    // Находим дом по ID
    const house = houses.find(h => h.id === currentHouseId);

    if (!house) {
        console.error(`Дом с ID ${currentHouseId} не найден.`);
        return;
    }

    // Проверяем наличие этажей в доме
    if (!house.floors || house.floors.length === 0) {
        console.log(`Этажи в доме с ID ${currentHouseId} отсутствуют. Создаём новый этаж...`);
        try {
            // Вызываем функцию создания этажа
            await createFloor(dispatch, token, "Основной", currentHouseId);
            console.log(`Этаж "Основной" успешно создан в доме с ID ${currentHouseId}.`);
        } catch (error) {
            console.error(`Ошибка при создании этажа в доме с ID ${currentHouseId}:`, error);
        }
    } else {
        console.log(`В доме с ID ${currentHouseId} уже есть этажи.`);
    }
};







