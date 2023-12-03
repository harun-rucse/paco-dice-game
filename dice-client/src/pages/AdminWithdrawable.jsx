import WithdrawableTable from "../features/withdrawable/WithdrawableTable";
import Stats from "../features/withdrawable/Stats";

function AdminWithdrawable() {
  return (
    <div className="flex flex-col gap-6">
      <Stats />
      <WithdrawableTable />
    </div>
  );
}

export default AdminWithdrawable;
