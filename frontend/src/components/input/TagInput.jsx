import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { MdLibraryAdd } from "react-icons/md";


const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function addNewTag() {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      addNewTag();
    }
  }

  function handleRemovetag(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className=" bg-yellow-100 flex gap-3 items-center text-yellow-700 px-3 py-1 rounded-2xl text-sm font-medium hover:bg-yellow-600 hover:text-white transition-all duration-200 cursor-pointer"
            >
              # {tag}
              <button
                onClick={() => {
                  handleRemovetag(tag);
                }}
              >
                <MdClose className="cursor-pointer" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className=" text-sm bg-yellow-50/50 border border-gray-400 font-medium px-3 py-2 rounded-md outline-none"
          placeholder="Add tags"
        />

        <button
          className="cursor-pointer w-8 h-8 flex items-center justify-center bg-yellow-500 rounded-full border-border-200"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl w-full h-full text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
