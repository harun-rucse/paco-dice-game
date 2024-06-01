import { useState } from "react";
import Table from "../../components/Table";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { formatDate } from "../../../utils";
import { currencyFormat } from "../../../utils/format";
import { useDarkMode } from "../../../context/DarkModeContext";
import CommissionDetailsInfo from "./CommissionDetailsInfo";
import useGetMyReferredUsers from "./useGetMyReferredUsers";
import { addition, multiply } from "../../../utils/decimal";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";

function ReferredUser() {
  const [limit, setLimit] = useState(10);
  // const [isLoading] = useState(false);
  const [openDetailsId, setOpenDetailsId] = useState("");
  // const count = 12;

  const { isDarkMode } = useDarkMode();
  const { isLoading: isFetching, price } = useGetCoinPrice();
  const { isLoading, result, count } = useGetMyReferredUsers(limit);

  function handleOpenDetails(id) {
    if (openDetailsId) {
      setOpenDetailsId("");
    } else {
      setOpenDetailsId(id);
    }
  }

  function calcTotalUSD(values) {
    const btcUSD = multiply(values.btc, price?.btc);
    const pacoUSD = multiply(values.paco, price?.paco);
    const usdtUSD = multiply(values.usdt, price?.usdt);
    const ethUSD = multiply(values.eth, price?.eth);
    const bnbUSD = multiply(values.bnb, price?.bnb);

    return addition(btcUSD, pacoUSD, usdtUSD, ethUSD, bnbUSD);
  }

  return (
    <div>
      <Table
        columns="grid-cols-[0.4fr_0.5fr_0.7fr_0.7fr_0.1fr] tablet:grid-cols-[0.5fr_0.6fr_1fr_1fr_0.2fr] laptop:grid-cols-[0.4fr_0.5fr_0.7fr_1fr_0.1fr] desktop:grid-cols-[0.8fr_0.8fr_1fr_1fr_0.1fr]"
        className="min-w-[58rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs laptop:text-lg bg-[#1f1d3c] dark:bg-[#281a3c] text-[#5e6390] font-semibold dark:text-[#6d5e90] border-[#131230] dark:border-[#502f78]">
          <span>USER</span>
          <span>MEMBER SINCE</span>
          <span>WAGERED</span>
          <span>COMMISSION</span>
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
        <Table.Body
          className={`max-h-[40rem] ${
            openDetailsId && "min-h-[20rem]"
          } overflow-y-auto bg-[#242248] dark:bg-[#382f54]`}
        >
          {isLoading || isFetching ? (
            <LoadingSpinner className="h-[34rem]" />
          ) : (
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs desktop:text-lg"
              >
                <span>{item.user}</span>
                <span>{formatDate(item.memberSince, "DD/MM/YYYY")}</span>

                <span className="flex items-center gap-2">
                  <img
                    src={`images/currency.png`}
                    alt=""
                    className="w-5 tablet:w-5 desktop:w-6 h-5 tablet:h-5 desktop:h-6 object-contain"
                  />
                  <span>{currencyFormat(calcTotalUSD(item.wagered))}</span>
                  <button
                    className="relative"
                    onClick={() => handleOpenDetails(`wager_${item._id}`)}
                  >
                    <img
                      src={
                        isDarkMode
                          ? "/images/referral/question-dark.png"
                          : "/images/referral/question.png"
                      }
                      alt=""
                      className="ml-2 w-5 tablet:w-5 desktop:w-5 h-5 tablet:h-5 desktop:h-5 object-contain"
                    />

                    {openDetailsId == `wager_${item._id}` && (
                      <div className="absolute top-0 left-10 z-[99999999]">
                        <CommissionDetailsInfo
                          value={item.wagered}
                          isLoading={false}
                          className="text-sm tablet:text-base"
                        />
                      </div>
                    )}
                  </button>
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src={`images/currency.png`}
                    alt=""
                    className="w-5 tablet:w-5 desktop:w-6 h-5 tablet:h-5 desktop:h-6 object-contain"
                  />
                  <span>{currencyFormat(calcTotalUSD(item.commission))}</span>
                  <button
                    className="relative"
                    onClick={() => handleOpenDetails(`commission_${item._id}`)}
                  >
                    <img
                      src={
                        isDarkMode
                          ? "/images/referral/question-dark.png"
                          : "/images/referral/question.png"
                      }
                      alt=""
                      className="ml-2 w-5 tablet:w-5 desktop:w-5 h-5 tablet:h-5 desktop:h-5 object-contain"
                    />

                    {openDetailsId == `commission_${item._id}` && (
                      <div className="absolute top-0 left-10 z-[9999]">
                        <CommissionDetailsInfo
                          value={item.commission}
                          isLoading={false}
                          className="text-sm tablet:text-base"
                        />
                      </div>
                    )}
                  </button>
                </span>
              </Table.Row>
            ))
          )}
        </Table.Body>
        <Table.Footer className="bg-[#242248] dark:bg-[#261e3f]">
          <Pagination count={count} limit={limit} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default ReferredUser;
