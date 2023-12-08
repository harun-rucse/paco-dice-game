import api from "./index";

export const withdraw = async ({ paymentType, amount, address }) => {
  try {
    const { data } = await api.post("/account/withdraw", {
      tokenName: paymentType,
      amount,
      address,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllWithdraws = async (page = 1, limit = 10) => {
  try {
    const { data } = await api.get(
      `/account/withdraws?page=${page}&limit=${limit}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const approveWithdraw = async ({ id, status, manual = "no" }) => {
  try {
    const { data } = await api.patch(`/account/approve-withdraw/${id}`, {
      status,
      manual,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllWithdrawables = async (page = 1, limit = 10) => {
  try {
    const { data } = await api.get(
      `/account/withdrawables?page=${page}&limit=${limit}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const claimWithdrawable = async ({ id }) => {
  try {
    const { data } = await api.patch(`/account/confirm-withdrawable/${id}`, {});

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStats = async () => {
  try {
    const { data } = await api.get("/account/stats", {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("jwt-token")) || ""
        }`,
      },
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getWithdrawableStats = async () => {
  try {
    const { data } = await api.get("/account/withdrawable-stats", {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("jwt-token")) || ""
        }`,
      },
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getUserTransactions = async (type, page = 1, limit = 10) => {
  try {
    const { data } = await api.get(
      `/account/user-transactions/${type}?page=${page}&limit=${limit}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const createWithdrawable = async ({ trxId }) => {
  try {
    const { data } = await api.post("/account/withdrawable", {
      trxId,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const createManualDeposit = async ({ trxId }) => {
  try {
    const { data } = await api.post("/account/manual-deposit", {
      trxId,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
