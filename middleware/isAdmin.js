const { errorHandler, unaAuthorizedError } = require("../utils/errorHandler");

const isAdmin = async function (req, res, next) {
  const role = req.userRole;

  if (!role) {
    return errorHandler(res, 403, {
      message: "you are not allowed to perform this action",
    });
  }

  if (role === "admin") {
    return next();
  }

  return unaAuthorizedError(res);
};

module.exports = isAdmin;
