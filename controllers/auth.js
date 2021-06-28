const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// @desc   Register a user
// @route  POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async(req, res, next) => {
    const {name, email, password, role} = req.body;

    // Create user 
    const user = await User.create({
        name,
        email, 
        password,
        role
    })

    // Create token .
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success : true, token , data : user});
    sendTokenResponse(user, 200, res);
})


// @desc   Login a user
// @route  POST /api/v1/auth/register
// @access Public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password} = req.body;

    // Validate email & password
    if(!email || !password){
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if(!user){
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    
    // Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success : true, token , data : user});
    sendTokenResponse(user, 200, res);

})


// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = req.user;
    console.log(user);
  
    res.status(200).json({
      success: true,
      data: user,
    });
});

// @desc   Forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access Private
exports.forgotpassword = asyncHandler(async(req, res, next) => {
  let user = await User.findOne({ email : req.body.email});

  if(!user){
    return next(new ErrorResponse('There is no user with that email', 401));
  }
  
  // Get reset token 
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken.pink);

  await user.save({validateBeforeSave : false});

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are reciving this email because you (or someone else) has requested the reset of a password please add a PUT request to : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email : user.email,
      subject : 'Password reset token',
      message
    })

    res.status(200).json({ success : true, data : 'Email sent'});
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave : false})
    return next(new ErrorResponse('Email could not be sent', 500));
  }

});


// @desc   Reset Password
// @route  PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async(req, res, next) => {
  // Get hashed token 
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire : { $gt: Date.now()}
  })

  if(!user){
    return next(new ErrorResponse('Invalid token', 400));
  }

  // SET NEW Password.
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
})

// @desc   Update  password
// @route  POST /api/v1/auth/updatedepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById(req.user.id).select('+password');

  // Check current passwords
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse('Password in correct', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
})


// @desc   Update user details
// @route  POST /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

  const fieldsToUpdate = {
    name : req.body.name,
    email : req.body.email
  }
  console.log(req.user);
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate,{
    new : true,
    runValidators : true
  })

  res.status(200).json({success : true, data : user})
})





//JWT_COOKIE_EXPIRE = 30
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
      expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly : true
    };

if(process.env.NODE_ENV === 'production'){
      options.secure = true
    }

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({ success : true , token})
}