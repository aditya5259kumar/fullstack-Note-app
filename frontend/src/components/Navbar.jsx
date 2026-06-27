import { useState } from "react";
import Profile from "./cards/Profile";
import SearchBar from "./SearchBar";
import { MdStickyNote2 } from "react-icons/md";

const Navbar = ({ userInfo, searchNotes, ProfileHandler }) => {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch() {
    searchNotes(searchQuery);
  }

  function onClearSearch() {
    setSearchQuery("");
    searchNotes("");
  }

  return (
    <>
      <div
        className="
  bg-yellow-50 drop-shadow-lg
  px-4 sm:px-6 lg:px-16
  py-2
  flex
  gap-3 sm:gap-12
  items-center justify-between
"
      >
        <h2 className="text-3xl font-bold text-yellow-700 py-2 flex items-center justify-center gap-1">
          {" "}
          <span>
            <MdStickyNote2 />
          </span>
          <span className="md:block hidden">Notely</span>
        </h2>

        <SearchBar
          value={searchQuery}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />

        <Profile ProfileHandler={ProfileHandler} userInfo={userInfo} />
      </div>
    </>
  );
};

export default Navbar;
