const API_URL = 'http://192.168.31.47:8080/api';

export const importDeviceRequest = async (token, data) => {
    try {
        const response = await fetch(`${API_URL}/create/importDevice`, {
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

export const deleteDeviceRequest = async (token, id) => {
    try {
        const response = await fetch(`${API_URL}/delete/device/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
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
        const response = await fetch(`${API_URL}/create/checkDevice`, {
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