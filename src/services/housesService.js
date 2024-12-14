// housesService.js
import { getHousesData } from '../api/housesAPI';
import { addHouseRequest, addFloorRequest, addRoomRequest } from './housesAPI';
import { setHouse, addFloor, addRoom } from './housesSlice';

// Добавление дома
export const addHouse = async (dispatch, token, name, coordinates) => {
    try {
        const result = await addHouseRequest(token, name, coordinates);
        dispatch(setHouse({ id: result.data.id, data: result.data, status: result.status }));
        return result.data;
    } catch (error) {
        console.error('Ошибка при добавлении дома:', error);
        throw error;
    }
};

// Добавление этажа
export const addFloor = async (dispatch, token, name, houseId) => {
    try {
        const result = await addFloorRequest(token, name, houseId);
        dispatch(addFloor({ houseId, floor: result.data }));
        return result.data;
    } catch (error) {
        console.error('Ошибка при добавлении этажа:', error);
        throw error;
    }
};

// Добавление комнаты
export const addRoom = async (dispatch, token, name, floorId) => {
    try {
        const result = await addRoomRequest(token, name, floorId);
        dispatch(addRoom({ houseId: null, floorId, room: result.data })); // Добавьте корректный houseId
        return result.data;
    } catch (error) {
        console.error('Ошибка при добавлении комнаты:', error);
        throw error;
    }
};

export const fetchHousesData = async (dispatch, token) => {
    try {
        const houses = await getHousesData(token);

        houses.forEach(house => {
            // Добавить дом
            dispatch(setHouse({ id: house.id, data: house }));

            // Добавить этажи
            house.floors.forEach(floor => {
                dispatch(addFloor({ houseId: house.id, floor }));

                // Добавить комнаты
                floor.rooms.forEach(room => {
                    dispatch(addRoom({ houseId: house.id, floorId: floor.id, room }));
                });
            });
        });
    } catch (error) {
        console.error('Ошибка при получении данных о домах:', error);
        throw error;
    }
};
