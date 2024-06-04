import ReferralDetails from "./ReferralDetails";
import ReferralLink from "./ReferralLink";
import Stats from "./Stats";

function ReferralCard() {
  return (
    <div className="bg-[#222143] dark:bg-[#1d172f] p-2 space-y-8">
      <ReferralLink />
      <Stats />
      <ReferralDetails />
    </div>
  );
}

export default ReferralCard;
