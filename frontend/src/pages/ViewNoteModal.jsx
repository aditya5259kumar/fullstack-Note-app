import React from "react";
import { IoMdClose } from "react-icons/io";
import { RiPushpinFill, RiPushpinLine } from "react-icons/ri";
import { LuCalendarFold } from "react-icons/lu";

const ViewNoteModal = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 px-2 sm:px-4 flex items-center backdrop-blur-sm justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:rounded-l-xl sm:before:rounded-l-2xl max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-yellow-200 p-3 sm:p-5 border-b border-yellow-100">
          <div className="flex items-center gap-1 sm:gap-3 bg-white/80 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
            <LuCalendarFold className="text-sm sm:text-base text-yellow-600" />
            <span className="text-yelloe-700 font-semibold text-xs sm:text-sm">
              {new Date(note.createdOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="hidden sm:inline">{", "}</span>
            <span className="text-gray-500 text-[10px] sm:text-xs font-medium">
              {new Date(note.createdOn).toLocaleDateString("en-GB", {
                weekday: "long",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-white"
            >
              <IoMdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 max-h-[calc(95vh-80px)] sm:max-h-[70vh] overflow-y-auto">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 wrap-break-word">
              {note.title}
            </h2>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                TAGS
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-gray-700">Status:</span>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                  note.isPinned
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {note.isPinned ? "Pinned" : "Unpinned"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
