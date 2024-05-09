import CardItems from "../../features/admin/dashboard/CardItems";
import Stats from "../../features/admin/dashboard/Stats";

function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <CardItems />
      <Stats />
    </div>
  );
}

export default Dashboard;
