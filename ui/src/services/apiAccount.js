import axios from "axios";
const API_URL = import.meta.env.VITE_BASE_API_URL;

export const withdraw = async ({ paymentType, amount, address }) => {
  try {
    const { data } = await axios.patch(
      `${API_URL}/account/withdraw`,
      {
        paymentType,
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
