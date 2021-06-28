const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/async');


// @desc   get all Users
// @route  GET /api/v1/admin/getalluser
// @access Privet
exports.getAllUser = asyncHandler(async(req, res, next) => {
    const users = await User.find();

    if(!users){
        return next(new ErrorResponse(`can't find any user`, 400 ));
    }
    res.status(200).json({
        success : true,
        count : users.length,
        data : users
    })
});

// @desc   get all Note
// @route  GET /api/v1/admin/getalluser
// @access Privet
exports.getAllNote = asyncHandler(async(req, res, next) => {
    const notes = await Note.find();

    if(!notes){
        return next(new ErrorResponse(`can't find any notes`, 400 ));
    }
    res.status(200).json({
        success : true,
        count : notes.length,
        data : notes
    })
});


// @desc   get a single course by id.
// @route  GET /api/v1/admin/user/:id
// @access Privet getSingleUser
exports.getSingleUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorResponse(`can't find any user with this ${req.params.id}`, 400 ));
    }
    res.status(200).json({
        success : true,
        data : user
    })
});

// @desc   get a single note by id.
// @route  GET /api/v1/admin/note/:id
// @access Privet 
exports.getSingleNote = asyncHandler(async(req, res, next) => {
    const note = await Note.findById(req.params.id);
    if(!note){
        return next(new ErrorResponse(`can't find any note with this ${req.params.id}`, 400 ));
    }
    res.status(200).json({
        success : true,
        data : note
    })
});



// @desc   Delete a Note
// @route  DELETE /api/v1/admin/note/:id
// @access Privet 
exports.deleteNote = asyncHandler(async(req, res, next) => {
    const note = await Note.findById(req.params.id);
    if(!note){
        return next(new ErrorResponse(`can't find any note with this ${req.params.id}`, 400 ));
    }

    note.remove();
    res.status(200).json({
        success : true,
        data : {}
    })
});


// @desc   Delete a User
// @route  DELETE /api/v1/admin/user/:id
// @access Privet 
exports.deleteUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorResponse(`can't find any note with this ${req.params.id}`, 400 ));
    }

    user.remove();

    res.status(200).json({
        success : true,
        data : {}
    })
});