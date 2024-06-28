import api from "./index";

export const getMyFaucet = async () => {
  try {
    const { data } = await api.get("/faucet/my");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const claimFaucetReward = async (reward) => {
  try {
    const { data } = await api.post("/faucet/claim-reward", { reward });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const gambleReward = async (reward) => {
  try {
    const { data } = await api.post("/faucet/gamble-reward", { reward });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getFaucetTournament = async () => {
  try {
    const { data } = await api.get("/faucet/tournament");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
