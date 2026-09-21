export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === "entity.too.large")
    return res.status(413).json({
      success: false,
      message: "The request is too large.",
      error: { code: "PAYLOAD_TOO_LARGE" },
    });
  if (error instanceof SyntaxError && error.status === 400)
    return res.status(400).json({
      success: false,
      message: "The request could not be read.",
      error: { code: "INVALID_JSON" },
    });
  if (error.code === "ORIGIN_DENIED")
    return res.status(403).json({
      success: false,
      message: "This origin is not allowed.",
      error: { code: "ORIGIN_DENIED" },
    });
  console.error("Request failed:", error.name, error.code || "INTERNAL_ERROR");
  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
    error: { code: "INTERNAL_ERROR" },
  });
}
