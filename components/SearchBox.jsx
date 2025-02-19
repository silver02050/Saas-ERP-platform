
import React from "react";

const SearchBox = () => {

  return (
    <div className="w-2/5">
        <div className="flex relative">

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="block p-2 w-full z-20 focus:outline-none text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-lg border border-primary"
              placeholder="Search..."
              required
            />
            <button
              type="buttin"
              className="absolute top-0 end-0 p-2.5 px-4 text-sm font-medium h-full text-white bg-active rounded-e-lg  hover:bg-blue-800 focus:outline-none focus:ring-blue-300"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default SearchBox;
