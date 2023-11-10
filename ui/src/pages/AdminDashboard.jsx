import CardItems from "../features/dashboard/CardItems";
import Stats from "../features/dashboard/Stats";

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <CardItems />
      <Stats />
    </div>
  );
}

export default AdminDashboard;
