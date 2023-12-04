import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_API_URL;

export const withdraw = async ({ paymentType, amount, address }) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/account/withdraw`,
      {
        tokenName: paymentType,
        amount,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllWithdraws = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/account/withdraws?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const approveWithdraw = async ({ id, status }) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/account/approve-withdraw/${id}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllWithdrawables = async (page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/account/withdrawables?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const claimWithdrawable = async ({ id }) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/account/confirm-withdrawable/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStats = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/account/stats`, {
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
    const { data } = await axios.get(`${API_URL}/account/withdrawable-stats`, {
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
    const { data } = await axios.get(
      `${API_URL}/account/user-transactions/${type}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const createWithdrawable = async ({ trxId }) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/account/withdrawable`,
      {
        trxId,
      },
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("jwt-token")) || ""
          }`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
