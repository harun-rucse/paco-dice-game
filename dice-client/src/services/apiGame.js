import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_API_URL;

export const createGame = async ({
  paymentType,
  betAmount,
  prediction,
  rollType,
}) => {
  console.log(betAmount);
  try {
    const { data } = await axios.post(
      `${API_URL}/games`,
      {
        paymentType,
        betAmount,
        prediction,
        rollType,
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

export const getGamesHistory = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/games`, {
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
