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

    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const resetPassword = async ({ password, resetToken }) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/auth/reset-password/${resetToken}`,
      {
        password,
      }
    );

    localStorage.setItem("jwt-token", JSON.stringify(data));

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const passwordChange = async ({ currentPassword, password }) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/auth/update-password`,
      {
        currentPassword,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    localStorage.removeItem("jwt-token");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
