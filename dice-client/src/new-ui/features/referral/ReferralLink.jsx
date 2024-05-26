function ReferralLink() {
  return (
    <div className="m-2 tablet:m-4">
      <div className="flex items-center flex-col tablet:flex-row justify-between">
        <div className="flex items-center flex-col tablet:flex-row gap-6">
          <div className="flex items-center bg-[#222143] dark:bg-[#1d172f] border border-[#42416a] dark:border-[#594c7a] px-3 py-3 w-full tablet:w-[24rem]">
            <input
              type="text"
              placeholder="https://game.paco.finance/LlFQtzUPmPhk"
              className="bg-transparent w-full border-none focus:outline-none placeholder:text-[#6968a4] dark:placeholder:text-[#9d7fc2] font-thin"
            />
            <button>
              <img
                src="/images/referral/copy.png"
                alt=""
                className="w-6 object-contain"
              />
            </button>
          </div>

          <button className="bg-gradient-to-r from-[#44417a] dark:from-[#6c5c96] via-[#363465] dark:via-[#544678] to-[#25234a] dark:to-[#3e325c] w-[12rem] p-3 border border-[#6361a6] dark:border-[#806dae] rounded-lg text-base shadow-md">
            Download Promo
          </button>
        </div>

        <button className="bg-[#359633] rounded-lg shadow-md px-12 py-3 uppercase">
          Claim
        </button>
      </div>
    </div>
  );
}

export default ReferralLink;
