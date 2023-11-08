import { useSearchParams } from "react-router-dom";

function Filter({ filterField, options = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) searchParams.set("page", 1);

    setSearchParams(searchParams);
  }

  return (
    <div className="flex items-center gap-2 bg-[#24292d] w-fit rounded-xl">
      {options.map((option) => (
        <div
          className={`${
            currentFilter === option.value ? "bg-[#9141f8]" : ""
          } px-3 py-1 rounded-xl font-extralight cursor-pointer`}
          key={option.value}
          disabled={currentFilter === option.value}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}

export default Filter;
