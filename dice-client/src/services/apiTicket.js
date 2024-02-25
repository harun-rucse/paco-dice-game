import api from "./index";

export const buyTicket = async ({ type, amount }) => {
  try {
    const { data } = await api.post("/tickets", {
      type,
      amount,
    });

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getTicketSetting = async () => {
  try {
    const { data } = await api.get("/tickets/setting");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getMyTickets = async (page = 1, limit = 10, round = 1) => {
  try {
    const { data } = await api.get(
      `/tickets/my-tickets?page=${page}&limit=${limit}&round=${round}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getLastRound = async () => {
  try {
    const { data } = await api.get("/tickets/last-round");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getMyHistories = async (
  page = 1,
  limit = 10,
  round = 1,
  type = "all"
) => {
  try {
    const { data } = await api.get(
      `/tickets/my-histories?page=${page}&limit=${limit}&round=${round}&type=${type}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllBets = async (
  page = 1,
  limit = 10,
  round = 1,
  type = "all"
) => {
  try {
    const { data } = await api.get(
      `/tickets/all-bets?page=${page}&limit=${limit}&round=${round}&type=${type}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getTicketStatistics = async () => {
  try {
    const { data } = await api.get("/tickets/statistics");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getMyTicketsCount = async () => {
  try {
    const { data } = await api.get("/tickets/my-tickets-count");

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};
