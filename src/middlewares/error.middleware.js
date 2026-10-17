export const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  const message =
    statusCode === 500
      ? "Ocurrió un error inesperado. Intenta nuevamente más tarde."
      : error.message;

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }

  return res.status(statusCode).render("error", {
    statusCode,
    message,
  });
};

export const notFoundHandler = (req, res) => {
  const statusCode = 404;
  const message = "La ruta solicitada no existe.";

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }

  return res.status(statusCode).render("error", {
    statusCode,
    message,
  });
};