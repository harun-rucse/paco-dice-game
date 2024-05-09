import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="w-full h-full flex justify-center mt-[12rem] text-white px-7 py-7">
      <div className="flex flex-col text-center">
        <h1 className="text-2xl tablet:text-4xl uppercase font-extralight mt-4">
          Page Not Found!
        </h1>
        <p className="text-gray-200 mt-2">This page doesn't exists!</p>
        <Link
          to="/"
          className="self-center bg-[#413e72] dark:bg-[#4e3270] border border-[#605e96] dark:border-[#644689] text-white px-4 py-2 rounded-md mt-6"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
