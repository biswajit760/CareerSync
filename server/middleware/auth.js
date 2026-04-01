const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and protect routes
const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Authorization denied.'
    });
  }

  // Extract token (format: "Bearer TOKEN")
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user id to request object
    req.user = { id: decoded.id };

    next(); // Continue to next middleware/route handler

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authorization denied.'
    });
  }
};

module.exports = verifyToken;
