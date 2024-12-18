import { useDispatch } from "react-redux";
import { loginAPI, registerUserAPI } from "../api/oauth";
import { createFloor } from "../services/housesService";

export const registerUser = async (username, email, password) => {

  try {
    const result = await registerUserAPI({ username, email, password });

    if (result.token) {
      localStorage.setItem('token', result.token);
      return (result.token);
    } else {
      return (result.response?.message || 'Register error.');
    }
  } catch (error) {
    return ('Register error: ' + error);
  }
};

export const login = async (email, password) => {

  try {
    const result = await loginAPI({ email, password });

    if (result.token) {
      localStorage.setItem('token', result.token);
      return (result.token);
    } else {
      return (result.response?.message || 'Login error.');
    }
  } catch (error) {
    return ('Login error.');
  }
};

export const logout = async () => {
  localStorage.setItem('token', null);
  console.log("Logged out.")
};


export const getUserInfo = async (token) => {
  // const result = await getUserInfoAPI(token);
};