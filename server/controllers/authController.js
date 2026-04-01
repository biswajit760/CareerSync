const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Generate JWT token for authenticated users
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register new user with email and password
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if email already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Create new user (password will be hashed automatically by User model)
    const user = new User({
      name,
      email,
      passwordHash: password,
      authProvider: 'local'
    });

    await user.save();

    // Generate JWT token for the new user
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

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login user with email and password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email and include password field
    const user = await User.findByCredentials(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Prevent email/password login for Google OAuth users
    if (user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google sign-in. Please login with Google.'
      });
    }

    // Verify password using bcrypt comparison
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token for authenticated user
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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Handle Google OAuth login and registration
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, profilePicture } = req.body;

    // Validate required Google user data
    if (!googleId || !email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Google user data'
      });
    }

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, proceed with login
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

    // Check if email is already registered with email/password
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login with email/password.'
      });
    }

    // Create new user with Google account
    user = new User({
      name,
      email,
      googleId,
      authProvider: 'google',
      profilePicture: profilePicture || undefined
    });

    await user.save();

    // Generate JWT token for new user
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully with Google',
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

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: error.message
    });
  }
};

// Get current user profile (requires authentication)
exports.getMe = async (req, res) => {
  try {
    // User ID is extracted from JWT token by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
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

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
