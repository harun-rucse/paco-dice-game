import WithdrawTable from "../../features/admin/approval/WithdrawTable";
import Withdraws from "../../features/admin/approval/Withdraws";

function Approval() {
  return (
    <div className="flex flex-col gap-6">
      <Withdraws />
      <WithdrawTable />
    </div>
  );
}

export default Approval;
