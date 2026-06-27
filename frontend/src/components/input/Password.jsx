import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Password = ({ value, onChange, placeholder = "password" }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(prev => !prev);
  };

  return (
    <div className="flex items-center bg-white border border-gray-400 text-gray-600 rounded-md px-5 mb-1 mt-4">
      <input
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className=" w-full text-sm  bg-transparent py-3 mr-3 outline-none text-gray-600 rounded-md"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-gray-600 cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-gray-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default Password;

