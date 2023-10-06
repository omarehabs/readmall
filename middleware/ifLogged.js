const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;
async function ifLogged(req, res, next) {
  try {
    if (!req.headers.authorization) return next();
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return next();

    const { verified, id, role ,avatarUrl} = jwt.verify(token, JWT_SECRET_KEY);

    if (role === "admin") return next();

    req.userRole = role;
    req.verified = verified;
    req.avatarUrl = avatarUrl;
    req.userId = id;

    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
}
module.exports = ifLogged;
