const API_URL = 'http://94.228.115.5:8080';

export const registerUserAPI = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(userData),
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

export const loginAPI = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(userData),
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
export const getUserInfoAPI = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/data/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных пользователя: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка API:', error);
    throw error;
  }
};


export const getMyInfoAPI = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/local/getUserData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных пользователя: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка API:', error);
    throw error;
  }
};

