const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { errorHandler, unaAuthorizedError } = require("../utils/errorHandler");

async function isLoggedIn(req, res, next) {
  // const token = req.cookies.accessToken;
  if (!req.headers.authorization) {
    return errorHandler(res, 403, {
      message: "you must login first!",
    });
  }
  try {
    const token =
      req.headers.authorization.split(" ")[1] ||
      req.headers.authorization.split(" ")[1];
    if (!token) {
      return errorHandler(res, 403, {
        message: "you must login first!",
      });
    }
    
    const user = jwt.verify(token, JWT_SECRET_KEY);
    // if (user.role === 'admin') {
    //   return unaAuthorizedError(res);
    // }
    req.verified = user.verified;
    req.userId = user.id;
    req.userRole = user.role;
    req.avatarUrl = user.avatarUrl;
    return next();
  } catch (e) {
    return errorHandler(res, 403, e);
  }
}
module.exports = isLoggedIn;
