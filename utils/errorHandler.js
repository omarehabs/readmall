function errorHandler(res, statusCode, error) {
  const errorMessage = error.errors ? error.errors[0].message : error.message;
  console.log("error", error);
  return res.status(statusCode).json({
    error: true,
    message: errorMessage,
  });
}

function unaAuthorizedError(res) {
  console.log("error",'unaAuthorizedError');
  return res.status(403).json({
    error: true,
    message: "you are not allowed to perform this action",
  });
}

function serverError(res) {
  console.log("error",'serverError');
  return res.status(503).json({
      error: true,
      message: 'server error please try again later'
  });
}


module.exports = { errorHandler, unaAuthorizedError,serverError };
