import Spinner from "../../components/Spinner";
import CardItem from "../../components/admin/CardItem";
import { useStats } from "./useStats";

function Stats() {
  const { isLoading, data } = useStats();

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-3 gap-10">
      <CardItem
        item={{
          label: "Deposits",
          image: "/icons/deposit.png",
          amount: data?.totalDeposit,
        }}
      />
      <CardItem
        item={{
          label: "Faield",
          image: "/icons/withdraw.png",
          amount: data?.totalWithdraw,
        }}
      />
      <CardItem
        item={{
          label: "Pending",
          image: "/icons/pending.png",
          amount: data?.pendingWithdraw,
        }}
      />
    </div>
  );
}

export default Stats;
