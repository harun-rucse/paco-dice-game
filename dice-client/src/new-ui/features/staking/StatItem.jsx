function StatItem({ title, subTitle, icon }) {
  return (
    <div className="space-y-1">
      <h4 className="uppercase text-sm text-left tablet:text-center desktop:text-xl text-[#b4b3b3]">
        {title}
      </h4>
      <div className="flex items-center gap-1">
        {icon && <img src="/icons/paco-icon.png" alt="" className="w-7" />}
        <p className="text-white text-xl desktop:text-2xl">{subTitle}</p>
        {icon && (
          <img src="/icons/fire.png" alt="" className="w-5 desktop:w-7" />
        )}
      </div>
    </div>
  );
}

export default StatItem;
