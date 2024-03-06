function Banner() {
  return (
    <div>
      <div className="h-full md:h-[16rem] w-full bg-[#3c2f61] shadow-2xl rounded-2xl overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Banner img"
          className="w-full h-full object-fill"
        />
      </div>
    </div>
  );
}

export default Banner;
