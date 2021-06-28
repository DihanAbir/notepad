const Note = require("../models/Note");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc   create a note
// @route  POST /api/v1/note
// @access Privet
exports.createNote = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;
  const catagory = req.body.category;

  console.log(req.body.category.split(/\s+/).join("_"));

  req.body.category = req.body.category.split(/\s+/).join("_");
  console.log(`req.body`, req.body.category);

  const note = await Note.create(req.body);

  if (!note) {
    return next(new ErrorResponse(`can't find things on req.body`, 400));
  }

  res.status(201).json({
    success: true,
    data: note,
  });
});

// @desc   get all Notes
// @route  GET /api/v1/note/
// @access Privet
exports.getAllNote = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   get all Notes by user.
// @route  GET /api/v1/note/:userid/allnote
// @access Privet
exports.getAllNotebyUserId = asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  const notes = await Note.find({
    user: req.params.userid,
  });

  if (!notes) {
    return next(new ErrorResponse(`can't finy any notes with this user`, 400));
  }

  res.status(200).json({
    success: true,
    notes,
  });
});

// @desc   update a note with id.
// @route  PUT /api/v1/note/:id
// @access Privet
exports.updateNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(
      new ErrorResponse(`can't find notes with this id ${req.params.id}`, 400)
    );
  }

  // Make sure USER is note owner
  if (note.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this note`,
        401
      )
    );
  }

  // find by id an update.
  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // console.log(req.body.red);
  // console.log(req.params.id.green);

  res.status(200).json({
    success: true,
    data: note,
  });
});

// @desc   Delete a note with id.
// @route  DELETE /api/v1/note/:id
// @access Privet
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(
      new ErrorResponse(`can't find notes with this id ${req.params.id}`, 400)
    );
  }

  // Make sure USER is note owner
  if (note.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to Delete this note`,
        401
      )
    );
  }

  note.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc   get a single post by id.
// @route  GET /api/v1/note/:id
// @access Privet
exports.getNoteByID = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(
      new ErrorResponse(`can't find notes with this id ${req.params.id}`, 400)
    );
  }
  res.status(201).json({
    success: true,
    data: note,
  });
});
