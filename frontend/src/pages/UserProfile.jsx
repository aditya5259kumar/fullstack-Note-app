import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { LuCalendarFold } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { HiMiniBars2 } from "react-icons/hi2";

const UserProfile = ({ userInfo, onLogout, setShowProfile }) => {
  const [showSettings, setShowSettings] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    console.log("Logging out...");
    onLogout();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 px-4 flex items-center backdrop-blur-xs justify-center bg-black/20"
        onClick={() => setShowProfile((prev) => !prev)}
      >
        <div
          className="relative bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden w-full max-w-md before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-32 bg-yellow-100"></div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
                  {getInitials(userInfo.name)}
                </div>

              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 capitalize mb-1">
                {userInfo.name}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {userInfo._id.slice(-8)}
              </p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-3 rounded-lg">
                <LuMail className="text-xl text-yellow-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-700 truncate">
                    {userInfo.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-3 rounded-lg">
                <LuCalendarFold className="text-xl text-yellow-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatDate(userInfo.createdOn)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="absolute top-3 right-3 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10">
              <div className="flex items-center justify-between px-2 py-3 border-b border-gray-200 bg-violet-50">
                <span className="text-sm font-semibold text-gray-800">
                  Settings
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoMdClose className="text-xl" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:text-red-600 cursor-pointer"
              >
                <IoLogOutOutline className="text-xl" />
                <span className="text-sm font-medium text-gray-700 ">
                  Logout
                </span>
              </button>
            </div>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-3 right-3 rounded-full p-1 transition-all duration-200 text-indigo-600 cursor-pointer"
          >
            <HiMiniBars2 className="text-2xl font-bold" />
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
