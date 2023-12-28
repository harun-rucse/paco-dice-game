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
