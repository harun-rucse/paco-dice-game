import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Table from "../../components/Table";
import { numberFormat } from "../../../utils/format";
import useGetStakeHistories from "./useGetStakeHistories";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate, todaysDay, addDay, subtractDay } from "../../../utils";
import Pagination from "../../components/Pagination";

function StakeHistoryTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [date, setDate] = useState(todaysDay());
  const { isLoading, result, count } = useGetStakeHistories(
    limit,
    formatDate(date, "YYYY-MM-DD").toString()
  );

  useEffect(() => {
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }, [date]);

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <h2 className="uppercase text-base tablet:text-2xl">Stake history</h2>
        <div className="flex items-center justify-between w-[10rem] laptop:w-[14rem] bg-[#1e1c3a] dark:bg-[#442c62] px-4 py-1 laptop:py-2 rounded-2xl">
          <button
            className="focus:outline-none border-none"
            onClick={() => setDate((prevDay) => subtractDay(prevDay))}
          >
            <FaChevronLeft />
          </button>
          <span>{formatDate(date, "D/M/YYYY")}</span>
          <button
            className="focus:outline-none border-none"
            onClick={() => setDate((prevDay) => addDay(prevDay))}
            disabled={
              formatDate(todaysDay(), "D/M/YYYY") ===
              formatDate(date, "D/M/YYYY")
            }
          >
            <FaChevronRight />
          </button>
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
          {isLoading && <LoadingSpinner className="h-[34rem]" />}

          {!isLoading &&
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs laptop:text-lg"
              >
                <span>{formatDate(item?.date, "D/MM/YYYY")}</span>
                <span className="flex items-center gap-2">
                  <img
                    src="/images/paco.png"
                    alt=""
                    className="w-8 tablet:w-5 laptop:w-8 h-8 tablet:h-5 laptop:h-8"
                  />
                  {numberFormat(item?.stakedPaco)}
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src="/images/currency.png"
                    alt=""
                    className="w-8 tablet:w-5 laptop:w-8 h-8 tablet:h-5 laptop:h-8"
                  />
                  {numberFormat(item?.payouts)}$
                </span>
              </Table.Row>
            ))}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} limit={limit} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default StakeHistoryTable;
