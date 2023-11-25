import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../../components/Table";
import useUserTransactions from "./useUserTransactions";
import { formatDate } from "../../utils";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";

function TransactionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [current, setCurrent] = useState("deposits");
  const { isLoading, result, count } = useUserTransactions(current);

  useEffect(() => {
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }, [current]);

  if (isLoading) return <Spinner />;

  return (
    <div className="w-full bg-[#2b1346] text-white font-extralight flex flex-col gap-6 px-6 py-6 rounded-xl border border-[#613692]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
        <strong className="text-lg">Transactions</strong>
        <div className="flex items-center ">
          <button
            className={`${
              current === "deposits" ? "bg-[#8634d8]" : "bg-transparent"
            }  border border-[#8634d8] px-6 py-2 rounded-[10px_0px_0px_10px]`}
            onClick={() => setCurrent("deposits")}
          >
            Deposits
          </button>
          <button
            className={`${
              current === "withdraws" ? "bg-[#8634d8]" : "bg-transparent"
            }  border border-[#8634d8] px-6 py-2 rounded-[0px_10px_10px_0px]`}
            onClick={() => setCurrent("withdraws")}
          >
            Withdrawals
          </button>
        </div>
      </div>

      <Table columns="grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_3fr_1fr_1fr]">
        <Table.Header className="bg-[#2b4d8e]">
          <span>#</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Wallet</span>
          <span>Status</span>
          <span>Date</span>
        </Table.Header>
        <Table.Body className="bg-[#141346]">
          {result?.map((item) => (
            <Table.Row className="md:py-2" key={item?._id}>
              <span>
                {item?._id?.substring(0, 5) +
                  "..." +
                  item?._id?.substring(
                    item?._id?.length - 5,
                    item?._id?.length
                  )}
              </span>
              <span className="capitalize">{current}</span>
              <span className="uppercase">
                {item?.amount} {item?.tokenName}
              </span>
              <span>
                {item?.receivedAddress ||
                  item?.trxId?.substring(0, 16) +
                    "........" +
                    item?.trxId?.substring(
                      item?.trxId?.length - 16,
                      item?.trxId?.length
                    )}
              </span>
              <span>{item?.status}</span>
              <span>{formatDate(item?.createdAt, "DD/MM/YYYY")}</span>
            </Table.Row>
          ))}
          {result?.length === 0 && (
            <p className="text-center py-3">No transactions found</p>
          )}
        </Table.Body>
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </div>
  );
}

export default TransactionTable;
