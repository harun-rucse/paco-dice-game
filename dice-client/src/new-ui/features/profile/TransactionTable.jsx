import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../../components/Table";
import useUserTransactions from "./useUserTransactions";
import { formatDate } from "../../../utils";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";

function TransactionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [selectedType, setSelectedType] = useState("deposits");
  const { isLoading, result, count } = useUserTransactions(selectedType, limit);

  useEffect(() => {
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }, [selectedType]);

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <h2 className="uppercase text-base tablet:text-2xl">Transactions</h2>
        <div className="flex items-center">
          <button
            className={`${
              selectedType === "deposits"
                ? "bg-[#8562b1] z-10"
                : "bg-[#442c62] z-0"
            } px-5 py-[0.2rem] uppercase focus:outline-none border-none text-xs tablet:text-lg rounded-xl`}
            onClick={() => setSelectedType("deposits")}
          >
            Deposits
          </button>
          <button
            className={`-ml-3 ${
              selectedType === "withdraws"
                ? "bg-[#8562b1] z-10"
                : "bg-[#442c62] z-0"
            } px-5 py-[0.2rem] uppercase focus:outline-none border-none text-xs tablet:text-lg rounded-xl`}
            onClick={() => setSelectedType("withdraws")}
          >
            Withdrawals
          </button>
        </div>
      </div>
      <Table
        columns="grid-cols-[0.5fr_0.3fr_0.5fr_1.2fr_0.4fr_0.3fr_0.2fr] tablet:grid-cols-[0.6fr_0.4fr_0.5fr_1.4fr_0.5fr_0.4fr_0.2fr] laptop:grid-cols-[0.6fr_0.4fr_0.5fr_1.4fr_0.5fr_0.4fr_0.2fr] desktop:grid-cols-[0.6fr_0.4fr_0.4fr_1fr_0.4fr_0.6fr_0.1fr]"
        className="min-w-[58rem] tablet:min-w-[20rem] desktop:min-w-[40rem]"
      >
        <Table.Header className="text-sm tablet:text-xs laptop:text-lg text-[#6c5b91] font-semibold dark:text-[#7968a0] border-[#131230]">
          <span>#</span>
          <span>TYPE</span>
          <span>AMOUNT</span>
          <span>WALLET</span>
          <span>STATUS</span>
          <span>DATE</span>
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
            <LoadingSpinner className="h-[30rem]" />
          ) : (
            result?.map((item, i) => (
              <Table.Row
                key={i}
                className="text-sm tablet:text-xs laptop:text-base"
              >
                <span className="bg-[#353436] w-min h-min px-3 py-0 rounded-2xl text-[#c3a6e7]">
                  {item?._id?.substring(0, 5) +
                    "..." +
                    item?._id?.substring(
                      item?._id?.length - 5,
                      item?._id?.length
                    )}
                </span>
                <span className="capitalize">{selectedType}</span>
                <span className="uppercase">
                  {Number(item?.amount)
                    .toFixed(8)
                    .replace(/\.?0+$/, "")}{" "}
                  {item?.tokenName}
                </span>
                <span className="bg-[#353436] w-min h-min px-3 py-0 rounded-2xl text-[#52d650]">
                  {item?.receivedAddress ||
                    item?.trxId?.substring(0, 16) +
                      "........" +
                      item?.trxId?.substring(
                        item?.trxId?.length - 16,
                        item?.trxId?.length
                      )}
                </span>
                <span
                  className={`bg-[#353436] w-min h-min px-3 py-0 rounded-2xl ${
                    item?.status === "success"
                      ? "text-[#12e50d]"
                      : "text-[#d11f1f]"
                  }`}
                >
                  {item?.status}
                </span>
                <span>{formatDate(item?.createdAt, "DD/MM/YYYY")}</span>
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

export default TransactionTable;
