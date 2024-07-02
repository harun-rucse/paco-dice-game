function Banner() {
  return (
    <div className="h-[10rem] tablet:h-[16rem] desktop:h-[30rem] px-4 tablet:px-0 pt-2 tablet:pt-0 overflow-hidden">
      <img
        src="/images/banner.png"
        alt=""
        className="hidden desktop:block w-full h-full object-cover"
      />
      <img
        src="/images/banner-md.png"
        alt=""
        className="hidden tablet:block desktop:hidden w-full h-full object-cover"
      />
      <img
        src="/images/banner-sm.png"
        alt=""
        className="block tablet:hidden w-full h-full object-fill rounded-xl"
      />
    </div>
  );
}

export default Banner;
