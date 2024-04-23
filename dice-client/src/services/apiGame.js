import api from "./index";

export const createGame = async ({
  paymentType,
  betAmount,
  prediction,
  rollType,
}) => {
  try {
    const { data } = await api.post("/games", {
      paymentType,
      betAmount,
      prediction,
      rollType,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getGamesHistory = async () => {
  try {
    const { data } = await api.get("/games");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getBetHistories = async (page, limit, type = "All Bets") => {
  try {
    const { data } = await api.get(
      `/games/bet-histories?page=${page}&limit=${limit}&type=${type}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
