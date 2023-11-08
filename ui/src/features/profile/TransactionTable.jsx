import { useState } from "react";
import Table from "../../components/Table";

function TransactionTable() {
  const [current, setCurrent] = useState("deposits");

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
            Withdraws
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
          {[...Array(8)].map((_, index) => (
            <Table.Row className="md:py-2" key={index}>
              <span>{index + 1}</span>
              <span>Deposit</span>
              <span>10$</span>
              <span>0xb794f5ea0ba39494ce839613fffba74279579268</span>
              <span>Completed</span>
              <span>20/12/23</span>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TransactionTable;
