const API_URL = 'http://192.168.31.47:8080/api';


export const getCameraStreamURL = (cameraId, timestamp) => {
    return `${API_URL}/camera/stream?cameraId=${cameraId}&timestamp=${timestamp}`;
};

export const getCameraStreamRequest = async (token, cameraId, timestamp) => {
    try {
        const url = getCameraStreamURL(cameraId, timestamp);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка получения стрима: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const executeCameraCommandRequest = async (token, cameraId, command, argument) => {
    try {
        const response = await fetch(`${API_URL}/user/executeCameraCommand`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: command,
                argument: argument,
                deviceId: cameraId
            })
        });

        if (!response.ok) {
            throw new Error('Не удалось отправить команду.');
        }

        return await response.json();
    } catch (error) {
        console.error('Не удалось отправить команду:', error);
        throw error;
    }
};