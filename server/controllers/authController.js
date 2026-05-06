const User = require('../model/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

//
// ================= REGISTER =================
//
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const user = new User({
    name,
    email,
    passwordHash: password,
    authProvider: 'local'
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      scanCount: user.scanCount,
      scanLimit: user.scanLimit,
      profilePicture: user.profilePicture
    }
  });
});

//
// ================= LOGIN =================
//
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findByCredentials(email);

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.authProvider === 'google') {
    return next(new AppError('Please login using Google', 400));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      scanCount: user.scanCount,
      scanLimit: user.scanLimit,
      profilePicture: user.profilePicture
    }
  });
});

//
// ================= GOOGLE AUTH =================
//
exports.googleAuth = asyncHandler(async (req, res, next) => {
  const { googleId, email, name, profilePicture } = req.body;

  if (!googleId || !email || !name) {
    return next(new AppError('Missing required Google user data', 400));
  }

  let user = await User.findOne({ googleId });

  // Existing Google user
  if (user) {
    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        scanCount: user.scanCount,
        scanLimit: user.scanLimit,
        profilePicture: user.profilePicture
      }
    });
  }

  // Email conflict
  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) {
    return next(new AppError(
      'Account exists with email/password. Please login normally.',
      400
    ));
  }

  // Create new Google user
  user = new User({
    name,
    email,
    googleId,
    authProvider: 'google',
    profilePicture: profilePicture || undefined
  });

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered with Google',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      scanCount: user.scanCount,
      scanLimit: user.scanLimit,
      profilePicture: user.profilePicture
    }
  });
});

//
// ================= GET PROFILE =================
//
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      scanCount: user.scanCount,
      scanLimit: user.scanLimit,
      profilePicture: user.profilePicture,
      authProvider: user.authProvider,
      savedJobs: user.savedJobs,
      createdAt: user.createdAt
    }
  });
});