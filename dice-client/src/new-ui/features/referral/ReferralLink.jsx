import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

function ReferralLink() {
  const [referralLink, setReferralLink] = useState("");

  const { isLoading, user } = useCurrentUser();

  useEffect(() => {
    if (user?.referralCode)
      setReferralLink(
        `${import.meta.env.VITE_FRONTEND_URL}/referral/${user?.referralCode}`
      );
  }, [isLoading, user?.referralCode]);

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral address is copied");
  }

  function handleDownloadPromo() {
    console.log("Handle download promo");
  }

  function handleClaim() {
    console.log("Handle claim");
  }

  return (
    <div className="m-2 tablet:m-4">
      <div className="flex items-center flex-col tablet:flex-row justify-between w-full">
        <div className="flex items-center flex-col tablet:flex-row gap-6 w-full">
          <div className="flex items-center bg-[#222143] dark:bg-[#1d172f] border border-[#42416a] dark:border-[#594c7a] px-3 py-3 w-full tablet:w-[23rem] laptop:w-[24rem]">
            <input
              type="text"
              value={referralLink}
              className="bg-transparent w-full border-none focus:outline-none text-sm tablet:text-base text-[#6968a4] dark:text-[#9d7fc2] placeholder:text-[#6968a4] dark:placeholder:text-[#9d7fc2] font-thin"
              readOnly
            />
            <button onClick={handleCopy}>
              <img
                src="/images/referral/copy.png"
                alt=""
                className="w-6 object-contain"
              />
            </button>
          </div>

          <button
            className="text-sm tablet:text-base bg-gradient-to-r from-[#44417a] dark:from-[#6c5c96] via-[#363465] dark:via-[#544678] to-[#25234a] dark:to-[#3e325c] tablet:w-[10rem] laptop:w-[12rem] p-3 border border-[#6361a6] dark:border-[#806dae] rounded-lg shadow-md"
            onClick={handleDownloadPromo}
          >
            Download Promo
          </button>
        </div>

        <button
          className="bg-[#359633] rounded-lg text-sm tablet:text-base shadow-md px-12 tablet:px-10 laptop:px-12 py-3 uppercase mt-3 tablet:mt-0"
          onClick={handleClaim}
        >
          Claim
        </button>
      </div>
    </div>
  );
}

export default ReferralLink;
