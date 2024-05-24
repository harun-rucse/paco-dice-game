function Banner() {
  return (
    <div className="h-[10rem] tablet:h-[16rem] desktop:h-[30rem]">
      <img
        src="/images/banner.png"
        alt=""
        className="hidden tablet:block w-full h-full object-fill"
      />
      <img
        src="/images/banner-sm.png"
        alt=""
        className="block tablet:hidden w-full h-full object-fill"
      />
    </div>
  );
}

export default Banner;
