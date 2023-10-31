import CardItem from "../components/admin/CardItem";

const items = [
  {
    label: "Total Balance",
    image: "/icons/balance.png",
    amount: 0,
  },
  {
    label: "Profit",
    image: "/icons/profit.png",
    amount: 0,
  },
  {
    label: "Loss",
    image: "/icons/loss.png",
    amount: 0,
  },
];

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-10">
        {items.map((item) => (
          <CardItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
