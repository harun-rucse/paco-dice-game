import { useState } from "react";
import { useCreate } from "./useCreate";
import Spinner from "../../../../components/Spinner";

function AddWithdrawable() {
  const [trxId, setTrxId] = useState("");
  const { createWithdrawable, isLoading } = useCreate();

  function handleCreate() {
    if (!trxId) return;

    createWithdrawable({ trxId });
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="self-end flex items-center gap-2">
      <input
        type="text"
        placeholder="Enter trx id"
        value={trxId}
        onChange={(e) => setTrxId(e.target.value)}
        className="p-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
      />
      <button
        className="px-4 py-2 bg-teal-400 rounded-md"
        onClick={handleCreate}
      >
        Add
      </button>
    </div>
  );
}

export default AddWithdrawable;
