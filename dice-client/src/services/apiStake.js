import api from "./index";

export const createStake = async ({ amount, tokenName = "paco" }) => {
  try {
    const { data } = await api.post("/stakes", {
      amount,
      tokenName,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStakePayouts = async () => {
  try {
    const { data } = await api.get("/stakes/payouts");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStakePool = async () => {
  try {
    const { data } = await api.get("/stakes/pool");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStakeCalculator = async (paco) => {
  try {
    const { data } = await api.get(`/stakes/calculator/?paco=${paco}`);

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const claimStakeReward = async () => {
  try {
    const { data } = await api.post("/stakes/claim");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const unStake = async ({ amount }) => {
  try {
    const { data } = await api.post("/stakes/unstake", { amount });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const resetBurn = async () => {
  try {
    const { data } = await api.post("/stakes/reset-burn");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getStakeHistories = async (page, limit, date, type) => {
  try {
    const { data } = await api.get(
      `/stakes/stake-histories?page=${page}&limit=${limit}&date=${date}&type=${type}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
