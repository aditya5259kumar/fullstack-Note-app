const express = require("express");
const Users = require("../models/users");
const Notes = require("../models/notes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const helper = require("../utils/helper");

module.exports = {
  // -------------user--------------
  // signup
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return helper.error(res, "All fields are required!", {}, 400);
      }

      const emailExist = await Users.findOne({ email });
      if (emailExist) {
        return helper.error(res, "User already exists!", {}, 400);
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await Users.create({
        name,
        email,
        password: hashPassword,
      });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        // { expiresIn: "5d" }
      );

      return helper.success(res, "User created successfully.", { token }, 201);
    } catch (error) {
      console.log(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // logIn
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const emailcheck = await Users.findOne({ email });
      if (!emailcheck) {
        return helper.error(res, "invalid credentials!", {}, 401);
      }

      const isMatch = await bcrypt.compare(password, emailcheck.password);
      if (!isMatch) {
        return helper.error(res, "invalid credentials!", {}, 401);
      }

      const token = jwt.sign(
        { id: emailcheck._id, email: emailcheck.email },
        process.env.JWT_SECRET,
        // { expiresIn: "5d" }
      );

      return helper.success(
        res,
        "User logged in successfully.",
        { token },
        201
      );
    } catch (error) {
      console.log(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // myProfile
  myProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const userProfile = await Users.findById(userId).select(
        "name email createdOn"
      );

      if (!userProfile) {
        return helper.error(res, "User not found!", {}, 404);
      }

      return helper.success(res, "User profile fetched.", userProfile, 200);
    } catch (error) {
      console.error(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // -------------note--------------

  // add note
  addNote: async (req, res) => {
    try {
      const { title, content, tags, isPinned } = req.body;
      const userId = req.user.id;

      if (!title || !content) {
        return helper.error(
          res,
          "title and content fields are required!",
          {},
          400
        );
      }

      const idcheck = await Users.findById(userId);

      if (!idcheck) {
        return helper.error(res, "User not found!", {}, 404);
      }

      const note = await Notes.create({
        title,
        content,
        tags,
        isPinned: isPinned === true,
        userId,
      });

      return helper.success(res, "note added successfully.", note, 201);
    } catch (error) {
      console.error(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // delete note
  deleteNote: async (req, res) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;

      if (!noteId) {
        return helper.error(res, "Note ID is required", {}, 400);
      }

      const note = await Notes.findOne({
        _id: noteId,
        userId: userId,
      });

      if (!note) {
        return helper.error(res, "Note not found", {}, 404);
      }

      await Notes.deleteOne({ _id: noteId });

      return helper.success(res, "Note deleted successfully", {}, 200);
    } catch (error) {
      console.error(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // edit note
  editNote: async (req, res) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;
      const { title, content, tags, isPinned } = req.body;

      const hasUpdates =
        title !== undefined ||
        content !== undefined ||
        tags !== undefined ||
        isPinned !== undefined;

      if (!hasUpdates) {
        return helper.error(res, "No changes provided!", {}, 400);
      }

      const updatedNote = await Notes.findOneAndUpdate(
        { _id: noteId, userId },
        { title, content, tags, isPinned },
        { new: true, runValidators: true }
      );

      if (!updatedNote) {
        return helper.error(res, "Note not found!", {}, 404);
      }

      return helper.success(res, "Note edited successfully", updatedNote, 200);
    } catch (error) {
      console.error(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // get all notes
  getAllNotes: async (req, res) => {
    try {
      const userId = req.user.id;

      const notes = await Notes.find({ userId }).sort({ isPinned: -1 });

      return helper.success(res, "all notes fetched successfully", notes, 200);
    } catch (error) {
      console.error(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // update isPinned value
  updateIsPinned: async (req, res) => {
    try {
      const { noteId } = req.params;
      const userId = req.user.id;
      const { isPinned } = req.body;

      if (typeof isPinned !== "boolean") {
        return helper.error(res, "isPinned must be a boolean value", {}, 400);
      }

      const updatedNote = await Notes.findOneAndUpdate(
        { _id: noteId, userId },
        { isPinned },
        { new: true }
      );

      if (!updatedNote) {
        return helper.error(res, "Note not found!", {}, 404);
      }

      return helper.success(
        res,
        "isPinned value updated successfully",
        updatedNote,
        200
      );
    } catch (error) {
      console.log(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },

  // search notes
  searchNote: async (req, res) => {
    try {
      const userId = req.user.id;
      const search = req.query.search || "";

      const notes = await Notes.find({
        userId,
        title: { $regex: search, $options: "i" },
      });

      return helper.success(res, "search results are -", notes, 200);
    } catch (error) {
      console.log(error);
      return helper.error(res, "Oops something went wrong!", error);
    }
  },
};
