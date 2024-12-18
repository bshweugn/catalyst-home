import { getMyInfoAPI } from "../api/oauth";
import { setDevice, removeDevice } from "../store";

export const getMyInfo = async (token) => {
    try {
        const result = await getMyInfoAPI(token);
        if (result) {
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка:', error);
        throw new Error('Ошибка.');
    }
};