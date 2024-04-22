import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";

function Pagination({ count, limit }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / limit);

  function handlePrev() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  function handleNext() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <>
      <p className="text-xs md:text-sm">
        Showing<span className="mx-1">{(currentPage - 1) * limit + 1}</span>
        to
        <span className="mx-1">
          {currentPage === pageCount ? count : currentPage * limit}
        </span>
        of<span className="mx-1">{count}</span>
        results
      </p>
      <div className="text-sm flex gap-2 items-center">
        <button
          className="hover:bg-[#161616] px-2 py-1 rounded-md font-extralight flex items-center"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <HiChevronLeft /> <span>Previous</span>
        </button>
        <button
          className="hover:bg-[#161616] px-2 py-1 rounded-md font-extralight flex items-center"
          onClick={handleNext}
          disabled={currentPage === pageCount}
        >
          <span>Next</span> <HiChevronRight />
        </button>
      </div>
    </>
  );
}

export default Pagination;
