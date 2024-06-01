import api from "./index";

export const getMyReferredUsers = async (page, limit) => {
  try {
    const { data } = await api.get(`/referrals?page=${page}&limit=${limit}`);

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getCommissionDetails = async () => {
  try {
    const { data } = await api.get("/referrals/commission-details");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
