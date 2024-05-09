import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import useGetBetHistories from "./useGetBetHistories";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { formatTime } from "../../../utils";

function BetHistoryTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [selectedType, setSelectedType] = useState("All Bets");
  const { isLoading, result, count } = useGetBetHistories(limit, selectedType);
  const { isLoading: isLoading2, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }, [selectedType]);

  function formatColorChangeOfLeadingZero(val) {
    const [wholePart, decimalPart] = val.split(".");

    let count = 0;
    for (let i = decimalPart.length - 1; i >= 0; i--) {
      if (decimalPart[i] == 0) {
        count++;
      } else {
        break;
      }
    }

    return (
      <span>
        {`${wholePart}.${decimalPart.slice(0, decimalPart.length - count)}`}
        <span className="text-[#69686a]">
          {decimalPart.slice(decimalPart.length - count, decimalPart.length)}
        </span>
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <h2 className="uppercase text-base tablet:text-2xl">Bet history</h2>
        <div className="flex items-center">
          <button
            className={`${
              selectedType === "All Bets"
                ? "bg-[#8562b1] z-10"
                : "bg-[#442c62] z-0"
            } px-5 py-[0.2rem] uppercase focus:outline-none border-none text-sm tablet:text-lg rounded-xl`}
            onClick={() => setSelectedType("All Bets")}
          >
            All Bets
          </button>
          {!isLoading2 && isAuthenticated && (
            <button
              className={`-ml-3 ${
                selectedType === "My Bets"
                  ? "bg-[#8562b1] z-10"
                  : "bg-[#442c62] z-0"
              } px-5 py-[0.2rem] uppercase focus:outline-none border-none text-sm tablet:text-lg rounded-xl`}
              onClick={() => setSelectedType("My Bets")}
            >
              My Bets
            </button>
          )}
        </div>
      </div>
      <Table
        columns="grid-cols-[0.4fr_0.5fr_0.8fr_1fr_0.8fr_1fr_0.2fr] tablet:grid-cols-[0.5fr_0.6fr_1fr_1fr_0.9fr_1fr_0.5fr] laptop:grid-cols-[0.4fr_0.6fr_1fr_1fr_1fr_1fr_0.3fr] desktop:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_0.3fr]"
        className="min-w-[58rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs laptop:text-lg text-[#6c5b91] font-semibold dark:text-[#7968a0] border-[#131230]">
          <span>GAME</span>
          <span>TIME</span>
          <span>USER</span>
          <span>BET AMOUNT</span>
          <span>MULTIPLAYER</span>
          <span>PAYOUT</span>
          <span className="px-4 py-2 rounded-3xl">
            <select
              className="bg-transparent focus:outline-none cursor-pointer"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={10} className="bg-[#1c1a3e]">
                10
              </option>
              <option value={20} className="bg-[#1c1a3e]">
                20
              </option>
              <option value={30} className="bg-[#1c1a3e]">
                30
              </option>
              <option value={50} className="bg-[#1c1a3e]">
                50
              </option>
            </select>
          </span>
        </Table.Header>
        <Table.Body className="max-h-[40rem] overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner className="h-[34rem]" />
          ) : (
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs desktop:text-lg"
              >
                <span>{item?.game}</span>
                <span>{formatTime(item?.time)}</span>
                <span className="flex items-center gap-2">
                  <div className="bg-[#d11f9f] w-8 tablet:w-6 desktop:w-8 h-8 tablet:h-6 desktop:h-8 rounded-full flex justify-center items-center">
                    <img
                      src="/images/user.png"
                      alt=""
                      className="w-6 tablet:w-4 desktop:w-6 h-6 tablet:h-4 desktop:h-6 object-contain"
                    />
                  </div>
                  <span>{item?.user?.username}</span>
                </span>
                <span className="flex items-center gap-2">
                  {item?.betCoin && (
                    <img
                      src={`/tokens/${item?.betCoin}.png`}
                      alt=""
                      className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                    />
                  )}
                  {formatColorChangeOfLeadingZero(
                    parseFloat(item?.betAmount).toFixed(8).toString()
                  )}
                </span>
                <span
                  className={`${
                    item?.status === "win"
                      ? "bg-[#353436] text-[#12e50d]"
                      : "bg-[#3a3948] text-[#69686a]"
                  } w-min h-min px-3 py-1 rounded-2xl`}
                >
                  {`x${parseFloat(item?.multiplier).toFixed(4)}`}
                </span>
                <span className="flex items-center gap-2">
                  {item?.betCoin && (
                    <img
                      src={`/tokens/${item?.betCoin}.png`}
                      alt=""
                      className="w-8 tablet:w-5 desktop:w-8 h-8 tablet:h-5 desktop:h-8"
                    />
                  )}

                  {item?.status === "win" ? (
                    formatColorChangeOfLeadingZero(
                      parseFloat(item?.payout).toFixed(8).toString()
                    )
                  ) : (
                    <span className="text-[#69686a]">
                      {parseFloat(item?.payout).toFixed(8).toString()}
                    </span>
                  )}
                </span>
              </Table.Row>
            ))
          )}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} limit={limit} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default BetHistoryTable;
