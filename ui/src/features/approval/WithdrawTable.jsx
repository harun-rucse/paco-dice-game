import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import useWithdraws from "./useWithdraws";
import Spinner from "../../components/Spinner";
import { useApproveWithdraw } from "./useApproveWithdraw";

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

function WithdrawTable() {
  const { isLoading: isLoading1, withdraws, count } = useWithdraws();
  const { isLoading: isLoading2, approveWithdraw } = useApproveWithdraw();

  function handleApproval(id, status) {
    approveWithdraw({ id, status });
  }

  if (isLoading1 || isLoading2) return <Spinner />;

  return (
    <Table>
      <Table.Header>
        <span>Username</span>
        <span>Withdraw Amount</span>
        <span>Status</span>
        <span>Wallet Address</span>
        <span>Approve?</span>
      </Table.Header>
      <Table.Body>
        {withdraws?.map((item) => (
          <Table.Row key={item._id}>
            <span>{item.account.username}</span>
            <span>
              {item.amount?.toFixed(10)} {item.tokenName.toUpperCase()}
            </span>
            <span
              className={`${getColor(
                item.status
              )} w-[6.5rem] h-fit text-center py-1 rounded-full uppercase font-semibold`}
            >
              {item.status === "success"
                ? "completed"
                : item.status === "fail"
                ? "cancelled"
                : "pending"}
            </span>
            <span>{item.receivedAddress}</span>
            <span className="space-x-3">
              <button
                className="bg-[#acffb9] text-[#36c45b] p-2 rounded-full uppercase font-semibold text-center"
                onClick={() => handleApproval(item._id, "success")}
              >
                Yes
              </button>
              <button
                className="bg-[#ff8181] text-[#db1947] p-2 rounded-full uppercase font-semibold text-center"
                onClick={() => handleApproval(item._id, "fail")}
              >
                No
              </button>
            </span>
          </Table.Row>
        ))}
        {withdraws?.length === 0 && (
          <span className="flex justify-center font-semibold py-2">
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

export default WithdrawTable;
