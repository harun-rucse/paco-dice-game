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

export const getMyTickets = async () => {
  try {
    const { data } = await api.get(`/tickets/my-tickets`);

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

export const getMyHistories = async (round = 1, type = "winning") => {
  try {
    const { data } = await api.get(
      `/tickets/my-histories?round=${round}&type=${type}`
    );

    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.message);
  }
};

export const getAllBets = async (round = 1) => {
  try {
    const { data } = await api.get(`/tickets/all-bets?round=${round}`);

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
