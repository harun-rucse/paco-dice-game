import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import useWithdraws from "./useWithdrawables";
import Spinner from "../../../../components/Spinner";
import { useApprove } from "./useApprove";

function getColor(status) {
  switch (status) {
    case "pending":
      return "bg-[#f6fe9e] text-[#c1c647]";
    case "success":
      return "bg-[#acffb9] text-[#36c45b] ";
    case "fail":
      return "bg-[#ff8181] text-[#d34e4e] ";
  }
}

function WithdrawableTable() {
  const { isLoading: isLoading1, withdrawables, count } = useWithdraws();
  const { isLoading: isLoading2, approveWithdrawable } = useApprove();

  function handleApproval(id) {
    approveWithdrawable({ id });
  }

  if (isLoading1 || isLoading2) return <Spinner />;

  return (
    <Table columns="grid-cols-[0.5fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_3fr_1fr]">
      <Table.Header>
        <span>Username</span>
        <span>Deposit Amount</span>
        <span>Status</span>
        <span>Wallet Address</span>
        <span>Claim</span>
      </Table.Header>
      <Table.Body>
        {withdrawables?.map((item) => (
          <Table.Row key={item?._id}>
            <span>{item?.account?.username}</span>
            <span>
              {Number(item?.amount)?.toFixed(10)}{" "}
              {item?.tokenName?.toUpperCase()}
            </span>
            <span
              className={`${getColor(
                item?.status
              )} w-[6.5rem] h-fit text-center py-1 rounded-full uppercase font-extralight`}
            >
              {item?.status === "success"
                ? "completed"
                : item?.status === "fail"
                ? "cancelled"
                : "pending"}
            </span>
            <span>{item?.account?.publicKey}</span>
            <span className="space-x-3">
              <button
                className="bg-[#acffb9] text-[#36c45b] p-2 rounded-full uppercase font-extralight text-center"
                onClick={() => handleApproval(item?._id)}
              >
                Claim
              </button>
            </span>
          </Table.Row>
        ))}
        {withdrawables?.length === 0 && (
          <span className="flex justify-center font-extralight py-2">
            No data found!
          </span>
        )}
      </Table.Body>
      <Table.Footer>
        <Pagination count={count} />
      </Table.Footer>
    </Table>
  );
}

export default WithdrawableTable;
