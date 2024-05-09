function Banner() {
  return (
    <div>
      <div className="h-[7rem] tablet:h-[10rem] laptop:h-[14rem] desktop:h-[20rem] w-full bg-[#3c2f61] shadow-2xl rounded-xl overflow-hidden border border-[#c99f34]">
        <img
          src="/banner.jpeg"
          alt="Banner img"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Banner;
