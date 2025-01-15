const API_URL = 'http:/192.168.31.47:8080/api';

export const checkDeviceAPI = async (token, serialNumber) => {
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



export const importDeviceAPI = async (token, data) => {
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


