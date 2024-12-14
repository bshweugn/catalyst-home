import { checkDeviceAPI, importDeviceAPI } from "../api/devices";

export const checkDevice = async (token, serialNumber) => {

  try {
    const result = await checkDeviceAPI(token, { serialNumber });

    if (result.json) {
      return (result.json);
    } else {
      return (result.response?.message || 'Ошибка.');
    }
  } catch (error) {
    return ('Ошибка.');
  }
};

export const importDevice = async (token, serialNumber, name, roomId) => {

  try {
    const result = await importDeviceAPI(token, { serialNumber, name, roomId });

    if (result.json) {
      return (result.data);
    } else {
      return (result.response?.message || 'Ошибка.');
    }
  } catch (error) {
    return ('Ошибка.');
  }
};
