const express = require("express");

const {
  getAllNotebyUserId,
  createNote,
  getAllNote,
  getNoteByID,
  updateNote,
  deleteNote,
} = require("../controllers/notes");

const Note = require("../models/Note");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// /api/v1/note/:userid/all
router
  .route("/")
  .post(protect, authorize("admin", "user"), createNote)
  .get(advancedResults(Note), getAllNote);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getNoteByID)
  .put(protect, authorize("admin", "user"), updateNote)
  .delete(protect, authorize("admin", "user"), deleteNote);

router.route("/:userid/allnote").get(getAllNotebyUserId);

module.exports = router;
