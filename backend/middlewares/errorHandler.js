// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  const statusCode = res.statusCode === 200 ? (err.status || 500) : res.statusCode;

  res.status(statusCode);

  const errorResponse = {
    message: err.message || "Internal Server Error",
    ...(err.details && { details: err.details }),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  res.json(errorResponse);
};
