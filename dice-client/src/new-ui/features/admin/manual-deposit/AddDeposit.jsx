import { useState } from "react";
import { useCreate } from "./useCreate";
import Spinner from "../../../../components/Spinner";

function AddDeposit() {
  const [trxId, setTrxId] = useState("");
  const { isLoading, createManualDeposit } = useCreate();

  function handleAddDeposit() {
    createManualDeposit({ trxId });
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-6 w-[80%]">
      <h2 className="text-xl">Add Manual Deposit</h2>
      <div className="bg-[#24292d] p-4 rounded-md flex gap-4">
        <input
          type="text"
          className="w-full rounded-md bg-gray-500 px-4 focus:outline-none"
          placeholder="TRX ID"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
        />
        <button className="px-8 py-2 bg-[#161616]" onClick={handleAddDeposit}>
          Add
        </button>
      </div>
    </div>
  );
}

export default AddDeposit;
