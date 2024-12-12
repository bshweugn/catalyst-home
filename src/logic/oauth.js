import { registerUserAPI } from "../api/oauth";

export const registerUser = async (username, email, password) => {
    console.log("DDDD")
    const userData = { username, email, password };

    try {
      const result = await registerUserAPI(userData);

      if (result.token) {
        localStorage.setItem('token', result.token);
        return(result.token);
      } else {
        return(result.response?.message || 'Something went wrong');
      }
    } catch (error) {
      return('Registration failed. Please try again.');
    }
  };