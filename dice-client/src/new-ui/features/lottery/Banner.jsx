function Banner() {
  return (
    <div>
      <div className="laptop:h-[14rem] desktop:h-[18rem] object-contain w-full bg-[#3c2f61] shadow-2xl rounded-xl overflow-hidden border border-[#c99f34]">
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
