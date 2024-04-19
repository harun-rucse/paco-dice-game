function FeatureBanner() {
  return (
    <div className="pt-8 tablet:pt-10 desktop:pt-20 pb-10 px-4 desktop:px-10">
      <h2 className="uppercase text-lg tablet:text-2xl">Featured</h2>
      <div className="mt-4 tablet:mt-6">
        <img
          src="/images/lottery-banner.jpeg"
          alt=""
          className="overflow-hidden h-[5rem] tablet:h-full object-contain rounded-xl tablet:rounded-2xl"
        />
        <div className="flex gap-2 tablet:gap-6 desktop:gap-8 tablet:mt-6 desktop:mt-8">
          <img
            src="/images/dice.jpeg"
            alt=""
            className="overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
          />
          <img
            src="/images/staking.jpeg"
            alt=""
            className="overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default FeatureBanner;
