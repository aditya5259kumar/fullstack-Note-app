import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { TfiLayoutLineSolid } from "react-icons/tfi";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div
      className="
  flex items-center
  h-10
  w-60 sm:w-64 md:w-120
  px-4
  bg-white
  rounded-3xl
  border border-gray-300
"
    >
      <input
        type="text"
        placeholder="Search Notes"
        value={value}
        onChange={onChange}
        className="
    w-full
    h-full
    text-sm
    bg-transparent
    outline-none
    placeholder-gray-400
  "
      />

      {value && (
        <IoMdClose
          className="text-lg text-gray-500 text-[24px] cursor-pointer hover:text-gray-600 shrink-0"
          onClick={onClearSearch}
        />
      )}
      <span className=" text-2xl font-extralight text-gray-200 rotate-90">
        <TfiLayoutLineSolid />
      </span>
      <FaMagnifyingGlass
        className=" text-gray-500 cursor-pointer text-[17px] hover:text-gray-600 shrink-0"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
