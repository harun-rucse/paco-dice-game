import { useEffect, useState } from "react";
import { getCoinPrice } from "../../utils/tokenPrice";
import { multiply } from "../../utils/decimal";

export function useGetUsdPricePaco(value = 0) {
  const [pacoUSD, setPacoUSD] = useState(0);

  useEffect(() => {
    const convertInUSDPrice = async () => {
      const pacoPrice = await getCoinPrice("paco");
      const pacoUSD = multiply(pacoPrice, value);

      setPacoUSD(pacoUSD);
    };

    convertInUSDPrice();
  }, [value]);

  return { pacoUSD };
}
