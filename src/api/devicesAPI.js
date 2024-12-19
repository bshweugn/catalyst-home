const API_URL = 'http://94.228.115.5:8080/api';

export const importDeviceRequest = async (token, data) => {
    try {
        const response = await fetch(`${API_URL}/device/importDevice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Ошибочка вышла');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибочка вышла:', error);
        throw error;
    }
};

export const deleteDeviceRequest = async (token, id, houseId, isDevice) => {
    try {
        const response = await fetch(`${API_URL}/device/deleteDevice`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deviceId: id,
                houseId: houseId,
                type: isDevice ? "DEVICE" : "CAMERA"
            })
        });

        if (!response.ok) {
            throw new Error('Не удалось удалить устройство');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении устройства:', error);
        throw error;
    }
};

export const syncDevicesRequest = async (token) => {
    try {
        const response = await fetch(`${API_URL}/sync/devices`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Не удалось синхронизировать устройства');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при синхронизации устройств:', error);
        throw error;
    }
};


export const checkDeviceRequest = async (token, serialNumber) => {
    try {
        const response = await fetch(`${API_URL}/device/checkDevice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(serialNumber),
        });

        if (!response.ok) {
            throw new Error('Ошибочка вышла');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибочка вышла:', error);
        throw error;
    }
};


export const moveDeviceToRoomRequest = async (token, deviceId, roomId, isCamera) => {
    const response = await fetch(`${API_URL}/modify/move`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id: deviceId,
            toId: roomId,
            entity: isCamera ? "CAMERA" : "DEVICE"
        }),
    });
    if (!response.ok) throw new Error('Ошибка перемещения устройства.');
    return response.json();
};