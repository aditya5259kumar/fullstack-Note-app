import React, { useState, useEffect } from "react";
import TagInput from "../input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDownloadDone } from "react-icons/md";

const AddEditNote = ({ setOpenAddEditModel, getAllNotes, noteToEdit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const [error, setError] = useState({});

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || "");
      setContent(noteToEdit.content || "");
      setTags(noteToEdit.tags || []);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [noteToEdit]);

  // add note
  async function addNewNote() {
    try {
      const response = await axiosInstance.post("/addnote", {
        title,
        content,
        tags,
      });

      if (response.data?.data) {
        getAllNotes();
        setOpenAddEditModel(false);
        toast.success("note Added successfully");
      }
    } catch (error) {
      setError({
        apiError:
          error.response?.data?.message || "Failed to add note. Try again.",
      });
    }
  }

  // edit note
  async function editNote() {
    try {
      const response = await axiosInstance.patch(
        `/editnote/${noteToEdit._id}`,
        {
          title,
          content,
          tags,
        }
      );

      if (response.data?.data) {
        getAllNotes();
        setOpenAddEditModel(false);
        toast.success("note Edited successfully");
      }
    } catch (error) {
      setError({
        apiError:
          error.response?.data?.message || "Failed to edit note. Try again.",
      });
    }
  }

  async function handleAddNote() {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "note title is required";
    }

    if (!content.trim()) {
      newErrors.content = "content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    if (noteToEdit) {
      await editNote();
    } else {
      await addNewNote();
    }
  }

  return (
    // BACKDROP
    <div
      className="fixed inset-0 z-50 px-4 flex items-center backdrop-blur-xs justify-center bg-black/30 "
      onClick={() => setOpenAddEditModel(false)}
    >
      {/* MODAL CARD */}
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <div className="flex flex-col gap-2">
          <label className="input-label text-yellow-700 font-bold">TITLE</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add note title"
            className="text-lg font-semibold border border-gray-400 bg-yellow-50/50 rounded-md text-gray-800 outline-none  px-3 py-1"
          />
          {error.title && (
            <p className="mb-1 text-red-500 text-xs mt-1">{error.title}</p>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label text-yellow-700 font-bold">CONTENT</label>
          <textarea
            placeholder="Add content to your note"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="text-sm border border-gray-400 bg-yellow-50/50 text-gray-600 outline-none  p-3 rounded-md resize-none"
          />
          {error.content && (
            <p className="mb-1 text-red-500 text-xs mt-1">{error.content}</p>
          )}
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-2 mt-6 border-b pb-8 border-gray-200">
          <label className="input-label font-bold text-yellow-700">TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8 ">
          <button
            onClick={() => setOpenAddEditModel(false)}
            className="px-4 py-2 text-sm text-gray-500 rounded-lg border border-gray-300 bg-gray-100"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 transition-all ease-in-out hover:-translate-y-1 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600"
            onClick={handleAddNote}
          >
            {noteToEdit ? (
              <span className="flex items-center gap-2">
                UPDATE <FiEdit className="text-[16px]" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                ADD <MdOutlineDownloadDone className="text-xl" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNote;
