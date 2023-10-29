import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_API_URL;

export const login = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("jwt-token", JSON.stringify(data));
    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const register = async ({ email, password, promoCode }) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      promoCode,
    });

    localStorage.setItem("jwt-token", JSON.stringify(data));
    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/current-user`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("jwt-token")) || ""
        }`,
      },
    });

    console.log(res);

    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
