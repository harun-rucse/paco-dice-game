import { useEffect, useState } from "react";
import { multiply } from "../../../utils/decimal";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";

export function useGetUsdPricePaco(value = 0) {
  const [pacoUSD, setPacoUSD] = useState(0);
  const { price, isLoading } = useGetCoinPrice();

  useEffect(() => {
    const convertInUSDPrice = async () => {
      const pacoPrice = await price["paco"];
      const pacoUSD = multiply(pacoPrice, value);

      setPacoUSD(pacoUSD);
    };

    if (price) convertInUSDPrice();
  }, [value, isLoading]);

  return { pacoUSD };
}
