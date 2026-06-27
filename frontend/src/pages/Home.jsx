import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UserProfile from "../pages/UserProfile";
import NoteCard from "../components/cards/NoteCard";
import AddEditNote from "../components/cards/AddEditNote";
import ViewNoteModal from "../pages/ViewNoteModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { RiStickyNoteAddFill } from "react-icons/ri";
import not_found from "../assets/not found.png";
import no_todo_yet from "../assets/no todo yet.png";

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [viewNoteModal, setViewNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const shouldLockScroll = openAddEditModel || viewNoteModal || showProfile;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openAddEditModel, viewNoteModal, showProfile]);

  // handle view note
  function handleViewNote(note) {
    setSelectedNote(note);
    setViewNoteModal(true);
  }

  function ProfileHandler() {
    setShowProfile((prev) => !prev);
  }

  const navigate = useNavigate();

  // handle logout
  function onLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  }

  // search notes
  async function searchNotes(query) {
    try {
      if (!query) {
        setIsSearch(false);
        getAllNotes();
        return;
      }

      const response = await axiosInstance.get(`/note?search=${query}`);

      if (response.data?.data) {
        setIsSearch(true);
        setAllNotes(response.data.data);
      }
    } catch (error) {
      console.log("note not found");
      toast.error("Search failed", error);
    }
  }

  // handle pin
  async function handlePinNote(note) {
    const pinned = !note.isPinned;
    try {
      await axiosInstance.patch(`/update-note-pinned/${note._id}`, {
        isPinned: pinned,
      });
      getAllNotes();
      if (pinned) {
        toast.success("note Pinned successfully");
      } else {
        toast.success("note UnPinned successfully");
      }
    } catch (error) {
      // console.error("Failed to pin note", error);
      toast.error("Failed to pin note", error);
    }
  }

  // handle delete
  async function handleDelete(note) {
    try {
      await axiosInstance.delete(`/deletenote/${note._id}`);
      getAllNotes();
      toast.success("note Delete successfully");
    } catch (error) {
      // console.error("Failed to delete note", error);
      toast.error("Failed to delete note", error);
    }
  }

  // handle edit
  async function handleEdit(note) {
    setNoteToEdit(note);
    setOpenAddEditModel(true);
  }

  // get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/me");

      if (response.data?.data) {
        setUserInfo(response.data.data);
        return true;
      }

      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }

      return false;
    }
  };

  const loadData = async () => {
    const authenticated = await getUserInfo();

    if (!authenticated) return;

    await getAllNotes();
  };

  // get all notes
  const getAllNotes = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/getallnotes");

      if (response.data?.data) {
        setAllNotes(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login", { replace: true });
      } else {
        toast.error("Failed to fetch notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50/50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>

          <p className="mt-6 text-yellow-700 font-semibold text-lg">
            Loading your notes...
          </p>

          <p className="text-sm text-yellow-500 mt-2">
            Please wait a few seconds
          </p>
        </div>
      ) : (
        <div className="min-h-screen bg-violet-50/50">
          <ToastContainer />

          <Navbar
            userInfo={userInfo}
            searchNotes={searchNotes}
            ProfileHandler={ProfileHandler}
            getAllNotes={getAllNotes}
          />

          <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 py-6 sm:py-8">
              {allNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => handleViewNote(note)}
                  className="cursor-pointer"
                >
                  <NoteCard
                    title={note.title}
                    content={note.content}
                    tags={note.tags.map((item, index) => (
                      <span
                        key={index}
                        className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-600 hover:text-white transition-all duration-200"
                      >
                        {`#${item}`}
                      </span>
                    ))}
                    isPinned={note.isPinned}
                    formattedDate={`${new Date(
                      note.createdOn,
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}`}
                    weekday={`${new Date(note.createdOn).toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "long",
                      },
                    )}`}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDelete(note);
                    }}
                    onEdit={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    onPinNote={(e) => {
                      e.stopPropagation();
                      handlePinNote(note);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {!loading && allNotes.length === 0 && (
            <div className="min-h-auto flex flex-col items-center justify-center">
              <img
                src={isSearch ? not_found : no_todo_yet}
                alt="No notes"
                className="w-100 h-auto mb-4"
              />

              <div className="text-center px-4 max-w-md mx-auto">
                <p className="text-2xl font-bold text-yellow-800">
                  {isSearch ? "No results found!" : "No Notes yet!"}
                </p>

                <p className="mt-2 text-sm font-semibold text-yellow-800">
                  {isSearch
                    ? "Try searching for a different keyword."
                    : "Create your first note by clicking the Add button below."}
                </p>
              </div>
            </div>
          )}

          {/* Add Note Button */}
          <button
            className="cursor-pointer fixed right-6 bottom-6 shadow-2xl hover:-translate-y-1 transition-all
      w-16 h-16 rounded-full flex items-center justify-center
      bg-linear-to-r from-yellow-400 to-yellow-700"
            onClick={() => {
              setNoteToEdit(null);
              setOpenAddEditModel(true);
            }}
          >
            <RiStickyNoteAddFill className="text-[32px] text-white" />
          </button>

          {/* Add/Edit Modal */}
          {openAddEditModel && (
            <AddEditNote
              setOpenAddEditModel={setOpenAddEditModel}
              getAllNotes={getAllNotes}
              noteToEdit={noteToEdit}
            />
          )}

          {/* Profile Modal */}
          {showProfile && (
            <UserProfile
              userInfo={userInfo}
              onLogout={onLogout}
              setShowProfile={setShowProfile}
            />
          )}

          {/* View Note Modal */}
          {viewNoteModal && (
            <ViewNoteModal
              note={selectedNote}
              onClose={() => setViewNoteModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
