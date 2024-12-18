const API_URL = 'http://94.228.115.5:8080';

// Запрос на добавление дома
export const addHouseRequest = async (token, name, coordinates) => {
    const response = await fetch(`${API_URL}/api/user/addHouse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, ...coordinates }),
    });
    if (!response.ok) throw new Error('Ошибка добавления дома.');
    return response.json();
};

// Запрос на добавление этажа
export const addFloorRequest = async (token, name, houseId) => {
    const response = await fetch(`${API_URL}/api/user/addFloor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, houseId }),
    });
    if (!response.ok) throw new Error('Ошибка добавления этажа.');
    return response.json();
};

// Запрос на добавление комнаты
export const addRoomRequest = async (token, name, floorId) => {
    const response = await fetch(`${API_URL}/api/user/addRoom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, floorId }),
    });
    if (!response.ok) throw new Error('Ошибка добавления комнаты.');
    return response.json();
};




// Получить данные о домах
export const getHousesData = async (token) => {
    const response = await fetch(`${API_URL}/api/data/house`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Ошибка получения данных о домах.');
    return response.json();
};