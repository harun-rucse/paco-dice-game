import { useState } from "react";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";
import { multiply } from "../../../utils/decimal";
import {
  abbreviateNumber,
  currencyFormat,
  numberFormat,
} from "../../../utils/format";
import LoadingSpinner from "../../components/LoadingSpinner";
import SingleToken from "./SingleToken";
import useGetCommissionDetails from "./useGetCommissionDetails";

function TokenCommissionCard({ title, tokens, price }) {
  return (
    <div className="space-y-1">
      <p>{title}</p>
      <div className="bg-[#1d1b3e] dark:bg-[#1e1a2c] border border-[#1a1837] rounded-2xl shadow-[-1px_2px_5px_-1px_rgba(0,0,0,0.75)] px-5 py-3 h-[17rem] tablet:h-[20rem] space-y-2">
        {tokens.map((token, i) => (
          <SingleToken
            key={i}
            icon={token.icon}
            title={token.title}
            subTitle={multiply(token.title, price?.[token.coin])}
            name={token.name}
          />
        ))}
      </div>
    </div>
  );
}

function CommissionCard({ title, icon, name, value, amount }) {
  return (
    <div className="space-y-1">
      <p>{title}</p>
      <div className="bg-[#1d1b3e] dark:bg-[#1e1a2c] shadow-[-1px_2px_5px_-1px_rgba(0,0,0,0.75)] flex flex-col items-center justify-center rounded-2xl px-5 py-3 h-[17rem] tablet:h-[20rem] space-y-2">
        <div className="flex flex-col items-center">
          <img src={icon} alt="" className="w-16" />
          <span className="text-gray-400">{name}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg">
            {value === "0" ? 0 : abbreviateNumber(Number(value), 2)}
          </span>
          <span className="text-xs text-gray-400">
            {currencyFormat(amount)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CommissionDetails() {
  const [isLoading] = useState(false);
  const { isLoading: isFetching, price } = useGetCoinPrice();
  const { isLoading: isFetchingDetails, data } = useGetCommissionDetails();

  const gamingTokens = [
    {
      icon: "/tokens/btc.png",
      title: data?.gaming?.btc,
      name: "WBTC",
      coin: "btc",
    },
    {
      icon: "/tokens/paco.png",
      title: data?.gaming?.paco,
      name: "PACO",
      coin: "paco",
    },
    {
      icon: "/tokens/eth.png",
      title: data?.gaming?.eth,
      name: "ETH",
      coin: "eth",
    },
    {
      icon: "/tokens/bnb.png",
      title: data?.gaming?.bnb,
      name: "WBNB",
      coin: "bnb",
    },
    {
      icon: "/tokens/usdt.png",
      title: data?.gaming?.usdt,
      name: "USDT",
      coin: "usdt",
    },
  ];

  const stakingTokens = [
    {
      icon: "/tokens/btc.png",
      title: data?.staking?.btc,
      name: "WBTC",
      coin: "btc",
    },
    {
      icon: "/tokens/paco.png",
      title: data?.staking?.paco,
      name: "PACO",
      coin: "paco",
    },
    {
      icon: "/tokens/eth.png",
      title: data?.staking?.eth,
      name: "ETH",
      coin: "eth",
    },
    {
      icon: "/tokens/bnb.png",
      title: data?.staking?.bnb,
      name: "WBNB",
      coin: "bnb",
    },
    {
      icon: "/tokens/usdt.png",
      title: data?.staking?.usdt,
      name: "USDT",
      coin: "usdt",
    },
  ];

  return (
    <div className="p-2 space-y-4 bg-[#1f1e3e] dark:bg-[#2b2345]">
      <h4 className="text-xl">Commission Earnings</h4>
      {isFetching || isLoading || isFetchingDetails ? (
        <LoadingSpinner className="h-[23rem]" />
      ) : (
        <div className="grid tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-5 gap-5 pb-6">
          <TokenCommissionCard
            title="Gaming"
            tokens={gamingTokens}
            price={price}
          />
          <TokenCommissionCard
            title="Staking"
            tokens={stakingTokens}
            price={price}
          />

          <CommissionCard
            title="Faucet"
            icon="/images/paco.png"
            name="PACO"
            value={data?.faucet?.paco}
            amount={multiply(data?.faucet?.paco, price.paco)}
          />
          <CommissionCard
            title="Lottery"
            icon="/images/paco.png"
            name="PACO"
            value={data?.lottery?.paco}
            amount={multiply(data?.lottery?.paco, price.paco)}
          />
          <CommissionCard
            title="Mined Tokens"
            icon="/images/paco.png"
            name="PACO"
            value={data?.mined?.paco}
            amount={multiply(data?.mined?.paco, price.paco)}
          />
        </div>
      )}

      <div className="bg-[#1d1b3e] dark:bg-[#1e1a2c] shadow-[-1px_2px_5px_-1px_rgba(0,0,0,0.75)] p-4 rounded-xl space-y-4">
        <h4 className="text-xl">Commission Details</h4>
        <div className="flex flex-wrap items-center justify-center text-[#4c4a8b] dark:text-[#5f5680] gap-x-6 gap-y-3 desktop:px-48">
          <span className="text-base tablet:text-xl">
            *0.125%* of every bet
          </span>
          <span className="text-base tablet:text-xl">
            *3%* of their mined tokens
          </span>
          <span className="text-base tablet:text-xl">
            *1%* of tokens claimed in the faucet
          </span>
          <span className="text-base tablet:text-xl">
            *0.1%* of lottery tickets purchased
          </span>
          <span className="text-base tablet:text-xl">
            *0.1%* of staking rewards earned
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommissionDetails;
