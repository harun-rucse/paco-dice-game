import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#2e2550] text-white px-7 py-7 shadow-2xl">
      <div className="flex flex-col text-center">
        <h1 className="text-4xl uppercase font-extralight mt-4">
          Page Not Found!
        </h1>
        <p className="text-gray-200 mt-2">This page doesn't exists!</p>
        <Link
          to="/"
          className="self-center bg-[#67a455] text-white px-4 py-2 rounded-md mt-6"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
