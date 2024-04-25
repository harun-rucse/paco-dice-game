import api from "./index";

export const login = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const register = async ({ email, password, promoCode }) => {
  try {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      promoCode,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const logout = async () => {
  try {
    const { data } = await api.post("/auth/logout");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/current-user");

    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const { data } = await api.post("/auth/forgot-password", {
      email,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const resetPassword = async ({ password, resetToken }) => {
  try {
    const { data } = await api.patch(`/auth/reset-password/${resetToken}`, {
      password,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const passwordChange = async ({ currentPassword, password }) => {
  try {
    const { data } = await api.patch("/auth/update-password", {
      currentPassword,
      password,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const profileUpdate = async ({ username, email }) => {
  try {
    const { data } = await api.patch("/auth/profile", {
      username,
      email,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
