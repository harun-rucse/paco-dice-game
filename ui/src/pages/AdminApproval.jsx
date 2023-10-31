import WithdrawTable from "../features/approval/WithdrawTable";
import Withdraws from "../features/approval/Withdraws";

function AdminApproval() {
  return (
    <div className="flex flex-col gap-6">
      <Withdraws />
      <WithdrawTable />
    </div>
  );
}

export default AdminApproval;
