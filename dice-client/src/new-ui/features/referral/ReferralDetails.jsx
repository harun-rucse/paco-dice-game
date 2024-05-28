import { useState } from "react";
import ReferredUser from "./ReferredUser";
import CommissionDetails from "./CommissionDetails";

function ReferralDetails() {
  const [selectedType, setSelectedType] = useState("Referred Users");

  return (
    <div>
      <div className="flex items-center">
        <button
          className={`${
            selectedType === "Referred Users"
              ? "bg-[#383663] dark:bg-[#382e55] border-[#71619f] dark:border-[#66588f] z-10"
              : "bg-[#181734] dark:bg-[#120e1e] border-[#171631] z-0"
          } px-3 tablet:px-5 py-2 uppercase focus:outline-none border text-sm tablet:text-lg rounded-t-2xl`}
          onClick={() => setSelectedType("Referred Users")}
        >
          Referred Users
        </button>
        <button
          className={`-ml-3 ${
            selectedType === "Commission Details"
              ? "bg-[#383663] dark:bg-[#382e55] border-[#71619f] dark:border-[#66588f] z-10"
              : "bg-[#181734] dark:bg-[#120e1e] border-[#171631] z-0"
          } px-3 tablet:px-5 py-2 uppercase focus:outline-none border text-sm tablet:text-lg rounded-t-2xl`}
          onClick={() => setSelectedType("Commission Details")}
        >
          Commission Details
        </button>
      </div>

      {selectedType === "Referred Users" && <ReferredUser />}
      {selectedType === "Commission Details" && <CommissionDetails />}
    </div>
  );
}

export default ReferralDetails;
