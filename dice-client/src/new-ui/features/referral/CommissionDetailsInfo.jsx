import useGetCoinPrice from "../../../hooks/useGetCoinPrice";
import { multiply } from "../../../utils/decimal";
import LoadingSpinner from "../../components/LoadingSpinner";
import SingleToken from "./SingleToken";

function CommissionDetailsInfo({ value, isLoading, className }) {
  const { btc, paco, eth, bnb, usdt } = value;
  const { isLoading: isGetting, price } = useGetCoinPrice();

  return (
    <div className="bg-[#15142d] dark:bg-[#211633] border border-[#CDA645] rounded-lg p-4 w-[14rem] tablet:w-[16rem] space-y-2">
      {isLoading || isGetting ? (
        <LoadingSpinner className="h-[16rem]" />
      ) : (
        <>
          <SingleToken
            icon="/tokens/btc.png"
            title={btc}
            subTitle={multiply(btc, price.btc)}
            name="WBTC"
            className={className}
          />
          <SingleToken
            icon="/tokens/paco.png"
            title={paco}
            subTitle={multiply(paco, price.paco)}
            name="PACO"
            className={className}
          />
          <SingleToken
            icon="/tokens/eth.png"
            title={eth}
            subTitle={multiply(eth, price.eth)}
            name="ETH"
            className={className}
          />
          <SingleToken
            icon="/tokens/bnb.png"
            title={bnb}
            subTitle={multiply(bnb, price.bnb)}
            name="WBNB"
            className={className}
          />
          <SingleToken
            icon="/tokens/usdt.png"
            title={usdt}
            subTitle={multiply(usdt, price.usdt)}
            name="USDT"
            className={className}
          />
        </>
      )}
    </div>
  );
}

export default CommissionDetailsInfo;
