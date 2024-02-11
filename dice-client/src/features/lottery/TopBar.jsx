function TopBar({ title, children }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <h2 className="text-lg md:text-2xl">{title}</h2>
      {children}
    </div>
  );
}

export default TopBar;
