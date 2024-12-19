import { executeCameraCommandRequest, getCameraStreamRequest } from "../api/camerasAPI";

export const getCameraStream = async (token, cameraId, timestamp) => {
    try {
        const response = await getCameraStreamRequest(token, cameraId, timestamp);

        if (!response.ok) {
            throw new Error('Ошибка загрузки видео.');
        }

        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);

        return videoUrl; 
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const executeCameraCommand = async (token, cameraId, command, argument) => {
    try {
        const result = await executeCameraCommandRequest(token, cameraId, command, argument);
        if (result) {
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Не удалось отправить команду:', error);
        throw new Error('Не удалось отправить команду.');
    }
};