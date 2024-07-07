import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Table from "../../components/Table";
import { numberFormat } from "../../../utils/format";
import useGetStakeHistories from "./useGetStakeHistories";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate, todaysDay, addDay, subtractDay } from "../../../utils";
import Pagination from "../../components/Pagination";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import useGetMyStakeHistories from "./useGetMyStakeHistories";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

const formatDateString = (item) => {
  const [year, month, day] = String(item).slice(0, 10).split("-");

  return `${year}/${month}/${day}`;
};

function StakeHistoryTable() {
  const [limit, setLimit] = useState(10);
  const [date, setDate] = useState(subtractDay(todaysDay(), 0));
  const [selectedType, setSelectedType] = useState("All Payouts");
  const [showPayout, setShowPayout] = useState(false);
  const [result, setResult] = useState([]);
  const [count, setCount] = useState([]);

  const { isAuthenticated, isLoading } = useCurrentUser();

  const {
    isLoading: isFetchingAllPayouts,
    result: allPayoutsData,
    count: allPayoutsCount,
  } = useGetStakeHistories(
    formatDate(subtractDay(date, 1), "YYYY-MM-DD").toString(),
    formatDate(date, "YYYY-MM-DD").toString()
  );

  const {
    isLoading: isFetchingMyPayouts,
    result: myPayoutsData,
    count: myPayoutsCount,
  } = useGetMyStakeHistories(
    formatDate(subtractDay(date, 1), "YYYY-MM-DD").toString(),
    formatDate(date, "YYYY-MM-DD").toString()
  );

  useEffect(() => {
    if (selectedType === "All Payouts") {
      setResult(allPayoutsData);
      setCount(allPayoutsCount);
    } else {
      setResult(myPayoutsData);
      setCount(myPayoutsCount);
    }
  }, [selectedType, allPayoutsData, myPayoutsData]);

  function handleSelectPayout(val) {
    setSelectedType(val);
    setShowPayout(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-col tablet:flex-row">
        <div className="flex items-center gap-6 mb-5">
          <h2 className="uppercase text-base tablet:text-2xl">
            Staking history
          </h2>
          <div className="flex items-center justify-between w-[10rem] laptop:w-[14rem] bg-[#1e1c3a] dark:bg-[#442c62] px-4 py-1 laptop:py-2 rounded-2xl">
            <button
              className="focus:outline-none border-none"
              onClick={() => setDate((prevDay) => subtractDay(prevDay, 2))}
            >
              <FaChevronLeft />
            </button>
            <span>{formatDate(date, "D/M/YYYY")}</span>
            <button
              className="focus:outline-none border-none"
              onClick={() => setDate((prevDay) => addDay(prevDay, 2))}
              disabled={
                formatDate(subtractDay(todaysDay(), 0), "D/M/YYYY") ===
                formatDate(date, "D/M/YYYY")
              }
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="self-end tablet:self-start relative mb-2 tablet:mb-0">
          <button
            className="w-[10rem] bg-[#1e1c3a] flex items-center justify-between px-4 py-2 rounded-xl border border-[#39376b]"
            onClick={() => setShowPayout((state) => !state)}
            disabled={!isLoading && !isAuthenticated}
          >
            <span className="text-sm tablet:text-base uppercase">
              {selectedType}
            </span>
            {showPayout ? (
              <MdOutlineKeyboardArrowUp size={26} color="#ffff" />
            ) : (
              <MdOutlineKeyboardArrowDown size={26} color="#ffff" />
            )}
          </button>
          {showPayout && (
            <div className="absolute top-11 left-0 w-full bg-[#15142c] shadow-lg border border-[#39376b] rounded-xl z-[999] mt-2 text-center space-y-1">
              <p
                className={`text-sm tablet:text-base uppercase px-4 py-2 transition ${
                  selectedType === "All Payouts"
                    ? "bg-[#4f4b84]"
                    : "bg-transparent"
                } text-white rounded-xl cursor-pointer`}
                onClick={() => handleSelectPayout("All Payouts")}
              >
                All Payouts
              </p>
              <p
                className={`text-sm tablet:text-base uppercase px-4 py-2 transition ${
                  selectedType === "My Payouts"
                    ? "bg-[#4f4b84]"
                    : "bg-transparent"
                } text-white rounded-xl cursor-pointer`}
                onClick={() => handleSelectPayout("My Payouts")}
              >
                My Payouts
              </p>
            </div>
          )}
        </div>
      </div>
      <Table
        columns="grid-cols-[0.3fr_0.6fr_0.5fr_0.1fr] tablet:grid-cols-[1fr_2fr_1fr_0.4fr] laptop:grid-cols-[0.8fr_1fr_0.5fr_0.2fr]"
        className="min-w-[40rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs laptop:text-lg text-[#6c5b91] font-semibold dark:text-[#7968a0] border-[#131230]">
          <span>DATE</span>
          <span>STAKED PACO</span>
          <span>PAYOUTS</span>
          {/* <span className="px-4 py-2 rounded-3xl">
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
          </span> */}
        </Table.Header>
        <Table.Body className="max-h-[40rem] overflow-y-auto space-y-0">
          {isFetchingAllPayouts || isFetchingMyPayouts ? (
            <LoadingSpinner className="h-[34rem]" />
          ) : (
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className={`${
                  Number(item?.index) % 2 === 0
                    ? "bg-transparent"
                    : "bg-[#373568]"
                } text-sm tablet:text-xs laptop:text-lg py-2`}
              >
                <span>{formatDateString(item?.date)}</span>
                <span className="flex items-center gap-2">
                  <img
                    src="/images/paco.png"
                    alt=""
                    className="w-7 tablet:w-5 laptop:w-7 h-7 tablet:h-5 laptop:h-7"
                  />
                  {numberFormat(item?.stakedPaco)}
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src={`/tokens/${item?.coinName}.png`}
                    alt=""
                    className="w-7 tablet:w-5 laptop:w-7 h-7 tablet:h-5 laptop:h-7"
                  />
                  {numberFormat(item?.payouts)}
                </span>
              </Table.Row>
            ))
          )}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} limit={limit / 5} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default StakeHistoryTable;
