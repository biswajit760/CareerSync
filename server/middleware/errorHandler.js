// server/middleware/errorHandler.js

// 🔍 Development Error Response (Detailed)
const sendErrorDev = (err, res) => {
  console.error("💥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    },
  });
};

// 🔒 Production Error Response (Safe)
const sendErrorProd = (err, res) => {
  // Known (operational) error → safe to show
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown error → log internally, hide from user
  console.error("💥 UNKNOWN ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};

// 🧠 Global Error Middleware
module.exports = (err, req, res, next) => {
  console.log("🔥 ERROR OBJECT:", err);
  console.log("👉 isOperational:", err.isOperational);
  console.log("👉 statusCode:", err.statusCode);
  console.log("👉 message:", err.message);
  console.log("👉 NODE_ENV:", process.env.NODE_ENV);

  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  // Always handle both dev & prod safely
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else {
    return sendErrorProd(err, res);
  }
};