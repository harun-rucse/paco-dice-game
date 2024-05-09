import WithdrawableTable from "../../features/admin/withdrawable/WithdrawableTable";
import Stats from "../../features/admin/withdrawable/Stats";
import AddWithdrawable from "../../features/admin/withdrawable/AddWithdrawable";

function Withdrawable() {
  return (
    <div className="flex flex-col gap-6">
      <Stats />
      <AddWithdrawable />
      <WithdrawableTable />
    </div>
  );
}

export default Withdrawable;
