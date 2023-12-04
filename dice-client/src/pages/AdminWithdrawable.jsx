import WithdrawableTable from "../features/withdrawable/WithdrawableTable";
import Stats from "../features/withdrawable/Stats";
import AddWithdrawable from "../features/withdrawable/AddWithdrawable";

function AdminWithdrawable() {
  return (
    <div className="flex flex-col gap-6">
      <Stats />
      <AddWithdrawable />
      <WithdrawableTable />
    </div>
  );
}

export default AdminWithdrawable;
