import api from "./index";

export const getBetHistories = async (page, limit) => {
  try {
    const { data } = await api.get(
      `/common/bet-histories?page=${page}&limit=${limit}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getCoinPrice = async () => {
  try {
    const { data } = await api.get("/common/coin-price");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
